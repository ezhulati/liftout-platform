import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/lib/email';

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.enum(['individual', 'company']),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, userType, companyName, industry, location } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        userType,
        emailVerified: false,
        profileCompleted: false,
        profile: {
          create: {
            location: location || '',
            bio: '',
            skillsSummary: '',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // If company user, create company record
    if (userType === 'company' && companyName) {
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await prisma.company.create({
        data: {
          name: companyName,
          slug: `${slug}-${Date.now()}`,
          industry: industry || 'Technology',
          headquartersLocation: location || '',
          verificationStatus: 'pending',
          users: {
            create: {
              userId: user.id,
              role: 'admin',
              isPrimaryContact: true,
              title: 'Account Owner',
            },
          },
        },
      });
    }

    // Send welcome email (don't block on failure)
    sendWelcomeEmail({
      to: user.email,
      recipientName: user.firstName,
      userType: userType as 'individual' | 'company',
    }).catch((err) => {
      console.error('Failed to send welcome email:', err);
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}

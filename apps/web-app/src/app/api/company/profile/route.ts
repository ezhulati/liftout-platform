import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const companySizeMap: Record<string, string> = {
  'startup': 'startup',
  'small': 'small',
  'medium': 'medium',
  'large': 'large',
  'enterprise': 'enterprise',
};

const companyProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  description: z.string().min(50).optional(),
  industry: z.string().optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
  culture: z.object({
    values: z.array(z.string()).optional(),
    workStyle: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
  }).optional(),
}).partial();

// GET - Retrieve company profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's company
    const companyUser = await prisma.companyUser.findFirst({
      where: { userId: session.user.id },
      include: {
        company: true,
      },
    });

    if (!companyUser?.company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const company = companyUser.company;

    return NextResponse.json({
      id: company.id,
      name: company.name,
      description: company.description,
      industry: company.industry,
      size: company.companySize,
      location: company.headquartersLocation,
      website: company.websiteUrl,
      founded: company.foundedYear,
      logoUrl: company.logoUrl,
      verificationStatus: company.verificationStatus,
      culture: {
        values: company.values as string[] || [],
        workStyle: [],
        benefits: company.benefits as string[] || [],
      },
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  } catch (error) {
    console.error('Get company profile error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve company profile' },
      { status: 500 }
    );
  }
}

// PUT - Update company profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Demo user handling - simulate success without database changes
    if (isDemoUser(session.user.email)) {
      console.log('[Demo] Company profile update simulated for demo user');
      return NextResponse.json({
        success: true,
        message: 'Company profile updated successfully',
      });
    }

    const body = await request.json();

    // Validate input
    const validationResult = companyProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Get user's company
    const companyUser = await prisma.companyUser.findFirst({
      where: { userId: session.user.id },
      include: {
        company: true,
      },
    });

    if (!companyUser?.company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Build company update data
    const companyUpdateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.companyName) companyUpdateData.name = updates.companyName;
    if (updates.description !== undefined) companyUpdateData.description = updates.description;
    if (updates.industry !== undefined) companyUpdateData.industry = updates.industry;
    if (updates.size !== undefined) companyUpdateData.companySize = companySizeMap[updates.size] || updates.size;
    if (updates.location !== undefined) companyUpdateData.headquartersLocation = updates.location;
    if (updates.website !== undefined) companyUpdateData.websiteUrl = updates.website || null;
    if (updates.founded !== undefined) companyUpdateData.foundedYear = updates.founded;

    // Handle culture fields
    if (updates.culture) {
      if (updates.culture.values) companyUpdateData.values = updates.culture.values;
      if (updates.culture.benefits) companyUpdateData.benefits = updates.culture.benefits;
      // Store workStyle in settings or companyCulture
      if (updates.culture.workStyle) {
        companyUpdateData.companyCulture = updates.culture.workStyle.join(', ');
      }
    }

    // Update company
    await prisma.company.update({
      where: { id: companyUser.company.id },
      data: companyUpdateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Company profile updated successfully',
    });
  } catch (error) {
    console.error('Update company profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update company profile' },
      { status: 500 }
    );
  }
}

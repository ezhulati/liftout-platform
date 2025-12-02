import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const verificationSchema = z.object({
  companyRegistrationNumber: z.string().min(1),
  taxId: z.string().min(1),
  businessAddress: z.string().min(10),
  contactName: z.string().min(2),
  contactTitle: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    uploadedAt: z.string(),
  })).optional(),
});

// GET - Get verification status
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
      verificationStatus: company.verificationStatus,
      verificationDocs: company.verificationDocs,
      verifiedAt: company.verifiedAt,
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve verification status' },
      { status: 500 }
    );
  }
}

// POST - Submit verification documents
export async function POST(request: Request) {
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
      console.log('[Demo] Company verification submitted for demo user');
      return NextResponse.json({
        success: true,
        message: 'Verification documents submitted successfully',
        verificationStatus: 'pending',
      });
    }

    const body = await request.json();

    // Validate input
    const validationResult = verificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

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

    // Store verification data
    const verificationData = {
      companyRegistrationNumber: data.companyRegistrationNumber,
      taxId: data.taxId,
      businessAddress: data.businessAddress,
      contact: {
        name: data.contactName,
        title: data.contactTitle,
        email: data.contactEmail,
        phone: data.contactPhone,
      },
      documents: data.documents || [],
      submittedAt: new Date().toISOString(),
    };

    // Update company verification status
    await prisma.company.update({
      where: { id: companyUser.company.id },
      data: {
        verificationStatus: 'pending',
        verificationDocs: verificationData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification documents submitted successfully. We\'ll review them within 2 business days.',
      verificationStatus: 'pending',
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification documents' },
      { status: 500 }
    );
  }
}

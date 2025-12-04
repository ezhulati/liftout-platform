import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PUT /api/companies/[id]/culture - Update company culture
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is a company user and belongs to this company
  if (session.user.userType !== 'company') {
    return NextResponse.json({ error: 'Not authorized - company users only' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { cultureDescription, values, workStyle, benefits } = body;

    // Verify user belongs to this company
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId: session.user.id,
        companyId: id,
      },
    });

    if (!companyUser) {
      return NextResponse.json({ error: 'Not authorized for this company' }, { status: 403 });
    }

    // Update the company culture
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        companyCulture: cultureDescription,
        values: values || [],
        benefits: benefits || [],
        // Store workStyle in settings or as part of culture
        settings: {
          workStyle: workStyle || 'Flexible',
        },
      },
      select: {
        id: true,
        companyCulture: true,
        values: true,
        benefits: true,
        settings: true,
      },
    });

    return NextResponse.json({
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Error updating company culture:', error);
    return NextResponse.json(
      { error: 'Failed to update company culture' },
      { status: 500 }
    );
  }
}

// GET /api/companies/[id]/culture - Get company culture
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        companyCulture: true,
        values: true,
        benefits: true,
        settings: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Extract workStyle from settings
    const settings = company.settings as Record<string, unknown> | null;
    const workStyle = settings?.workStyle || 'Flexible';

    return NextResponse.json({
      cultureDescription: company.companyCulture || '',
      values: company.values || [],
      benefits: company.benefits || [],
      workStyle,
    });
  } catch (error) {
    console.error('Error fetching company culture:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company culture' },
      { status: 500 }
    );
  }
}

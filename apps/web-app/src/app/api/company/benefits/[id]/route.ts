import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Benefit schema for updates
const benefitUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  category: z.enum(['health', 'financial', 'learning', 'lifestyle', 'perks']).optional(),
  value: z.string().optional(),
});

interface Benefit {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'financial' | 'learning' | 'lifestyle' | 'perks';
  value: string;
}

// Helper to get user's company
async function getUserCompany(userId: string) {
  const companyUser = await prisma.companyUser.findFirst({
    where: { userId },
    include: { company: true },
  });
  return companyUser?.company;
}

// PUT - Update a benefit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const company = await getUserCompany(session.user.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const benefitId = params.id;
    const body = await request.json();
    const validationResult = benefitUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;
    const existingBenefits = (company.benefits as unknown as Benefit[]) || [];
    const benefitIndex = existingBenefits.findIndex((b) => b.id === benefitId);

    if (benefitIndex === -1) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    // Update the benefit
    const updatedBenefit = {
      ...existingBenefits[benefitIndex],
      ...updates,
    };
    existingBenefits[benefitIndex] = updatedBenefit;

    // Save to database
    await prisma.company.update({
      where: { id: company.id },
      data: { benefits: JSON.parse(JSON.stringify(existingBenefits)) },
    });

    return NextResponse.json({ success: true, benefit: updatedBenefit });
  } catch (error) {
    console.error('Update benefit error:', error);
    return NextResponse.json({ error: 'Failed to update benefit' }, { status: 500 });
  }
}

// DELETE - Delete a benefit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const company = await getUserCompany(session.user.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const benefitId = params.id;
    const existingBenefits = (company.benefits as unknown as Benefit[]) || [];
    const filteredBenefits = existingBenefits.filter((b) => b.id !== benefitId);

    if (filteredBenefits.length === existingBenefits.length) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    // Save to database
    await prisma.company.update({
      where: { id: company.id },
      data: { benefits: JSON.parse(JSON.stringify(filteredBenefits)) },
    });

    return NextResponse.json({ success: true, message: 'Benefit deleted' });
  } catch (error) {
    console.error('Delete benefit error:', error);
    return NextResponse.json({ error: 'Failed to delete benefit' }, { status: 500 });
  }
}

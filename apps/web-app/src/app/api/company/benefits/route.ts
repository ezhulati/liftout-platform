import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

// Benefit schema
const benefitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  category: z.enum(['health', 'financial', 'learning', 'lifestyle', 'perks']),
  value: z.string().optional().default(''),
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

// GET - List all benefits
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const company = await getUserCompany(session.user.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Parse benefits from JSON field
    const benefits = (company.benefits as unknown as Benefit[]) || [];

    return NextResponse.json({ benefits });
  } catch (error) {
    console.error('Get benefits error:', error);
    return NextResponse.json({ error: 'Failed to get benefits' }, { status: 500 });
  }
}

// POST - Create a new benefit
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const company = await getUserCompany(session.user.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const body = await request.json();
    const validationResult = benefitSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const newBenefit: Benefit = {
      id: randomUUID(),
      ...validationResult.data,
    };

    // Get existing benefits and add new one
    const existingBenefits = (company.benefits as unknown as Benefit[]) || [];
    const updatedBenefits = [...existingBenefits, newBenefit];

    // Update company
    await prisma.company.update({
      where: { id: company.id },
      data: { benefits: JSON.parse(JSON.stringify(updatedBenefits)) },
    });

    return NextResponse.json({ success: true, benefit: newBenefit });
  } catch (error) {
    console.error('Create benefit error:', error);
    return NextResponse.json({ error: 'Failed to create benefit' }, { status: 500 });
  }
}

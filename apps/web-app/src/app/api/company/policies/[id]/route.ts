import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Policy schema for updates
const policyUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  category: z.enum(['remote', 'pto', 'parental', 'development', 'wellness', 'other']).optional(),
  isHighlight: z.boolean().optional(),
});

interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'remote' | 'pto' | 'parental' | 'development' | 'wellness' | 'other';
  isHighlight: boolean;
}

interface CompanySettings {
  policies?: Policy[];
  [key: string]: unknown;
}

// Helper to get user's company
async function getUserCompany(userId: string) {
  const companyUser = await prisma.companyUser.findFirst({
    where: { userId },
    include: { company: true },
  });
  return companyUser?.company;
}

// PUT - Update a policy
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

    const policyId = params.id;
    const body = await request.json();
    const validationResult = policyUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;
    const settings = (company.settings as unknown as CompanySettings) || {};
    const existingPolicies = settings.policies || [];
    const policyIndex = existingPolicies.findIndex((p) => p.id === policyId);

    if (policyIndex === -1) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    // Update the policy
    const updatedPolicy = {
      ...existingPolicies[policyIndex],
      ...updates,
    };
    existingPolicies[policyIndex] = updatedPolicy;

    // Save to database
    await prisma.company.update({
      where: { id: company.id },
      data: {
        settings: JSON.parse(JSON.stringify({
          ...settings,
          policies: existingPolicies,
        })),
      },
    });

    return NextResponse.json({ success: true, policy: updatedPolicy });
  } catch (error) {
    console.error('Update policy error:', error);
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}

// DELETE - Delete a policy
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

    const policyId = params.id;
    const settings = (company.settings as unknown as CompanySettings) || {};
    const existingPolicies = settings.policies || [];
    const filteredPolicies = existingPolicies.filter((p) => p.id !== policyId);

    if (filteredPolicies.length === existingPolicies.length) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    // Save to database
    await prisma.company.update({
      where: { id: company.id },
      data: {
        settings: JSON.parse(JSON.stringify({
          ...settings,
          policies: filteredPolicies,
        })),
      },
    });

    return NextResponse.json({ success: true, message: 'Policy deleted' });
  } catch (error) {
    console.error('Delete policy error:', error);
    return NextResponse.json({ error: 'Failed to delete policy' }, { status: 500 });
  }
}

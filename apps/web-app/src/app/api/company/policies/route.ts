import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

// Policy schema
const policySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  category: z.enum(['remote', 'pto', 'parental', 'development', 'wellness', 'other']),
  isHighlight: z.boolean().optional().default(false),
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

// GET - List all policies
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

    // Parse policies from settings JSON field
    const settings = (company.settings as unknown as CompanySettings) || {};
    const policies = settings.policies || [];

    return NextResponse.json({ policies });
  } catch (error) {
    console.error('Get policies error:', error);
    return NextResponse.json({ error: 'Failed to get policies' }, { status: 500 });
  }
}

// POST - Create a new policy
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
    const validationResult = policySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const newPolicy: Policy = {
      id: randomUUID(),
      ...validationResult.data,
    };

    // Get existing settings and policies
    const settings = (company.settings as unknown as CompanySettings) || {};
    const existingPolicies = settings.policies || [];
    const updatedPolicies = [...existingPolicies, newPolicy];

    // Update company settings
    await prisma.company.update({
      where: { id: company.id },
      data: {
        settings: JSON.parse(JSON.stringify({
          ...settings,
          policies: updatedPolicies,
        })),
      },
    });

    return NextResponse.json({ success: true, policy: newPolicy });
  } catch (error) {
    console.error('Create policy error:', error);
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}

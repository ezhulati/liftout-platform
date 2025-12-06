import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to check if user is team admin/lead
async function isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { createdBy: true },
  });

  if (team?.createdBy === userId) return true;

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      status: 'active',
      OR: [{ isAdmin: true }, { isLead: true }],
    },
  });
  return !!member;
}

// GET - List blocked companies for a team
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: teamId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user is team admin
    const canView = await isTeamAdmin(teamId, session.user.id);
    if (!canView) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { blockedCompanies: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const blockedIds = (team.blockedCompanies as string[]) || [];

    // Get company details for blocked companies
    let blockedCompanies: { id: string; name: string; logoUrl?: string | null }[] = [];
    if (blockedIds.length > 0) {
      const companies = await prisma.company.findMany({
        where: { id: { in: blockedIds } },
        select: { id: true, name: true, logoUrl: true },
      });
      blockedCompanies = companies;
    }

    return NextResponse.json({
      blockedCompanies,
      count: blockedCompanies.length,
    });
  } catch (error) {
    console.error('Get blocked companies error:', error);
    return NextResponse.json({ error: 'Failed to fetch blocked companies' }, { status: 500 });
  }
}

// POST - Block a company
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: teamId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user is team admin
    const canEdit = await isTeamAdmin(teamId, session.user.id);
    if (!canEdit) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get current blocked list
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { blockedCompanies: true },
    });

    const currentBlocked = (team?.blockedCompanies as string[]) || [];

    if (currentBlocked.includes(companyId)) {
      return NextResponse.json({ error: 'Company is already blocked' }, { status: 400 });
    }

    // Add company to blocked list
    await prisma.team.update({
      where: { id: teamId },
      data: {
        blockedCompanies: [...currentBlocked, companyId],
      },
    });

    return NextResponse.json({
      success: true,
      message: `${company.name} has been blocked from viewing your team`,
      blockedCompany: { id: company.id, name: company.name },
    });
  } catch (error) {
    console.error('Block company error:', error);
    return NextResponse.json({ error: 'Failed to block company' }, { status: 500 });
  }
}

// DELETE - Unblock a company
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: teamId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user is team admin
    const canEdit = await isTeamAdmin(teamId, session.user.id);
    if (!canEdit) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get current blocked list
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { blockedCompanies: true },
    });

    const currentBlocked = (team?.blockedCompanies as string[]) || [];

    if (!currentBlocked.includes(companyId)) {
      return NextResponse.json({ error: 'Company is not in blocked list' }, { status: 400 });
    }

    // Remove company from blocked list
    await prisma.team.update({
      where: { id: teamId },
      data: {
        blockedCompanies: currentBlocked.filter(id => id !== companyId),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Company has been unblocked',
    });
  } catch (error) {
    console.error('Unblock company error:', error);
    return NextResponse.json({ error: 'Failed to unblock company' }, { status: 500 });
  }
}

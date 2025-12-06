import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Close an opportunity (mark as filled)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason, selectedTeamId, notifyApplicants = true } = body;

    // Get opportunity and verify ownership
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        companyId: true,
        metadata: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Verify user is company admin/member
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId: session.user.id,
        companyId: opportunity.companyId,
      },
    });

    if (!companyUser) {
      return NextResponse.json(
        { error: 'Not authorized to manage this opportunity' },
        { status: 403 }
      );
    }

    if (opportunity.status === 'filled') {
      return NextResponse.json({
        success: true,
        message: 'Opportunity is already closed',
        status: 'filled',
      });
    }

    // Close the opportunity (set status to filled)
    const currentMetadata = (opportunity.metadata as Record<string, unknown>) || {};

    await prisma.opportunity.update({
      where: { id },
      data: {
        status: 'filled',
        metadata: {
          ...currentMetadata,
          closedAt: new Date().toISOString(),
          closedBy: session.user.id,
          closeReason: reason || 'Position filled',
          selectedTeamId,
          previousStatus: opportunity.status,
        },
      },
    });

    // Update pending applications to rejected
    if (notifyApplicants) {
      const updatedApps = await prisma.teamApplication.updateMany({
        where: {
          opportunityId: id,
          status: { in: ['submitted', 'reviewing', 'interviewing'] },
          // Don't update the selected team's application
          ...(selectedTeamId && { teamId: { not: selectedTeamId } }),
        },
        data: {
          status: 'rejected',
          rejectionReason: 'Position has been filled',
          finalDecisionAt: new Date(),
        },
      });

      // If there's a selected team, mark their application as accepted
      if (selectedTeamId) {
        await prisma.teamApplication.updateMany({
          where: {
            opportunityId: id,
            teamId: selectedTeamId,
          },
          data: {
            status: 'accepted',
            finalDecisionAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `"${opportunity.title}" has been closed`,
        status: 'filled',
        applicationsRejected: updatedApps.count,
        selectedTeamId,
      });
    }

    return NextResponse.json({
      success: true,
      message: `"${opportunity.title}" has been closed`,
      status: 'filled',
    });
  } catch (error) {
    console.error('Close opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to close opportunity' },
      { status: 500 }
    );
  }
}

// DELETE - Reopen a closed opportunity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    // Get opportunity
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        companyId: true,
        metadata: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Verify user is company admin/member
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId: session.user.id,
        companyId: opportunity.companyId,
      },
    });

    if (!companyUser) {
      return NextResponse.json(
        { error: 'Not authorized to manage this opportunity' },
        { status: 403 }
      );
    }

    if (opportunity.status !== 'filled') {
      return NextResponse.json({
        success: true,
        message: 'Opportunity is not closed',
        status: opportunity.status,
      });
    }

    // Reopen to active status
    const metadata = (opportunity.metadata as Record<string, unknown>) || {};
    const { closedAt, closedBy, closeReason, selectedTeamId, ...cleanMetadata } = metadata;

    await prisma.opportunity.update({
      where: { id },
      data: {
        status: 'active',
        metadata: {
          ...cleanMetadata,
          reopenedAt: new Date().toISOString(),
          reopenedBy: session.user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `"${opportunity.title}" has been reopened`,
      status: 'active',
    });
  } catch (error) {
    console.error('Reopen opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to reopen opportunity' },
      { status: 500 }
    );
  }
}

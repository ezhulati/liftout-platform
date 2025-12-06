import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Archive an opportunity
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
    const { reason } = body;

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

    if (opportunity.status === 'expired') {
      return NextResponse.json({
        success: true,
        message: 'Opportunity is already archived',
        status: 'expired',
      });
    }

    // Archive the opportunity (set status to expired)
    const currentMetadata = (opportunity.metadata as Record<string, unknown>) || {};

    await prisma.opportunity.update({
      where: { id },
      data: {
        status: 'expired',
        metadata: {
          ...currentMetadata,
          archivedAt: new Date().toISOString(),
          archivedBy: session.user.id,
          archiveReason: reason,
          previousStatus: opportunity.status,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `"${opportunity.title}" has been archived`,
      status: 'expired',
    });
  } catch (error) {
    console.error('Archive opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to archive opportunity' },
      { status: 500 }
    );
  }
}

// DELETE - Unarchive (restore) an opportunity
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

    if (opportunity.status !== 'expired') {
      return NextResponse.json({
        success: true,
        message: 'Opportunity is not archived',
        status: opportunity.status,
      });
    }

    // Restore to previous status or 'paused'
    const metadata = (opportunity.metadata as Record<string, unknown>) || {};
    const previousStatus = (metadata.previousStatus as string) || 'paused';

    // Remove archive metadata
    const { archivedAt, archivedBy, archiveReason, previousStatus: _, ...cleanMetadata } = metadata;

    await prisma.opportunity.update({
      where: { id },
      data: {
        status: previousStatus === 'expired' ? 'paused' : previousStatus as any,
        metadata: {
          ...cleanMetadata,
          restoredAt: new Date().toISOString(),
          restoredBy: session.user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `"${opportunity.title}" has been restored`,
      status: previousStatus === 'expired' ? 'paused' : previousStatus,
    });
  } catch (error) {
    console.error('Unarchive opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to unarchive opportunity' },
      { status: 500 }
    );
  }
}

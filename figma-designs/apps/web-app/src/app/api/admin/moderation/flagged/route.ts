import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, AdminUser } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List all flagged content
export const GET = withAdminAccess(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') || 'pending';
    const severity = searchParams.get('severity') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (severity) {
      where.severity = severity;
    }

    const [flags, total] = await Promise.all([
      prisma.moderationFlag.findMany({
        where,
        orderBy: [
          { severity: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.moderationFlag.count({ where }),
    ]);

    // Get reporter details for each flag
    const reporterIds = flags.map((f) => f.reportedBy).filter(Boolean) as string[];
    const reporters = await prisma.user.findMany({
      where: { id: { in: reporterIds } },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    const reporterMap = new Map(reporters.map((r) => [r.id, r]));

    return NextResponse.json({
      items: flags.map((flag) => ({
        id: flag.id,
        type: flag.contentType,
        contentId: flag.contentId,
        reason: flag.reason,
        details: flag.details,
        severity: flag.severity,
        status: flag.status,
        reportedAt: flag.createdAt.toISOString(),
        reportedBy: flag.reportedBy
          ? reporterMap.get(flag.reportedBy) || { id: flag.reportedBy, email: 'Unknown' }
          : null,
        resolution: flag.resolution,
        content: {
          id: flag.contentId,
          preview: `${flag.contentType} content`,
        },
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Flagged content fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flagged content' },
      { status: 500 }
    );
  }
});

// POST - Resolve a flag
export const POST = withAdminAccess(async (req: NextRequest, admin: AdminUser) => {
  try {
    const body = await req.json();
    const { flagId, action, resolution } = body;

    if (!flagId || !action) {
      return NextResponse.json(
        { error: 'Flag ID and action required' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    await prisma.moderationFlag.update({
      where: { id: flagId },
      data: {
        status: newStatus,
        resolution: resolution || `${action}d by admin`,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: `Flag ${action}d` });
  } catch (error) {
    console.error('Flag resolution error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve flag' },
      { status: 500 }
    );
  }
});

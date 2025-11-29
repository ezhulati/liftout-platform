import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, AdminUser } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List all GDPR requests
export const GET = withAdminAccess(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') || undefined;
    const requestType = searchParams.get('type') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (requestType) {
      where.requestType = requestType;
    }

    const [requests, total] = await Promise.all([
      prisma.gDPRRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.gDPRRequest.count({ where }),
    ]);

    // Get user details for each request
    const userIds = requests.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return NextResponse.json({
      requests: requests.map((request) => ({
        id: request.id,
        type: request.requestType,
        status: request.status,
        requestedAt: request.createdAt.toISOString(),
        processedAt: request.processedAt?.toISOString() || null,
        user: userMap.get(request.userId) || {
          id: request.userId,
          email: request.userEmail,
          firstName: 'Unknown',
          lastName: 'User',
        },
        notes: request.notes,
        exportUrl: request.exportUrl,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('GDPR requests fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GDPR requests' },
      { status: 500 }
    );
  }
});

// POST - Process a GDPR request
export const POST = withAdminAccess(async (req: NextRequest, admin: AdminUser) => {
  try {
    const body = await req.json();
    const { requestId, action, notes } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Request ID and action required' },
        { status: 400 }
      );
    }

    const request = await prisma.gDPRRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    if (action === 'process') {
      // Mark as processing
      await prisma.gDPRRequest.update({
        where: { id: requestId },
        data: {
          status: 'processing',
          processedBy: admin.id,
          notes: notes || request.notes,
        },
      });

      return NextResponse.json({ success: true, message: 'Request marked as processing' });
    }

    if (action === 'complete') {
      // Handle completion based on request type
      if (request.requestType === 'export') {
        // Generate export URL (placeholder - would be actual file URL in production)
        const exportUrl = `/api/admin/compliance/exports/${request.id}`;
        const exportExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await prisma.gDPRRequest.update({
          where: { id: requestId },
          data: {
            status: 'completed',
            processedBy: admin.id,
            processedAt: new Date(),
            exportUrl,
            exportExpiresAt,
            notes: notes || request.notes,
          },
        });
      } else if (request.requestType === 'delete') {
        // For deletion, we would actually delete user data here
        // For now, just mark as completed
        await prisma.gDPRRequest.update({
          where: { id: requestId },
          data: {
            status: 'completed',
            processedBy: admin.id,
            processedAt: new Date(),
            notes: notes || 'User data deleted',
          },
        });
      }

      return NextResponse.json({ success: true, message: 'Request completed' });
    }

    if (action === 'reject') {
      await prisma.gDPRRequest.update({
        where: { id: requestId },
        data: {
          status: 'failed',
          processedBy: admin.id,
          processedAt: new Date(),
          notes: notes || 'Request rejected',
        },
      });

      return NextResponse.json({ success: true, message: 'Request rejected' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GDPR request process error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
});

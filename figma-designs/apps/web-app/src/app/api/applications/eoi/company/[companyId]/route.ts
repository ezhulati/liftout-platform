import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EntityType } from '@prisma/client';

// GET /api/applications/eoi/company/[companyId] - Get EOIs received by company
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { companyId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is part of the company
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId: session.user.id,
        companyId,
      },
    });

    if (!companyUser) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get EOIs where the company is the recipient
    // Note: EOIs are sent to users, so we need to find users associated with this company
    const companyUsers = await prisma.companyUser.findMany({
      where: { companyId },
      select: { userId: true },
    });

    const userIds = companyUsers.map((cu) => cu.userId);

    const eois = await prisma.expressionOfInterest.findMany({
      where: {
        toId: { in: userIds },
        toType: EntityType.company,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform for frontend
    const transformedEOIs = eois.map((eoi) => ({
      id: eoi.id,
      fromType: eoi.fromType,
      fromId: eoi.fromId,
      sender: {
        id: eoi.sender.id,
        name: `${eoi.sender.firstName || ''} ${eoi.sender.lastName || ''}`.trim() || eoi.sender.email,
        email: eoi.sender.email,
      },
      message: eoi.message,
      interestLevel: eoi.interestLevel,
      specificRole: eoi.specificRole,
      timeline: eoi.timeline,
      status: eoi.status,
      createdAt: eoi.createdAt.toISOString(),
      respondedAt: eoi.respondedAt?.toISOString(),
      expiresAt: eoi.expiresAt?.toISOString(),
    }));

    return NextResponse.json({
      interests: transformedEOIs,
      total: transformedEOIs.length,
    });
  } catch (error) {
    console.error('Error fetching company EOIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expressions of interest', details: String(error) },
      { status: 500 }
    );
  }
}

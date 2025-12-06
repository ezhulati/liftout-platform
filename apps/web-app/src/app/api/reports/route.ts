import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reportSchema = z.object({
  entityType: z.enum(['user', 'team', 'company', 'opportunity', 'message']),
  entityId: z.string().uuid(),
  reason: z.enum([
    'spam',
    'harassment',
    'inappropriate_content',
    'fake_profile',
    'scam',
    'other',
  ]),
  description: z.string().max(1000).optional(),
});

// POST - Create a report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { entityType, entityId, reason, description } = parsed.data;

    // Check for duplicate reports
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        entityType,
        entityId,
        status: { in: ['pending', 'reviewing'] },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this' },
        { status: 409 }
      );
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        entityType,
        entityId,
        reason,
        description,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: 'Report submitted successfully. Our team will review it shortly.',
    });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

// GET - Get user's reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      where: {
        reporterId: session.user.id,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to get reports' },
      { status: 500 }
    );
  }
}

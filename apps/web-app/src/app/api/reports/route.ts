import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// NOTE: Report model exists in schema but needs migration
// Using in-memory storage for development until migration is run
// TODO: Run prisma db push and switch to Prisma client

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

interface Report {
  id: string;
  reporterId: string;
  entityType: string;
  entityId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: Date;
}

// In-memory storage for development (will not persist)
const reportsStore = new Map<string, Report[]>();

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

    // Get user's reports
    const userReports = reportsStore.get(session.user.id) || [];

    // Check for duplicate reports
    const existing = userReports.find(
      (r) =>
        r.entityType === entityType &&
        r.entityId === entityId &&
        ['pending', 'reviewing'].includes(r.status)
    );

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reported this' },
        { status: 409 }
      );
    }

    // Create report
    const report: Report = {
      id: `report-${Date.now()}`,
      reporterId: session.user.id,
      entityType,
      entityId,
      reason,
      description,
      status: 'pending',
      createdAt: new Date(),
    };

    userReports.push(report);
    reportsStore.set(session.user.id, userReports);

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

    const userReports = reportsStore.get(session.user.id) || [];

    return NextResponse.json({ reports: userReports });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to get reports' },
      { status: 500 }
    );
  }
}

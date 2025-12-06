import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { alertsStore, type OpportunityAlert } from '@/lib/stores/opportunity-alerts';

// NOTE: OpportunityAlert model doesn't exist in schema yet
// This is a placeholder implementation using in-memory storage
// TODO: Add OpportunityAlert model to Prisma schema and implement properly

const alertSchema = z.object({
  name: z.string().min(1).max(100),
  filters: z.object({
    industry: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    minTeamSize: z.number().optional(),
    maxTeamSize: z.number().optional(),
    minCompensation: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    remote: z.boolean().optional(),
  }).optional(),
  frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
  isActive: z.boolean().optional(),
});

// GET - List user's opportunity alerts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const alerts = alertsStore.get(session.user.id) || [];

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to get alerts' },
      { status: 500 }
    );
  }
}

// POST - Create a new opportunity alert
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = alertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, filters, frequency } = parsed.data;

    const userAlerts = alertsStore.get(session.user.id) || [];

    // Limit to 10 alerts per user
    if (userAlerts.length >= 10) {
      return NextResponse.json(
        { error: 'Maximum of 10 alerts allowed' },
        { status: 400 }
      );
    }

    const alert: OpportunityAlert = {
      id: randomUUID(),
      userId: session.user.id,
      name,
      filters: filters || {},
      frequency: frequency || 'daily',
      isActive: true,
      matchCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userAlerts.push(alert);
    alertsStore.set(session.user.id, userAlerts);

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}


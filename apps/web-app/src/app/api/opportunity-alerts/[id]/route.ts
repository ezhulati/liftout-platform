import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { alertsStore, type OpportunityAlert } from '@/lib/stores/opportunity-alerts';

// NOTE: OpportunityAlert model doesn't exist in schema yet
// Using in-memory storage for development

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
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

// GET - Get a specific alert
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const userAlerts = alertsStore.get(session.user.id) || [];
    const alert = userAlerts.find((a) => a.id === id);

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Get alert error:', error);
    return NextResponse.json(
      { error: 'Failed to get alert' },
      { status: 500 }
    );
  }
}

// PATCH - Update an alert
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const userAlerts = alertsStore.get(session.user.id) || [];
    const alertIndex = userAlerts.findIndex((a) => a.id === id);

    if (alertIndex === -1) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    const updatedAlert = {
      ...userAlerts[alertIndex],
      ...parsed.data,
      updatedAt: new Date(),
    };

    userAlerts[alertIndex] = updatedAlert;
    alertsStore.set(session.user.id, userAlerts);

    return NextResponse.json({ alert: updatedAlert });
  } catch (error) {
    console.error('Update alert error:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an alert
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
    const userAlerts = alertsStore.get(session.user.id) || [];
    const alertIndex = userAlerts.findIndex((a) => a.id === id);

    if (alertIndex === -1) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    userAlerts.splice(alertIndex, 1);
    alertsStore.set(session.user.id, userAlerts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete alert error:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}

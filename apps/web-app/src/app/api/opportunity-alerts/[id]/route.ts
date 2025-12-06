import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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

    const alert = await prisma.opportunityAlert.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

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

    const existingAlert = await prisma.opportunityAlert.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    const alert = await prisma.opportunityAlert.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ alert });
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

    const existingAlert = await prisma.opportunityAlert.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    await prisma.opportunityAlert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete alert error:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}

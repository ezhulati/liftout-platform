import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

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

    const alerts = await prisma.opportunityAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

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

    // Check alert count limit
    const alertCount = await prisma.opportunityAlert.count({
      where: { userId: session.user.id },
    });

    // Limit to 10 alerts per user
    if (alertCount >= 10) {
      return NextResponse.json(
        { error: 'Maximum of 10 alerts allowed' },
        { status: 400 }
      );
    }

    const alert = await prisma.opportunityAlert.create({
      data: {
        userId: session.user.id,
        name,
        filters: filters || {},
        frequency: frequency || 'daily',
        isActive: true,
        matchCount: 0,
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

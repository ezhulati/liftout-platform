import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const blockSchema = z.object({
  entityType: z.enum(['user', 'team', 'company']),
  entityId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

// POST - Block a user/team/company
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = blockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { entityType, entityId, reason } = parsed.data;

    // Prevent blocking yourself
    if (entityType === 'user' && entityId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      );
    }

    // Check if already blocked (using unique constraint)
    const existing = await prisma.block.findUnique({
      where: {
        blockerId_entityType_entityId: {
          blockerId: session.user.id,
          entityType,
          entityId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already blocked' },
        { status: 409 }
      );
    }

    // Add block
    const block = await prisma.block.create({
      data: {
        blockerId: session.user.id,
        entityType,
        entityId,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      blockId: block.id,
    });
  } catch (error) {
    console.error('Create block error:', error);
    return NextResponse.json(
      { error: 'Failed to block' },
      { status: 500 }
    );
  }
}

// GET - Get user's blocked entities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');

    const blocks = await prisma.block.findMany({
      where: {
        blockerId: session.user.id,
        ...(entityType ? { entityType } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Get blocks error:', error);
    return NextResponse.json(
      { error: 'Failed to get blocks' },
      { status: 500 }
    );
  }
}

// DELETE - Unblock an entity
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entityType and entityId are required' },
        { status: 400 }
      );
    }

    // Find and delete the block
    const block = await prisma.block.findUnique({
      where: {
        blockerId_entityType_entityId: {
          blockerId: session.user.id,
          entityType,
          entityId,
        },
      },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    await prisma.block.delete({
      where: { id: block.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete block error:', error);
    return NextResponse.json(
      { error: 'Failed to unblock' },
      { status: 500 }
    );
  }
}

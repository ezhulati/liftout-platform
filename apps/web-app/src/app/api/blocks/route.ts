import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// NOTE: Block model doesn't exist in schema yet
// This is a placeholder implementation that stores blocks in memory
// TODO: Add Block model to Prisma schema and implement properly

const blockSchema = z.object({
  entityType: z.enum(['user', 'team', 'company']),
  entityId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

// In-memory storage for development (will not persist)
const blocksStore = new Map<string, { entityType: string; entityId: string; reason?: string; createdAt: Date }[]>();

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

    // Get or create user's block list
    const userBlocks = blocksStore.get(session.user.id) || [];

    // Check if already blocked
    const existing = userBlocks.find(b => b.entityType === entityType && b.entityId === entityId);
    if (existing) {
      return NextResponse.json(
        { error: 'Already blocked' },
        { status: 409 }
      );
    }

    // Add block
    userBlocks.push({ entityType, entityId, reason, createdAt: new Date() });
    blocksStore.set(session.user.id, userBlocks);

    return NextResponse.json({
      success: true,
      blockId: `block-${Date.now()}`,
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

    const userBlocks = blocksStore.get(session.user.id) || [];
    const filteredBlocks = entityType
      ? userBlocks.filter(b => b.entityType === entityType)
      : userBlocks;

    return NextResponse.json({
      blocks: filteredBlocks.map((b, i) => ({
        id: `block-${i}`,
        ...b,
      })),
    });
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

    const userBlocks = blocksStore.get(session.user.id) || [];
    const blockIndex = userBlocks.findIndex(b => b.entityType === entityType && b.entityId === entityId);

    if (blockIndex === -1) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    userBlocks.splice(blockIndex, 1);
    blocksStore.set(session.user.id, userBlocks);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete block error:', error);
    return NextResponse.json(
      { error: 'Failed to unblock' },
      { status: 500 }
    );
  }
}

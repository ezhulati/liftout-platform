import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Hide an opportunity from user's searches (uses Block model)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    // Verify the opportunity exists
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      select: { id: true, title: true },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if already hidden (blocked)
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: session.user.id,
        entityType: 'opportunity',
        entityId: id,
      },
    });

    if (existingBlock) {
      return NextResponse.json({
        success: true,
        hidden: true,
        message: 'Opportunity already hidden',
      });
    }

    // Create block record to hide opportunity
    await prisma.block.create({
      data: {
        blockerId: session.user.id,
        entityType: 'opportunity',
        entityId: id,
        reason: reason || 'Hidden from searches',
      },
    });

    return NextResponse.json({
      success: true,
      hidden: true,
      message: `"${opportunity.title}" hidden from your searches`,
    });
  } catch (error) {
    console.error('Hide opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to hide opportunity' },
      { status: 500 }
    );
  }
}

// DELETE - Unhide an opportunity (remove from block list)
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

    // Find and delete the block
    const block = await prisma.block.findFirst({
      where: {
        blockerId: session.user.id,
        entityType: 'opportunity',
        entityId: id,
      },
    });

    if (!block) {
      return NextResponse.json({
        success: true,
        hidden: false,
        message: 'Opportunity was not hidden',
      });
    }

    await prisma.block.delete({
      where: { id: block.id },
    });

    return NextResponse.json({
      success: true,
      hidden: false,
      message: 'Opportunity unhidden',
    });
  } catch (error) {
    console.error('Unhide opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to unhide opportunity' },
      { status: 500 }
    );
  }
}

// GET - Check if opportunity is hidden
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

    const block = await prisma.block.findFirst({
      where: {
        blockerId: session.user.id,
        entityType: 'opportunity',
        entityId: id,
      },
    });

    return NextResponse.json({
      hidden: !!block,
      hiddenAt: block?.createdAt?.toISOString() || null,
      reason: block?.reason || null,
    });
  } catch (error) {
    console.error('Get hidden status error:', error);
    return NextResponse.json(
      { error: 'Failed to get hidden status' },
      { status: 500 }
    );
  }
}

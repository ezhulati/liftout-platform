import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Hide a team from company searches (uses Block model)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Only company users can hide teams from their searches
    if (session.user.userType !== 'company') {
      return NextResponse.json(
        { error: 'Only company users can hide teams' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    // Verify the team exists
    const team = await prisma.team.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if already hidden (blocked)
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: session.user.id,
        entityType: 'team',
        entityId: id,
      },
    });

    if (existingBlock) {
      return NextResponse.json({
        success: true,
        hidden: true,
        message: 'Team already hidden'
      });
    }

    // Create block record to hide team
    await prisma.block.create({
      data: {
        blockerId: session.user.id,
        entityType: 'team',
        entityId: id,
        reason: reason || 'Hidden from searches',
      },
    });

    return NextResponse.json({
      success: true,
      hidden: true,
      message: `Team "${team.name}" hidden from your searches`,
    });
  } catch (error) {
    console.error('Hide team error:', error);
    return NextResponse.json(
      { error: 'Failed to hide team' },
      { status: 500 }
    );
  }
}

// DELETE - Unhide a team (remove from block list)
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
        entityType: 'team',
        entityId: id,
      },
    });

    if (!block) {
      return NextResponse.json({
        success: true,
        hidden: false,
        message: 'Team was not hidden'
      });
    }

    await prisma.block.delete({
      where: { id: block.id },
    });

    return NextResponse.json({
      success: true,
      hidden: false,
      message: 'Team unhidden from your searches',
    });
  } catch (error) {
    console.error('Unhide team error:', error);
    return NextResponse.json(
      { error: 'Failed to unhide team' },
      { status: 500 }
    );
  }
}

// GET - Check if team is hidden
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
        entityType: 'team',
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

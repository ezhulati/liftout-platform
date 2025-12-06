import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to check if user is team admin/lead
async function isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { createdBy: true },
  });

  if (team?.createdBy === userId) return true;

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      status: 'active',
      OR: [{ isAdmin: true }, { isLead: true }],
    },
  });
  return !!member;
}

// PATCH - Update member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canEdit = await isTeamAdmin(params.id, session.user.id);
    if (!canEdit) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { role, isLead } = body;

    // Verify member exists and belongs to this team
    const member = await prisma.teamMember.findFirst({
      where: {
        id: params.memberId,
        teamId: params.id,
        status: 'active',
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Build update data
    const updateData: { role?: string; isLead?: boolean; isAdmin?: boolean } = {};
    if (role !== undefined) updateData.role = role;
    if (isLead !== undefined) {
      updateData.isLead = isLead;
      updateData.isAdmin = isLead; // isAdmin follows isLead for simplicity
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: params.memberId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      member: {
        id: updatedMember.id,
        userId: updatedMember.userId,
        role: updatedMember.role,
        isLead: updatedMember.isLead,
        name: `${updatedMember.user.firstName} ${updatedMember.user.lastName}`.trim(),
      },
    });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

// DELETE - Remove member from team
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canRemove = await isTeamAdmin(params.id, session.user.id);
    if (!canRemove) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Verify member exists and belongs to this team
    const member = await prisma.teamMember.findFirst({
      where: {
        id: params.memberId,
        teamId: params.id,
        status: 'active',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Check team size - can't remove if only 2 members
    const teamSize = await prisma.teamMember.count({
      where: {
        teamId: params.id,
        status: 'active',
      },
    });

    if (teamSize <= 2) {
      return NextResponse.json(
        { error: 'Cannot remove member. Team must have at least 2 members.' },
        { status: 400 }
      );
    }

    // Can't remove the team creator
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      select: { createdBy: true },
    });

    if (member.userId === team?.createdBy) {
      return NextResponse.json(
        { error: 'Cannot remove the team creator' },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive
    await prisma.teamMember.update({
      where: { id: params.memberId },
      data: { status: 'inactive' },
    });

    // Update team size
    await prisma.team.update({
      where: { id: params.id },
      data: { size: teamSize - 1 },
    });

    return NextResponse.json({
      success: true,
      message: `${member.user.firstName} ${member.user.lastName} has been removed from the team`,
    });
  } catch (error) {
    console.error('Remove member error:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}

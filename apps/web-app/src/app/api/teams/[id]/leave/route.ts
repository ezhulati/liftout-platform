import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Leave team
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Find the member record
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId: params.id,
        userId,
        status: 'active',
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'You are not a member of this team' }, { status: 404 });
    }

    // Check if user is team creator
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      select: { createdBy: true, name: true },
    });

    if (team?.createdBy === userId) {
      return NextResponse.json(
        { error: 'Team creator cannot leave. Transfer ownership or delete the team instead.' },
        { status: 400 }
      );
    }

    // Check if user is the only lead
    if (member.isLead) {
      const otherLeads = await prisma.teamMember.count({
        where: {
          teamId: params.id,
          status: 'active',
          isLead: true,
          id: { not: member.id },
        },
      });

      if (otherLeads === 0) {
        return NextResponse.json(
          { error: 'You are the only team lead. Please assign another lead before leaving.' },
          { status: 400 }
        );
      }
    }

    // Check team size
    const teamSize = await prisma.teamMember.count({
      where: {
        teamId: params.id,
        status: 'active',
      },
    });

    if (teamSize <= 2) {
      return NextResponse.json(
        { error: 'Cannot leave. Team must have at least 2 members.' },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { status: 'inactive' },
    });

    // Update team size
    await prisma.team.update({
      where: { id: params.id },
      data: { size: teamSize - 1 },
    });

    return NextResponse.json({
      success: true,
      message: `You have left ${team?.name}`,
    });
  } catch (error) {
    console.error('Leave team error:', error);
    return NextResponse.json({ error: 'Failed to leave team' }, { status: 500 });
  }
}

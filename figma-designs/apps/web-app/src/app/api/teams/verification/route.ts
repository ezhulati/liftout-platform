import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Submit verification documents
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user's team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        isAdmin: true,
      },
      include: {
        team: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'You must be a team admin to submit verification' }, { status: 403 });
    }

    // For now, just update the team's verification status to pending
    // In a real implementation, you'd process the uploaded documents
    await prisma.team.update({
      where: { id: teamMember.teamId },
      data: {
        verificationStatus: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      verificationId: `verify-${teamMember.teamId}-${Date.now()}`,
      status: 'pending',
      message: 'Verification documents submitted successfully. Our team will review them shortly.',
    }, { status: 201 });
  } catch (error) {
    console.error('Verification submission error:', error);
    return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 });
  }
}

// GET - Get verification status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user's team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      include: {
        team: {
          select: {
            id: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 });
    }

    return NextResponse.json({
      teamId: teamMember.team.id,
      status: teamMember.team.verificationStatus,
    });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 });
  }
}

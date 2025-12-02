import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the application
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: {
              where: { userId: session.user.id, status: 'active' },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Verify user is a team member
    if (application.team.members.length === 0) {
      return NextResponse.json({ error: 'Not authorized to withdraw this application' }, { status: 403 });
    }

    // Can only withdraw if status is submitted or reviewing
    if (!['submitted', 'reviewing'].includes(application.status)) {
      return NextResponse.json(
        { error: 'Cannot withdraw application in current status' },
        { status: 400 }
      );
    }

    // Update the application status
    const updated = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: 'withdrawn',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Application withdrawn successfully',
      application: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    );
  }
}

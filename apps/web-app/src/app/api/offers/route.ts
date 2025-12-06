import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List offers for the current user's teams
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Get user's teams
    const userTeams = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      select: { teamId: true },
    });

    const teamIds = userTeams.map((t) => t.teamId);

    if (teamIds.length === 0) {
      return NextResponse.json({ offers: [], total: 0 });
    }

    // Get applications with offers for these teams
    // Offers are applications that have reached 'accepted' status
    // or are in 'interviewing' stage (pending offers)
    const applications = await prisma.teamApplication.findMany({
      where: {
        teamId: { in: teamIds },
        status: { in: ['interviewing', 'accepted', 'rejected'] },
        ...(status && {
          status: status === 'pending' ? 'interviewing'
            : status === 'accepted' ? 'accepted'
            : status === 'declined' ? 'rejected'
            : undefined,
        }),
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Transform to offer format
    const offers = applications.map((app) => ({
      id: app.id,
      applicationId: app.id,
      status: app.status === 'interviewing' ? 'pending'
        : app.status === 'accepted' ? 'accepted'
        : app.status === 'rejected' ? 'declined'
        : 'pending',
      createdAt: (app.offerMadeAt || app.appliedAt).toISOString(),
      expiresAt: null, // Would come from offer details
      salary: null, // Would come from offer details in metadata
      equity: null,
      startDate: null,
      notes: app.recruiterNotes,
      opportunity: app.opportunity,
      team: app.team,
    }));

    return NextResponse.json({
      offers,
      total: offers.length,
    });
  } catch (error) {
    console.error('Get offers error:', error);
    return NextResponse.json(
      { error: 'Failed to get offers' },
      { status: 500 }
    );
  }
}

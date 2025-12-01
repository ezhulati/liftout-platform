import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

// POST /api/applications/[id]/offer/respond - Team responds to an offer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { accept, message } = body;

    if (typeof accept !== 'boolean') {
      return NextResponse.json(
        { error: 'Accept field is required and must be a boolean' },
        { status: 400 }
      );
    }

    // Find the application
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            createdBy: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Verify user has permission (must be team member or creator)
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    const isTeamCreator = application.team.createdBy === session.user.id;

    if (!teamMember && !isTeamCreator) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if there's actually an offer to respond to
    if (!application.offerMadeAt) {
      return NextResponse.json(
        { error: 'No offer has been made for this application' },
        { status: 400 }
      );
    }

    // Check if already responded
    if (application.finalDecisionAt) {
      return NextResponse.json(
        { error: 'Offer has already been responded to' },
        { status: 400 }
      );
    }

    // Update the application with response
    const newStatus = accept ? ApplicationStatus.accepted : ApplicationStatus.rejected;

    const updated = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: newStatus,
        finalDecisionAt: new Date(),
        responseMessage: message || null,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // TODO: Send email notification to company about the response
    // await sendOfferResponseEmail({
    //   to: companyEmail,
    //   teamName: updated.team.name,
    //   opportunityTitle: updated.opportunity.title,
    //   accepted: accept,
    //   message,
    // });

    return NextResponse.json({
      data: {
        id: updated.id,
        status: updated.status,
        teamId: updated.teamId,
        teamName: updated.team.name,
        opportunityId: updated.opportunityId,
        opportunityTitle: updated.opportunity.title,
        companyName: updated.opportunity.company?.name,
        accepted: accept,
        finalDecisionAt: updated.finalDecisionAt?.toISOString(),
        responseMessage: updated.responseMessage,
      },
      message: accept ? 'Offer accepted successfully' : 'Offer declined',
    });
  } catch (error) {
    console.error('Error responding to offer:', error);
    return NextResponse.json(
      { error: 'Failed to respond to offer', details: String(error) },
      { status: 500 }
    );
  }
}

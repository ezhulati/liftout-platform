import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get offer details with history
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

    // Get application (offer) details
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            description: true,
            compensationMin: true,
            compensationMax: true,
            compensationCurrency: true,
            equityOffered: true,
            equityRange: true,
            remotePolicy: true,
            location: true,
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                industry: true,
                websiteUrl: true,
              },
            },
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            members: {
              where: { status: 'active' },
              select: {
                id: true,
                role: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            documentType: true,
            storageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check if user has access to this offer (team member)
    const isTeamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!isTeamMember) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Build status history from available timestamps
    const history: Array<{
      status: string;
      timestamp: string;
      note?: string;
    }> = [];

    // Application submitted
    history.push({
      status: 'submitted',
      timestamp: application.appliedAt.toISOString(),
      note: 'Application submitted',
    });

    // Reviewed
    if (application.reviewedAt) {
      history.push({
        status: 'reviewing',
        timestamp: application.reviewedAt.toISOString(),
        note: 'Application under review',
      });
    }

    // Interview scheduled
    if (application.interviewScheduledAt) {
      history.push({
        status: 'interviewing',
        timestamp: application.interviewScheduledAt.toISOString(),
        note: application.interviewFormat
          ? `Interview scheduled (${application.interviewFormat})`
          : 'Interview scheduled',
      });
    }

    // Offer made
    if (application.offerMadeAt) {
      history.push({
        status: 'offer_made',
        timestamp: application.offerMadeAt.toISOString(),
        note: 'Offer extended to team',
      });
    }

    // Final decision
    if (application.finalDecisionAt) {
      history.push({
        status: application.status,
        timestamp: application.finalDecisionAt.toISOString(),
        note:
          application.status === 'accepted'
            ? 'Offer accepted'
            : application.status === 'rejected'
            ? `Offer declined${application.rejectionReason ? `: ${application.rejectionReason}` : ''}`
            : 'Final decision made',
      });
    }

    // Sort by timestamp
    history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Parse offer details from JSON
    const offerDetails = application.offerDetails as Record<string, unknown> || {};

    const offer = {
      id: application.id,
      status:
        application.status === 'interviewing'
          ? 'pending'
          : application.status === 'accepted'
          ? 'accepted'
          : application.status === 'rejected'
          ? 'declined'
          : 'pending',
      opportunity: application.opportunity,
      team: application.team,
      compensation: {
        salary: offerDetails.salary || application.opportunity.compensationMin,
        salaryMax: offerDetails.salaryMax || application.opportunity.compensationMax,
        currency: offerDetails.currency || application.opportunity.compensationCurrency || 'USD',
        equity: offerDetails.equity || (application.opportunity.equityOffered ? application.opportunity.equityRange : null),
        bonus: offerDetails.bonus || null,
        benefits: offerDetails.benefits || [],
      },
      startDate: offerDetails.startDate || application.availabilityDate?.toISOString() || null,
      responseDeadline: application.responseDeadline?.toISOString() || null,
      offerMadeAt: application.offerMadeAt?.toISOString() || null,
      finalDecisionAt: application.finalDecisionAt?.toISOString() || null,
      responseMessage: application.responseMessage,
      documents: application.documents,
      history,
      interview: application.interviewScheduledAt
        ? {
            scheduledAt: application.interviewScheduledAt.toISOString(),
            format: application.interviewFormat,
            duration: application.interviewDuration,
            location: application.interviewLocation,
            meetingLink: application.interviewMeetingLink,
            participants: application.interviewParticipants,
            notes: application.interviewNotes,
          }
        : null,
      createdAt: application.createdAt.toISOString(),
    };

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Get offer error:', error);
    return NextResponse.json({ error: 'Failed to get offer' }, { status: 500 });
  }
}

// PATCH - Respond to offer (accept/decline/negotiate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, message, counterOffer } = body;

    if (!['accept', 'decline', 'negotiate'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be accept, decline, or negotiate' },
        { status: 400 }
      );
    }

    // Get application
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        team: { select: { id: true, name: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check if user is team lead/admin
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
        OR: [{ isAdmin: true }, { isLead: true }],
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Only team leads can respond to offers' },
        { status: 403 }
      );
    }

    // Update based on action
    const updateData: Record<string, unknown> = {
      responseMessage: message,
      finalDecisionAt: new Date(),
    };

    if (action === 'accept') {
      updateData.status = 'accepted';
    } else if (action === 'decline') {
      updateData.status = 'rejected';
      updateData.rejectionReason = message;
    } else if (action === 'negotiate') {
      // Store counter offer in offer details
      const existingDetails = application.offerDetails as Record<string, unknown> || {};
      updateData.offerDetails = {
        ...existingDetails,
        counterOffer,
        negotiationMessage: message,
        negotiatedAt: new Date().toISOString(),
      };
      // Status stays at interviewing (pending) during negotiation
    }

    const updatedApplication = await prisma.teamApplication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      offer: {
        id: updatedApplication.id,
        status:
          action === 'accept'
            ? 'accepted'
            : action === 'decline'
            ? 'declined'
            : 'negotiating',
      },
      message:
        action === 'accept'
          ? 'Offer accepted successfully'
          : action === 'decline'
          ? 'Offer declined'
          : 'Counter offer submitted',
    });
  } catch (error) {
    console.error('Respond to offer error:', error);
    return NextResponse.json(
      { error: 'Failed to respond to offer' },
      { status: 500 }
    );
  }
}

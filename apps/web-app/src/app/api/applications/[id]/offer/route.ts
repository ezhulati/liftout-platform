import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

// POST /api/applications/[id]/offer - Make an offer to a team
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

    // Only company users can make offers
    if (session.user.userType !== 'company') {
      return NextResponse.json(
        { error: 'Only company users can make offers' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { compensation, startDate, terms, equity, benefits, notes } = body;

    // Find the application
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: { companyId: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Verify user has permission (company user for this opportunity)
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId: session.user.id,
        companyId: application.opportunity.companyId,
      },
    });

    if (!companyUser) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build offer details
    const offerDetails = {
      compensation,
      startDate,
      terms,
      equity,
      benefits,
      notes,
      extendedBy: session.user.id,
      extendedAt: new Date().toISOString(),
    };

    // Update the application with offer
    // Using 'accepted' status (valid enum: submitted, reviewing, interviewing, accepted, rejected)
    const updated = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: ApplicationStatus.accepted,
        offerDetails: offerDetails,
        offerMadeAt: new Date(),
        responseDeadline: startDate ? new Date(startDate) : null,
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
          },
        },
      },
    });

    return NextResponse.json({
      application: {
        id: updated.id,
        status: updated.status,
        teamId: updated.teamId,
        teamName: updated.team.name,
        opportunityId: updated.opportunityId,
        opportunityTitle: updated.opportunity.title,
        offer: updated.offerDetails,
        offerMadeAt: updated.offerMadeAt?.toISOString(),
        responseDeadline: updated.responseDeadline?.toISOString(),
      },
      message: 'Offer extended successfully',
    });
  } catch (error) {
    console.error('Error making offer:', error);
    return NextResponse.json(
      { error: 'Failed to make offer', details: String(error) },
      { status: 500 }
    );
  }
}

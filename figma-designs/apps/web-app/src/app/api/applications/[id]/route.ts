import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            size: true,
          },
        },
        opportunity: {
          include: {
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
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: application.id,
        teamId: application.teamId,
        opportunityId: application.opportunityId,
        team: application.team,
        opportunity: {
          id: application.opportunity.id,
          title: application.opportunity.title,
          company: application.opportunity.company,
        },
        status: application.status,
        coverLetter: application.coverLetter,
        teamFitExplanation: application.teamFitExplanation,
        questionsForCompany: application.questionsForCompany,
        submittedAt: application.appliedAt.toISOString(),
        appliedAt: application.appliedAt.toISOString(),
        reviewedAt: application.reviewedAt?.toISOString(),
        interviewScheduledAt: application.interviewScheduledAt?.toISOString(),
        interviewNotes: application.interviewNotes,
      },
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const application = await prisma.teamApplication.update({
      where: { id },
      data: {
        coverLetter: body.coverLetter,
        teamFitExplanation: body.teamFitExplanation,
        questionsForCompany: body.questionsForCompany,
        status: body.status,
      },
      include: {
        team: { select: { id: true, name: true } },
        opportunity: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        teamId: application.teamId,
        opportunityId: application.opportunityId,
        team: application.team,
        opportunity: application.opportunity,
        status: application.status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application', details: String(error) },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isDemoAccount, DEMO_ACCOUNTS } from '@/lib/demo-accounts';

export const dynamic = 'force-dynamic';

// Demo applications data for team user
const DEMO_TEAM_APPLICATIONS = [
  {
    id: 'app_001',
    opportunityId: 'opp_001',
    teamId: 'team_demo_001',
    status: 'under_review',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "Our TechFlow Data Science team is excited about NextGen Financial's expansion into quantitative analytics.",
    availabilityTimeline: "Available to start within 8 weeks",
    compensationExpectations: { min: 240000, max: 320000, currency: 'USD', negotiable: true },
  },
  {
    id: 'app_002',
    opportunityId: 'opp_002',
    teamId: 'team_demo_001',
    status: 'interview_scheduled',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "While our primary expertise is in fintech analytics, our team has significant experience applying machine learning to healthcare data.",
    availabilityTimeline: "Flexible start date, preferentially Q2 2024",
    compensationExpectations: { min: 300000, max: 450000, currency: 'USD', negotiable: true },
  },
];

// Demo applications for company user
const DEMO_COMPANY_APPLICATIONS = [
  {
    id: 'app_company_001',
    opportunityId: 'opp_001',
    teamId: 'team_external_001',
    status: 'pending',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    viewedByCompany: false,
    coverLetter: "The QuantRisk Analytics team at Goldman Sachs is intrigued by NextGen Financial's expansion.",
    availabilityTimeline: "Available within 16 weeks",
    compensationExpectations: { min: 350000, max: 500000, currency: 'USD', negotiable: true },
  },
  {
    id: 'app_company_002',
    opportunityId: 'opp_001',
    teamId: 'team_external_002',
    status: 'under_review',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "Our derivatives trading analytics team at JPMorgan Chase has been following NextGen Financial's growth.",
    availabilityTimeline: "Flexible timing, prefer Q2 2024 start",
    compensationExpectations: { min: 320000, max: 450000, currency: 'USD', negotiable: true },
  },
];

// GET /api/applications/user - Get applications for current user (team or company)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email || '';
    const userType = (session.user as any).userType;

    // Handle demo users
    if (isDemoAccount(userEmail)) {
      if (userEmail === DEMO_ACCOUNTS.company.email) {
        return NextResponse.json({
          success: true,
          data: DEMO_COMPANY_APPLICATIONS,
        });
      }
      return NextResponse.json({
        success: true,
        data: DEMO_TEAM_APPLICATIONS,
      });
    }

    // For company users, get applications to their opportunities
    if (userType === 'company') {
      // Get company user's opportunities
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId },
        select: { companyId: true },
      });

      if (!companyUser) {
        return NextResponse.json({ success: true, data: [] });
      }

      const applications = await prisma.teamApplication.findMany({
        where: {
          opportunity: {
            companyId: companyUser.companyId,
          },
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              size: true,
              industry: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      });

      const transformedApplications = applications.map(app => ({
        id: app.id,
        opportunityId: app.opportunityId,
        teamId: app.teamId,
        status: app.status,
        submittedAt: app.appliedAt,
        updatedAt: app.createdAt,
        viewedByCompany: !!app.reviewedAt,
        viewedAt: app.reviewedAt,
        coverLetter: app.coverLetter,
        availabilityTimeline: app.availabilityDate?.toISOString() || null,
        compensationExpectations: app.proposedCompensation ? {
          min: app.proposedCompensation,
          max: app.proposedCompensation,
          currency: 'USD',
          negotiable: true,
        } : null,
        team: app.team,
        opportunity: app.opportunity,
      }));

      return NextResponse.json({
        success: true,
        data: transformedApplications,
      });
    }

    // For individual users, get their team applications
    const teamMemberships = await prisma.teamMember.findMany({
      where: {
        userId,
        status: 'active',
      },
      select: { teamId: true },
    });

    const teamIds = teamMemberships.map(m => m.teamId);

    if (teamIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const applications = await prisma.teamApplication.findMany({
      where: {
        teamId: { in: teamIds },
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
      orderBy: { appliedAt: 'desc' },
    });

    const transformedApplications = applications.map(app => ({
      id: app.id,
      opportunityId: app.opportunityId,
      teamId: app.teamId,
      status: app.status,
      submittedAt: app.appliedAt,
      updatedAt: app.createdAt,
      viewedByCompany: !!app.reviewedAt,
      viewedAt: app.reviewedAt,
      coverLetter: app.coverLetter,
      availabilityTimeline: app.availabilityDate?.toISOString() || null,
      compensationExpectations: app.proposedCompensation ? {
        min: app.proposedCompensation,
        max: app.proposedCompensation,
        currency: 'USD',
        negotiable: true,
      } : null,
      team: app.team,
      opportunity: app.opportunity,
    }));

    return NextResponse.json({
      success: true,
      data: transformedApplications,
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

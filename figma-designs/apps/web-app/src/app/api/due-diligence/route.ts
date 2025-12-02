import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/due-diligence - Get due diligence workflow for an application
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const teamId = searchParams.get('teamId');
    const companyId = searchParams.get('companyId');

    if (applicationId) {
      // Get due diligence for specific application
      const application = await prisma.teamApplication.findUnique({
        where: { id: applicationId },
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: {
                    include: {
                      profile: true,
                    },
                  },
                },
              },
            },
          },
          opportunity: {
            include: {
              company: true,
            },
          },
        },
      });

      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      // Note: Documents would be fetched from Document model if needed
      // For now, pass empty array as documents aren't critical for due diligence checklist
      const workflow = buildDueDiligenceWorkflow({ ...application, documents: [] });
      return NextResponse.json({ success: true, data: workflow });
    }

    // Get all due diligence items for user's applications
    const userType = session.user.userType;

    if (userType === 'company') {
      // Get company's received applications
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId: session.user.id },
      });

      if (!companyUser) {
        return NextResponse.json({ success: true, data: [] });
      }

      const applications = await prisma.teamApplication.findMany({
        where: {
          opportunity: { companyId: companyUser.companyId },
          status: { in: ['submitted', 'reviewing', 'interviewing'] },
        },
        include: {
          team: true,
          opportunity: { include: { company: true } },
        },
        orderBy: { appliedAt: 'desc' },
        take: 20,
      });

      const workflows = applications.map(app => ({
        applicationId: app.id,
        teamName: app.team.name,
        opportunityTitle: app.opportunity.title,
        status: app.status,
        summary: buildDueDiligenceSummary(app),
      }));

      return NextResponse.json({ success: true, data: workflows });
    } else {
      // Get user's team applications
      const teamMembers = await prisma.teamMember.findMany({
        where: { userId: session.user.id, status: 'active' },
        select: { teamId: true },
      });

      const teamIds = teamMembers.map(tm => tm.teamId);

      const applications = await prisma.teamApplication.findMany({
        where: {
          teamId: { in: teamIds },
          status: { in: ['submitted', 'reviewing', 'interviewing'] },
        },
        include: {
          team: true,
          opportunity: { include: { company: true } },
        },
        orderBy: { appliedAt: 'desc' },
        take: 20,
      });

      const workflows = applications.map(app => ({
        applicationId: app.id,
        companyName: app.opportunity.company.name,
        opportunityTitle: app.opportunity.title,
        status: app.status,
        summary: buildDueDiligenceSummary(app),
      }));

      return NextResponse.json({ success: true, data: workflows });
    }
  } catch (error) {
    console.error('Error fetching due diligence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch due diligence data' },
      { status: 500 }
    );
  }
}

// POST /api/due-diligence - Update due diligence item status
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, itemId, status, notes } = body;

    if (!applicationId || !itemId) {
      return NextResponse.json(
        { error: 'Application ID and item ID are required' },
        { status: 400 }
      );
    }

    // Get application and update its interview feedback (which we'll use to store DD progress)
    const application = await prisma.teamApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Store due diligence progress in interviewFeedback JSON field
    const currentFeedback = (application.interviewFeedback as Record<string, any>) || {};
    const dueDiligenceProgress = currentFeedback.dueDiligence || {};

    dueDiligenceProgress[itemId] = {
      status,
      notes,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id,
    };

    await prisma.teamApplication.update({
      where: { id: applicationId },
      data: {
        interviewFeedback: {
          ...currentFeedback,
          dueDiligence: dueDiligenceProgress,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Due diligence item updated',
    });
  } catch (error) {
    console.error('Error updating due diligence:', error);
    return NextResponse.json(
      { error: 'Failed to update due diligence' },
      { status: 500 }
    );
  }
}

// Helper functions

function buildDueDiligenceWorkflow(application: any) {
  const team = application.team;
  const company = application.opportunity.company;
  const members = team.members || [];
  const documents = application.documents || [];
  const feedback = (application.interviewFeedback as Record<string, any>) || {};
  const ddProgress = feedback.dueDiligence || {};

  // Define checklist categories
  const categories = [
    {
      id: 'team-verification',
      name: 'Team Verification',
      description: 'Verify team composition and credentials',
      items: [
        {
          id: 'verify-team-size',
          name: 'Verify Team Size',
          description: `Confirm ${members.length} team members as stated`,
          status: getItemStatus(ddProgress['verify-team-size'], members.length === team.size),
          priority: 'high',
          evidence: members.length > 0 ? `${members.length} members verified in system` : null,
        },
        {
          id: 'verify-credentials',
          name: 'Verify Member Credentials',
          description: 'Confirm professional credentials and experience',
          status: getItemStatus(ddProgress['verify-credentials'], false),
          priority: 'high',
          evidence: null,
        },
        {
          id: 'verify-work-history',
          name: 'Verify Work History Together',
          description: `Confirm ${team.yearsWorkingTogether || 0}+ years working together`,
          status: getItemStatus(ddProgress['verify-work-history'], !!team.yearsWorkingTogether),
          priority: 'medium',
          evidence: team.yearsWorkingTogether ? `${team.yearsWorkingTogether} years stated` : null,
        },
        {
          id: 'background-checks',
          name: 'Background Checks',
          description: 'Complete background verification for all members',
          status: getItemStatus(ddProgress['background-checks'], false),
          priority: 'high',
          evidence: null,
        },
      ],
    },
    {
      id: 'legal-review',
      name: 'Legal Review',
      description: 'Review legal obligations and restrictions',
      items: [
        {
          id: 'non-compete-analysis',
          name: 'Non-Compete Analysis',
          description: 'Analyze existing non-compete agreements',
          status: getItemStatus(ddProgress['non-compete-analysis'], false),
          priority: 'critical',
          evidence: null,
          riskLevel: 'high',
        },
        {
          id: 'ip-review',
          name: 'IP Assignment Review',
          description: 'Review intellectual property obligations',
          status: getItemStatus(ddProgress['ip-review'], false),
          priority: 'high',
          evidence: null,
        },
        {
          id: 'nda-review',
          name: 'NDA Obligations',
          description: 'Review confidentiality agreements',
          status: getItemStatus(ddProgress['nda-review'], false),
          priority: 'medium',
          evidence: null,
        },
        {
          id: 'notice-periods',
          name: 'Notice Period Analysis',
          description: 'Determine notice requirements for all members',
          status: getItemStatus(ddProgress['notice-periods'], false),
          priority: 'high',
          evidence: null,
        },
      ],
    },
    {
      id: 'financial-review',
      name: 'Financial Review',
      description: 'Review compensation and financial terms',
      items: [
        {
          id: 'compensation-benchmark',
          name: 'Compensation Benchmarking',
          description: 'Compare proposed compensation to market rates',
          status: getItemStatus(ddProgress['compensation-benchmark'], !!application.proposedCompensation),
          priority: 'medium',
          evidence: application.proposedCompensation
            ? `Proposed: $${application.proposedCompensation.toLocaleString()}`
            : null,
        },
        {
          id: 'equity-analysis',
          name: 'Equity Package Analysis',
          description: 'Review equity terms and vesting',
          status: getItemStatus(ddProgress['equity-analysis'], !!application.proposedEquity),
          priority: 'medium',
          evidence: application.proposedEquity || null,
        },
        {
          id: 'garden-leave-cost',
          name: 'Garden Leave Cost Analysis',
          description: 'Calculate garden leave costs if applicable',
          status: getItemStatus(ddProgress['garden-leave-cost'], false),
          priority: 'high',
          evidence: null,
        },
      ],
    },
    {
      id: 'culture-fit',
      name: 'Culture Fit Assessment',
      description: 'Evaluate cultural compatibility',
      items: [
        {
          id: 'culture-interview',
          name: 'Culture Fit Interview',
          description: 'Conduct culture alignment interviews',
          status: getItemStatus(ddProgress['culture-interview'], !!application.interviewScheduledAt),
          priority: 'medium',
          evidence: application.interviewScheduledAt
            ? `Interview scheduled: ${new Date(application.interviewScheduledAt).toLocaleDateString()}`
            : null,
        },
        {
          id: 'team-dynamics',
          name: 'Team Dynamics Assessment',
          description: 'Assess team working patterns and dynamics',
          status: getItemStatus(ddProgress['team-dynamics'], !!team.teamCulture),
          priority: 'medium',
          evidence: team.teamCulture || null,
        },
        {
          id: 'reference-checks',
          name: 'Reference Checks',
          description: 'Contact professional references',
          status: getItemStatus(ddProgress['reference-checks'], false),
          priority: 'high',
          evidence: null,
        },
      ],
    },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'Collect and verify required documents',
      items: [
        {
          id: 'resume-collection',
          name: 'Resume Collection',
          description: 'Collect resumes for all team members',
          status: getItemStatus(ddProgress['resume-collection'], documents.some((d: any) => d.type === 'resume')),
          priority: 'high',
          evidence: documents.filter((d: any) => d.type === 'resume').length > 0
            ? `${documents.filter((d: any) => d.type === 'resume').length} resumes uploaded`
            : null,
        },
        {
          id: 'portfolio-review',
          name: 'Portfolio/Case Studies',
          description: 'Review team portfolio and case studies',
          status: getItemStatus(ddProgress['portfolio-review'], !!team.portfolioUrl || (Array.isArray(team.caseStudies) && team.caseStudies.length > 0)),
          priority: 'medium',
          evidence: team.portfolioUrl || (Array.isArray(team.caseStudies) && team.caseStudies.length > 0
            ? `${team.caseStudies.length} case studies available`
            : null),
        },
        {
          id: 'employment-contracts',
          name: 'Current Employment Contracts',
          description: 'Collect current employment agreements',
          status: getItemStatus(ddProgress['employment-contracts'], false),
          priority: 'critical',
          evidence: null,
        },
      ],
    },
  ];

  // Calculate overall progress
  const allItems = categories.flatMap(c => c.items);
  const completedItems = allItems.filter(i => i.status === 'completed').length;
  const inProgressItems = allItems.filter(i => i.status === 'in_progress').length;
  const blockedItems = allItems.filter(i => i.status === 'blocked').length;

  const overallProgress = Math.round((completedItems / allItems.length) * 100);

  // Identify risks
  const risks = allItems
    .filter(i => i.status === 'blocked' || (i as any).riskLevel === 'high')
    .map(i => ({
      itemId: i.id,
      name: i.name,
      severity: (i as any).riskLevel || (i.status === 'blocked' ? 'high' : 'medium'),
      description: i.description,
    }));

  // Determine next actions
  const nextActions = allItems
    .filter(i => i.status === 'pending' && i.priority === 'critical')
    .slice(0, 3)
    .map(i => ({
      itemId: i.id,
      name: i.name,
      priority: i.priority,
    }));

  return {
    id: `dd-${application.id}`,
    applicationId: application.id,
    team: {
      id: team.id,
      name: team.name,
      size: team.size,
    },
    company: {
      id: company.id,
      name: company.name,
    },
    opportunity: {
      id: application.opportunity.id,
      title: application.opportunity.title,
    },
    status: application.status,
    categories,
    summary: {
      totalItems: allItems.length,
      completedItems,
      inProgressItems,
      blockedItems,
      pendingItems: allItems.length - completedItems - inProgressItems - blockedItems,
      overallProgress,
    },
    risks,
    nextActions,
    timeline: {
      applicationDate: application.appliedAt,
      targetCompletionDate: application.responseDeadline || calculateTargetDate(application.appliedAt),
      daysRemaining: calculateDaysRemaining(application.responseDeadline || calculateTargetDate(application.appliedAt)),
    },
    lastUpdated: new Date(),
  };
}

function buildDueDiligenceSummary(application: any) {
  const feedback = (application.interviewFeedback as Record<string, any>) || {};
  const ddProgress = feedback.dueDiligence || {};

  const totalItems = 15; // Approximate total items
  const completedItems = Object.values(ddProgress).filter((p: any) => p.status === 'completed').length;

  return {
    progress: Math.round((completedItems / totalItems) * 100),
    completedItems,
    totalItems,
    hasBlockers: Object.values(ddProgress).some((p: any) => p.status === 'blocked'),
  };
}

function getItemStatus(progress: any, hasEvidence: boolean): 'pending' | 'in_progress' | 'completed' | 'blocked' {
  if (progress?.status) return progress.status;
  if (hasEvidence) return 'completed';
  return 'pending';
}

function calculateTargetDate(applicationDate: Date): Date {
  const target = new Date(applicationDate);
  target.setDate(target.getDate() + 30); // 30 days from application
  return target;
}

function calculateDaysRemaining(targetDate: Date): number {
  const now = new Date();
  const diff = new Date(targetDate).getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

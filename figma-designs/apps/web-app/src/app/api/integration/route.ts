import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/integration - Get integration tracking for a completed liftout
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const teamId = searchParams.get('teamId');

    if (applicationId) {
      const application = await prisma.teamApplication.findUnique({
        where: { id: applicationId },
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: true,
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

      const tracker = buildIntegrationTracker(application);
      return NextResponse.json({ success: true, data: tracker });
    }

    // Get all integrations for user's teams or company
    const userType = session.user.userType;

    if (userType === 'company') {
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId: session.user.id },
      });

      if (!companyUser) {
        return NextResponse.json({ success: true, data: [] });
      }

      // Get accepted applications (successful liftouts)
      const applications = await prisma.teamApplication.findMany({
        where: {
          opportunity: { companyId: companyUser.companyId },
          status: 'accepted',
        },
        include: {
          team: true,
          opportunity: { include: { company: true } },
        },
        orderBy: { finalDecisionAt: 'desc' },
        take: 10,
      });

      const trackers = applications.map(app => ({
        applicationId: app.id,
        teamName: app.team.name,
        opportunityTitle: app.opportunity.title,
        startDate: app.finalDecisionAt,
        summary: buildIntegrationSummary(app),
      }));

      return NextResponse.json({ success: true, data: trackers });
    } else {
      // Get user's team accepted applications
      const teamMembers = await prisma.teamMember.findMany({
        where: { userId: session.user.id, status: 'active' },
        select: { teamId: true },
      });

      const teamIds = teamMembers.map(tm => tm.teamId);

      const applications = await prisma.teamApplication.findMany({
        where: {
          teamId: { in: teamIds },
          status: 'accepted',
        },
        include: {
          team: true,
          opportunity: { include: { company: true } },
        },
        orderBy: { finalDecisionAt: 'desc' },
        take: 10,
      });

      const trackers = applications.map(app => ({
        applicationId: app.id,
        companyName: app.opportunity.company.name,
        opportunityTitle: app.opportunity.title,
        startDate: app.finalDecisionAt,
        summary: buildIntegrationSummary(app),
      }));

      return NextResponse.json({ success: true, data: trackers });
    }
  } catch (error) {
    console.error('Error fetching integration data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integration data' },
      { status: 500 }
    );
  }
}

// POST /api/integration - Update integration milestone or task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, milestoneId, taskId, status, notes, metrics } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 });
    }

    const application = await prisma.teamApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Store integration progress in offerDetails JSON field
    const currentDetails = (application.offerDetails as Record<string, any>) || {};
    const integrationProgress = currentDetails.integration || { milestones: {}, tasks: {}, metrics: {} };

    if (milestoneId) {
      integrationProgress.milestones[milestoneId] = {
        status,
        notes,
        updatedAt: new Date().toISOString(),
        updatedBy: session.user.id,
      };
    }

    if (taskId) {
      integrationProgress.tasks[taskId] = {
        status,
        notes,
        updatedAt: new Date().toISOString(),
        updatedBy: session.user.id,
      };
    }

    if (metrics) {
      integrationProgress.metrics = {
        ...integrationProgress.metrics,
        ...metrics,
        updatedAt: new Date().toISOString(),
      };
    }

    await prisma.teamApplication.update({
      where: { id: applicationId },
      data: {
        offerDetails: {
          ...currentDetails,
          integration: integrationProgress,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Integration progress updated',
    });
  } catch (error) {
    console.error('Error updating integration:', error);
    return NextResponse.json(
      { error: 'Failed to update integration' },
      { status: 500 }
    );
  }
}

// Helper functions

function buildIntegrationTracker(application: any) {
  const team = application.team;
  const company = application.opportunity.company;
  const members = team.members || [];
  const offerDetails = (application.offerDetails as Record<string, any>) || {};
  const integrationData = offerDetails.integration || { milestones: {}, tasks: {}, metrics: {} };

  const startDate = application.finalDecisionAt || new Date();
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Define integration phases and milestones
  const phases = [
    {
      id: 'phase-1',
      name: 'Pre-Boarding',
      description: 'Preparation before team officially joins',
      duration: 14,
      startDay: -14,
      status: daysSinceStart >= 0 ? 'completed' : daysSinceStart >= -14 ? 'in_progress' : 'pending',
      milestones: [
        {
          id: 'pre-1',
          name: 'Legal Documentation Complete',
          targetDay: -7,
          status: getMilestoneStatus(integrationData.milestones['pre-1'], daysSinceStart, -7),
          tasks: [
            { id: 'pre-1-1', name: 'Employment contracts signed', status: getTaskStatus(integrationData.tasks['pre-1-1']) },
            { id: 'pre-1-2', name: 'Non-compete clearance obtained', status: getTaskStatus(integrationData.tasks['pre-1-2']) },
            { id: 'pre-1-3', name: 'Background checks completed', status: getTaskStatus(integrationData.tasks['pre-1-3']) },
          ],
        },
        {
          id: 'pre-2',
          name: 'Systems Access Prepared',
          targetDay: -3,
          status: getMilestoneStatus(integrationData.milestones['pre-2'], daysSinceStart, -3),
          tasks: [
            { id: 'pre-2-1', name: 'Email accounts created', status: getTaskStatus(integrationData.tasks['pre-2-1']) },
            { id: 'pre-2-2', name: 'System credentials provisioned', status: getTaskStatus(integrationData.tasks['pre-2-2']) },
            { id: 'pre-2-3', name: 'Equipment ordered/prepared', status: getTaskStatus(integrationData.tasks['pre-2-3']) },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      name: 'Onboarding',
      description: 'First 30 days of integration',
      duration: 30,
      startDay: 0,
      status: daysSinceStart >= 30 ? 'completed' : daysSinceStart >= 0 ? 'in_progress' : 'pending',
      milestones: [
        {
          id: 'onb-1',
          name: 'Day 1 Orientation Complete',
          targetDay: 1,
          status: getMilestoneStatus(integrationData.milestones['onb-1'], daysSinceStart, 1),
          tasks: [
            { id: 'onb-1-1', name: 'Welcome meeting held', status: getTaskStatus(integrationData.tasks['onb-1-1']) },
            { id: 'onb-1-2', name: 'Team introductions made', status: getTaskStatus(integrationData.tasks['onb-1-2']) },
            { id: 'onb-1-3', name: 'Workspace setup complete', status: getTaskStatus(integrationData.tasks['onb-1-3']) },
          ],
        },
        {
          id: 'onb-2',
          name: 'Week 1 Training Complete',
          targetDay: 7,
          status: getMilestoneStatus(integrationData.milestones['onb-2'], daysSinceStart, 7),
          tasks: [
            { id: 'onb-2-1', name: 'Company policies reviewed', status: getTaskStatus(integrationData.tasks['onb-2-1']) },
            { id: 'onb-2-2', name: 'Systems training completed', status: getTaskStatus(integrationData.tasks['onb-2-2']) },
            { id: 'onb-2-3', name: 'Culture buddy assigned', status: getTaskStatus(integrationData.tasks['onb-2-3']) },
          ],
        },
        {
          id: 'onb-3',
          name: '30-Day Review Complete',
          targetDay: 30,
          status: getMilestoneStatus(integrationData.milestones['onb-3'], daysSinceStart, 30),
          tasks: [
            { id: 'onb-3-1', name: 'Initial performance check-in', status: getTaskStatus(integrationData.tasks['onb-3-1']) },
            { id: 'onb-3-2', name: 'Integration feedback collected', status: getTaskStatus(integrationData.tasks['onb-3-2']) },
            { id: 'onb-3-3', name: 'Goals aligned with company', status: getTaskStatus(integrationData.tasks['onb-3-3']) },
          ],
        },
      ],
    },
    {
      id: 'phase-3',
      name: 'Ramp-Up',
      description: 'Days 31-90: Full productivity ramp',
      duration: 60,
      startDay: 30,
      status: daysSinceStart >= 90 ? 'completed' : daysSinceStart >= 30 ? 'in_progress' : 'pending',
      milestones: [
        {
          id: 'ramp-1',
          name: '60-Day Checkpoint',
          targetDay: 60,
          status: getMilestoneStatus(integrationData.milestones['ramp-1'], daysSinceStart, 60),
          tasks: [
            { id: 'ramp-1-1', name: 'First project delivered', status: getTaskStatus(integrationData.tasks['ramp-1-1']) },
            { id: 'ramp-1-2', name: 'Cross-team collaboration started', status: getTaskStatus(integrationData.tasks['ramp-1-2']) },
            { id: 'ramp-1-3', name: 'Performance on track', status: getTaskStatus(integrationData.tasks['ramp-1-3']) },
          ],
        },
        {
          id: 'ramp-2',
          name: '90-Day Review Complete',
          targetDay: 90,
          status: getMilestoneStatus(integrationData.milestones['ramp-2'], daysSinceStart, 90),
          tasks: [
            { id: 'ramp-2-1', name: 'Full productivity achieved', status: getTaskStatus(integrationData.tasks['ramp-2-1']) },
            { id: 'ramp-2-2', name: 'Integration assessment done', status: getTaskStatus(integrationData.tasks['ramp-2-2']) },
            { id: 'ramp-2-3', name: 'Long-term goals set', status: getTaskStatus(integrationData.tasks['ramp-2-3']) },
          ],
        },
      ],
    },
  ];

  // Calculate overall progress
  const allTasks = phases.flatMap(p => p.milestones.flatMap(m => m.tasks));
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const totalTasks = allTasks.length;

  // Build metrics
  const metrics = {
    retentionRate: integrationData.metrics?.retentionRate || (members.length > 0 ? 100 : 0),
    productivityScore: integrationData.metrics?.productivityScore || calculateProductivityScore(daysSinceStart),
    integrationScore: integrationData.metrics?.integrationScore || Math.round((completedTasks / totalTasks) * 100),
    teamSatisfaction: integrationData.metrics?.teamSatisfaction || 0,
    managerSatisfaction: integrationData.metrics?.managerSatisfaction || 0,
    daysSinceStart,
    currentPhase: getCurrentPhase(daysSinceStart),
  };

  // Risk indicators
  const risks = identifyIntegrationRisks(phases, metrics, daysSinceStart);

  // Success indicators
  const successes = identifySuccesses(phases, metrics);

  return {
    id: `integration-${application.id}`,
    applicationId: application.id,
    team: {
      id: team.id,
      name: team.name,
      size: team.size,
      membersIntegrated: members.length,
    },
    company: {
      id: company.id,
      name: company.name,
    },
    opportunity: {
      id: application.opportunity.id,
      title: application.opportunity.title,
    },
    startDate,
    phases,
    progress: {
      overall: Math.round((completedTasks / totalTasks) * 100),
      completedTasks,
      totalTasks,
      onTrack: isOnTrack(phases, daysSinceStart),
    },
    metrics,
    risks,
    successes,
    nextActions: getNextActions(phases, daysSinceStart),
    timeline: {
      expectedCompletionDate: new Date(new Date(startDate).getTime() + 90 * 24 * 60 * 60 * 1000),
      currentDay: daysSinceStart,
      totalDays: 90,
    },
    lastUpdated: new Date(),
  };
}

function buildIntegrationSummary(application: any) {
  const offerDetails = (application.offerDetails as Record<string, any>) || {};
  const integrationData = offerDetails.integration || {};

  const startDate = application.finalDecisionAt || new Date();
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const tasks = integrationData.tasks || {};
  const completedCount = Object.values(tasks).filter((t: any) => t.status === 'completed').length;

  return {
    daysSinceStart,
    phase: getCurrentPhase(daysSinceStart),
    progress: Math.min(100, Math.round((daysSinceStart / 90) * 100)),
    completedTasks: completedCount,
    status: daysSinceStart >= 90 ? 'completed' : 'in_progress',
  };
}

function getMilestoneStatus(
  savedStatus: any,
  daysSinceStart: number,
  targetDay: number
): 'completed' | 'in_progress' | 'pending' | 'overdue' {
  if (savedStatus?.status) return savedStatus.status;

  if (daysSinceStart >= targetDay + 7 && daysSinceStart > 0) return 'overdue';
  if (daysSinceStart >= targetDay) return 'in_progress';
  if (daysSinceStart >= targetDay - 3) return 'pending';
  return 'pending';
}

function getTaskStatus(savedTask: any): 'completed' | 'in_progress' | 'pending' {
  if (savedTask?.status) return savedTask.status;
  return 'pending';
}

function calculateProductivityScore(daysSinceStart: number): number {
  // Productivity ramps up over time
  if (daysSinceStart < 0) return 0;
  if (daysSinceStart < 7) return 25;
  if (daysSinceStart < 30) return 50;
  if (daysSinceStart < 60) return 75;
  if (daysSinceStart < 90) return 85;
  return 95;
}

function getCurrentPhase(daysSinceStart: number): string {
  if (daysSinceStart < 0) return 'Pre-Boarding';
  if (daysSinceStart < 30) return 'Onboarding';
  if (daysSinceStart < 90) return 'Ramp-Up';
  return 'Integrated';
}

function isOnTrack(phases: any[], daysSinceStart: number): boolean {
  const overdueMilestones = phases
    .flatMap(p => p.milestones)
    .filter(m => m.status === 'overdue');
  return overdueMilestones.length === 0;
}

function identifyIntegrationRisks(phases: any[], metrics: any, daysSinceStart: number) {
  const risks = [];

  // Check for overdue milestones
  const overdueMilestones = phases
    .flatMap(p => p.milestones)
    .filter(m => m.status === 'overdue');

  if (overdueMilestones.length > 0) {
    risks.push({
      id: 'overdue-milestones',
      severity: 'high',
      description: `${overdueMilestones.length} milestone(s) are overdue`,
      recommendation: 'Review and expedite pending tasks',
    });
  }

  // Check productivity
  if (daysSinceStart > 60 && metrics.productivityScore < 70) {
    risks.push({
      id: 'low-productivity',
      severity: 'medium',
      description: 'Productivity below expected level at this stage',
      recommendation: 'Schedule performance coaching sessions',
    });
  }

  // Check satisfaction scores if available
  if (metrics.teamSatisfaction > 0 && metrics.teamSatisfaction < 60) {
    risks.push({
      id: 'low-satisfaction',
      severity: 'high',
      description: 'Team satisfaction is below threshold',
      recommendation: 'Conduct 1-on-1 feedback sessions',
    });
  }

  return risks;
}

function identifySuccesses(phases: any[], metrics: any) {
  const successes = [];

  // Check retention
  if (metrics.retentionRate === 100) {
    successes.push({
      id: 'full-retention',
      description: '100% team retention maintained',
    });
  }

  // Check productivity
  if (metrics.productivityScore >= 85) {
    successes.push({
      id: 'high-productivity',
      description: 'Team achieving high productivity levels',
    });
  }

  // Check integration score
  if (metrics.integrationScore >= 80) {
    successes.push({
      id: 'strong-integration',
      description: 'Integration progressing ahead of schedule',
    });
  }

  return successes;
}

function getNextActions(phases: any[], daysSinceStart: number) {
  const allTasks = phases
    .flatMap(p => p.milestones.flatMap((m: any) =>
      m.tasks.map((t: any) => ({ ...t, targetDay: m.targetDay, milestoneName: m.name }))
    ))
    .filter((t: any) => t.status === 'pending' || t.status === 'in_progress');

  // Sort by target day and return top 3
  return allTasks
    .sort((a, b) => a.targetDay - b.targetDay)
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      name: t.name,
      milestone: t.milestoneName,
      priority: t.targetDay <= daysSinceStart ? 'high' : 'medium',
    }));
}

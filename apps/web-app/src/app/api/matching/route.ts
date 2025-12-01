import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';
import { findBestMatches, findBestOpportunities } from '@/lib/services/matchingService';

// GET - Get recommended teams/opportunities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'teams'; // 'teams' or 'opportunities'
    const opportunityId = searchParams.get('opportunityId');
    const teamId = searchParams.get('teamId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (type === 'teams') {
      // Find recommended teams for an opportunity
      let opportunity;

      if (opportunityId) {
        opportunity = await prisma.opportunity.findUnique({
          where: { id: opportunityId },
          include: {
            skills: { include: { skill: true } },
          },
        });
      } else {
        // Get the user's most recent opportunity
        opportunity = await prisma.opportunity.findFirst({
          where: { companyId: session.user.id, status: 'open' },
          orderBy: { createdAt: 'desc' },
          include: {
            skills: { include: { skill: true } },
          },
        });
      }

      if (!opportunity) {
        // Return demo data if no opportunities
        return NextResponse.json({
          matches: getDemoTeamMatches(),
          source: 'demo',
        });
      }

      // Get all active teams
      const teams = await prisma.team.findMany({
        where: { status: 'active' },
        include: {
          members: {
            where: { status: 'active' },
            include: {
              user: {
                include: {
                  skills: { include: { skill: true } },
                },
              },
            },
          },
        },
      });

      // Transform to matching format
      const teamProfiles = teams.map(team => {
        const allSkills = team.members.flatMap(m =>
          m.user.skills.map(s => s.skill.name)
        );
        const uniqueSkills = [...new Set(allSkills)];

        return {
          id: team.id,
          name: team.name,
          skills: uniqueSkills,
          industry: team.industry || 'Technology',
          size: team.members.length,
          yearsWorking: team.yearsWorkingTogether || 1,
          location: team.location || undefined,
          compensationMin: team.compensationMin || undefined,
          compensationMax: team.compensationMax || undefined,
          availability: team.availability || undefined,
          verificationStatus: team.verificationStatus || 'pending',
        };
      });

      const opportunityProfile = {
        id: opportunity.id,
        title: opportunity.title,
        requiredSkills: opportunity.skills
          .filter((s: { isRequired: boolean }) => s.isRequired)
          .map((s: { skill: { name: string } }) => s.skill.name),
        preferredSkills: opportunity.skills
          .filter((s: { isRequired: boolean }) => !s.isRequired)
          .map((s: { skill: { name: string } }) => s.skill.name),
        industry: opportunity.industry || 'Technology',
        teamSizeMin: opportunity.teamSizeMin || 2,
        teamSizeMax: opportunity.teamSizeMax || 10,
        location: opportunity.location || undefined,
        remote: opportunity.remote || false,
        compensationMin: opportunity.compensationMin || undefined,
        compensationMax: opportunity.compensationMax || undefined,
        urgency: opportunity.urgency || undefined,
      };

      const matches = findBestMatches(teamProfiles, opportunityProfile, limit);

      return NextResponse.json({
        matches,
        opportunityId: opportunity.id,
        source: 'database',
      });
    } else {
      // Find recommended opportunities for a team
      let team;

      if (teamId) {
        team = await prisma.team.findUnique({
          where: { id: teamId },
          include: {
            members: {
              where: { status: 'active' },
              include: {
                user: {
                  include: {
                    skills: { include: { skill: true } },
                  },
                },
              },
            },
          },
        });
      } else {
        // Get user's team
        const membership = await prisma.teamMember.findFirst({
          where: { userId: session.user.id, status: 'active' },
          include: {
            team: {
              include: {
                members: {
                  where: { status: 'active' },
                  include: {
                    user: {
                      include: {
                        skills: { include: { skill: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        });
        team = membership?.team;
      }

      if (!team) {
        return NextResponse.json({
          matches: getDemoOpportunityMatches(),
          source: 'demo',
        });
      }

      // Get all open opportunities
      const opportunities = await prisma.opportunity.findMany({
        where: { status: 'open' },
        include: {
          skills: { include: { skill: true } },
        },
      });

      const allSkills = team.members.flatMap(m =>
        m.user.skills.map(s => s.skill.name)
      );
      const uniqueSkills = [...new Set(allSkills)];

      const teamProfile = {
        id: team.id,
        name: team.name,
        skills: uniqueSkills,
        industry: team.industry || 'Technology',
        size: team.members.length,
        yearsWorking: team.yearsWorkingTogether || 1,
        location: team.location || undefined,
        compensationMin: team.compensationMin || undefined,
        compensationMax: team.compensationMax || undefined,
        availability: team.availability || undefined,
        verificationStatus: team.verificationStatus || 'pending',
      };

      const opportunityProfiles = opportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        requiredSkills: opp.skills
          .filter((s: { isRequired: boolean }) => s.isRequired)
          .map((s: { skill: { name: string } }) => s.skill.name),
        preferredSkills: opp.skills
          .filter((s: { isRequired: boolean }) => !s.isRequired)
          .map((s: { skill: { name: string } }) => s.skill.name),
        industry: opp.industry || 'Technology',
        teamSizeMin: opp.teamSizeMin || 2,
        teamSizeMax: opp.teamSizeMax || 10,
        location: opp.location || undefined,
        remote: opp.remote || false,
        compensationMin: opp.compensationMin || undefined,
        compensationMax: opp.compensationMax || undefined,
        urgency: opp.urgency || undefined,
      }));

      const matches = findBestOpportunities(teamProfile, opportunityProfiles, limit);

      return NextResponse.json({
        matches,
        teamId: team.id,
        source: 'database',
      });
    }
  } catch (error) {
    console.error('Error getting matches:', error);
    return NextResponse.json({ error: 'Failed to get matches' }, { status: 500 });
  }
}

// Demo data fallbacks
function getDemoTeamMatches() {
  return [
    {
      teamId: 'techflow-data-science',
      team: {
        id: 'techflow-data-science',
        name: 'TechFlow Data Science Team',
        skills: ['Machine Learning', 'Python', 'SQL', 'Data Architecture', 'NLP', 'MLOps'],
        industry: 'FinTech',
        size: 4,
        yearsWorking: 3,
        location: 'San Francisco, CA',
        verificationStatus: 'verified',
      },
      score: 92,
      breakdown: {
        skillsMatch: 0.95,
        industryMatch: 0.9,
        sizeMatch: 1.0,
        compensationMatch: 0.85,
        availabilityMatch: 0.9,
      },
      strengths: ['Strong skills alignment', 'Direct industry experience', '3+ years working together'],
      considerations: [],
    },
    {
      teamId: 'quantum-ai-team',
      team: {
        id: 'quantum-ai-team',
        name: 'Quantum AI Research Team',
        skills: ['Deep Learning', 'Computer Vision', 'PyTorch', 'Medical Imaging', 'Research'],
        industry: 'Healthcare AI',
        size: 5,
        yearsWorking: 4,
        location: 'Boston, MA',
        verificationStatus: 'verified',
      },
      score: 87,
      breakdown: {
        skillsMatch: 0.88,
        industryMatch: 0.75,
        sizeMatch: 0.95,
        compensationMatch: 0.80,
        availabilityMatch: 0.85,
      },
      strengths: ['World-class research credentials', 'Strong team cohesion', 'Verified profile'],
      considerations: ['May need industry-specific training'],
    },
    {
      teamId: 'devops-ninjas',
      team: {
        id: 'devops-ninjas',
        name: 'DevOps Excellence Team',
        skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Security', 'Docker'],
        industry: 'Cloud Infrastructure',
        size: 3,
        yearsWorking: 2,
        location: 'Austin, TX',
        verificationStatus: 'pending',
      },
      score: 78,
      breakdown: {
        skillsMatch: 0.75,
        industryMatch: 0.70,
        sizeMatch: 0.85,
        compensationMatch: 0.80,
        availabilityMatch: 0.80,
      },
      strengths: ['Infrastructure expertise', 'Cost optimization focus'],
      considerations: ['Smaller team size', 'Verification pending'],
    },
  ];
}

function getDemoOpportunityMatches() {
  return [
    {
      opportunityId: 'opp-1',
      opportunity: {
        id: 'opp-1',
        title: 'Lead Data Science Division',
        industry: 'FinTech',
        requiredSkills: ['Machine Learning', 'Python', 'SQL'],
      },
      score: 94,
    },
    {
      opportunityId: 'opp-2',
      opportunity: {
        id: 'opp-2',
        title: 'Healthcare AI Research Lead',
        industry: 'Healthcare',
        requiredSkills: ['Deep Learning', 'Computer Vision'],
      },
      score: 86,
    },
    {
      opportunityId: 'opp-3',
      opportunity: {
        id: 'opp-3',
        title: 'Platform Engineering Team',
        industry: 'Technology',
        requiredSkills: ['Kubernetes', 'AWS', 'DevOps'],
      },
      score: 72,
    },
  ];
}

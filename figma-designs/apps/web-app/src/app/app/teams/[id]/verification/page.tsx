import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TeamVerification } from '@/components/teams/TeamVerification';
import Link from 'next/link';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { prisma } from '@/lib/prisma';

interface TeamVerificationPageProps {
  params: {
    id: string;
  };
}

// Fallback mock data in case Firestore is unavailable
const getFallbackTeam = (teamId: string) => ({
  id: teamId,
  name: 'Elite FinTech Analytics Team',
  description: 'Experienced quantitative finance team specializing in risk modeling and algorithmic trading',
  industry: ['Financial Services', 'Technology'],
  specializations: ['Quantitative Analysis', 'Risk Modeling', 'Algorithmic Trading'],
  size: 5,
  location: {
    primary: 'New York, NY',
    secondary: ['London', 'Singapore'],
    remote: true,
  },
  members: [
    {
      id: 'member_1',
      name: 'Alex Thompson',
      role: 'Lead Quantitative Analyst',
      experience: 8,
      skills: ['Python', 'R', 'Machine Learning', 'Risk Modeling'],
      bio: 'Former Goldman Sachs quant with expertise in derivatives pricing',
      education: 'PhD Mathematics, MIT',
      certifications: ['FRM', 'CQF'],
    },
  ],
  leaderId: 'user_1',
  establishedDate: new Date('2019-03-15'),
  performanceMetrics: {
    projectsCompleted: 45,
    clientSatisfactionScore: 4.8,
    successRate: 92,
    avgProjectValue: 2500000,
    repeatClientRate: 78,
    teamCohesionScore: 89,
    avgExperienceYears: 6.5,
  },
  portfolioItems: [],
  dynamics: {
    communicationStyle: 'Direct and analytical',
    decisionMakingProcess: 'Data-driven consensus',
    conflictResolutionApproach: 'Evidence-based discussion',
    leadershipStyle: 'Collaborative',
    meetingCadence: 'Daily standups, weekly planning',
    collaborationTools: ['Slack', 'Jira', 'Git'],
    workLifeBalance: 'High focus on sustainable pace',
  },
  values: ['Data-driven decisions', 'Continuous learning', 'Client success'],
  workingMethodology: ['Agile', 'Test-driven development', 'Code review'],
  verification: {
    status: 'pending' as const,
    documents: [
      {
        type: 'employment_verification',
        url: 'https://example.com/doc1.pdf',
        uploadedAt: new Date('2024-01-15'),
        verified: true,
      },
      {
        type: 'client_testimonial',
        url: 'https://example.com/doc2.pdf',
        uploadedAt: new Date('2024-01-20'),
        verified: false,
      },
    ],
    references: [
      {
        name: 'Sarah Chen',
        title: 'VP of Engineering',
        company: 'Goldman Sachs',
        email: 'sarah.chen@gs.com',
        phone: '+1 (212) 555-0123',
        relationship: 'former_manager' as const,
        responseStatus: 'positive' as const,
        contactedAt: new Date('2024-01-18'),
        notes: 'Exceptional team with proven track record in quantitative analysis and risk modeling.',
      },
      {
        name: 'Michael Rodriguez',
        title: 'Managing Director',
        company: 'JPMorgan Chase',
        email: 'michael.rodriguez@jpmorgan.com',
        phone: '+1 (212) 555-0456',
        relationship: 'client' as const,
        responseStatus: 'pending' as const,
      },
    ],
    backgroundChecks: [
      {
        status: 'clear' as const,
        provider: 'Sterling Background',
        completedAt: new Date('2024-01-22'),
      },
    ],
  },
  testimonials: [],
  liftoutHistory: {
    previousLiftouts: [],
    currentEmployer: {
      company: 'Acme Financial Services',
      startDate: new Date('2019-03-15'),
      position: 'Quantitative Analytics Team',
      department: 'Risk Management',
    },
    availability: {
      timeline: '3-6 months',
      noticePeriod: '2 months',
      constraints: ['Non-compete expires in Q2 2024'],
      flexibility: 'Open to relocation',
    },
    liftoutReadiness: {
      teamAlignment: true,
      individualAlignment: [true, true, true, true, true],
      compensationExpectations: 'Competitive with 20% uplift',
      culturalFit: ['Innovation-focused', 'Data-driven', 'Collaborative'],
    },
  },
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-20'),
});

// Transform Prisma team data to verification page format
function transformPrismaTeam(prismaTeam: any, teamId: string) {
  const metrics = (prismaTeam.performanceMetrics as any) || {};
  return {
    id: prismaTeam.id || teamId,
    name: prismaTeam.name || 'Unnamed Team',
    description: prismaTeam.description || '',
    industry: [prismaTeam.industry].filter(Boolean),
    specializations: prismaTeam.specialization ? [prismaTeam.specialization] : [],
    size: prismaTeam.size || prismaTeam.members?.length || 1,
    location: {
      primary: prismaTeam.location || 'Not specified',
      secondary: [],
      remote: prismaTeam.remoteStatus === 'remote',
    },
    members: (prismaTeam.members || []).map((m: any) => ({
      id: m.id,
      name: m.user ? `${m.user.firstName} ${m.user.lastName}`.trim() : 'Unknown',
      role: m.role || '',
      experience: m.user?.profile?.yearsExperience || 0,
      skills: m.keySkills || [],
      bio: m.user?.profile?.bio || '',
      education: '',
      certifications: [],
    })),
    leaderId: prismaTeam.createdBy || '',
    establishedDate: prismaTeam.createdAt || new Date(),
    performanceMetrics: {
      projectsCompleted: metrics.projectsCompleted || 0,
      clientSatisfactionScore: metrics.clientSatisfactionScore || 0,
      successRate: metrics.successRate || 0,
      avgProjectValue: metrics.avgProjectValue || 0,
      repeatClientRate: metrics.repeatClientRate || 0,
      teamCohesionScore: metrics.teamCohesionScore || 0,
      avgExperienceYears: prismaTeam.yearsWorkingTogether ? Number(prismaTeam.yearsWorkingTogether) : 0,
    },
    portfolioItems: [],
    dynamics: {
      communicationStyle: prismaTeam.communicationStyle || '',
      decisionMakingProcess: '',
      conflictResolutionApproach: '',
      leadershipStyle: '',
      meetingCadence: '',
      collaborationTools: [],
      workLifeBalance: prismaTeam.workingStyle || '',
    },
    values: prismaTeam.teamCulture ? [prismaTeam.teamCulture] : [],
    workingMethodology: [],
    verification: {
      status: prismaTeam.verificationStatus || 'pending',
      documents: [],
      references: [],
      backgroundChecks: [],
    },
    testimonials: prismaTeam.clientTestimonials || [],
    liftoutHistory: {
      previousLiftouts: [],
      currentEmployer: {
        company: '',
        startDate: new Date(),
        position: '',
        department: '',
      },
      availability: {
        timeline: prismaTeam.availabilityDate ? new Date(prismaTeam.availabilityDate).toLocaleDateString() : '',
        noticePeriod: '',
        constraints: [],
        flexibility: prismaTeam.remoteStatus || '',
      },
      liftoutReadiness: {
        teamAlignment: prismaTeam.availabilityStatus === 'available',
        individualAlignment: [],
        compensationExpectations: prismaTeam.salaryExpectationMin && prismaTeam.salaryExpectationMax
          ? `${prismaTeam.salaryExpectationMin}-${prismaTeam.salaryExpectationMax} ${prismaTeam.salaryCurrency || 'USD'}`
          : '',
        culturalFit: [],
      },
    },
    createdAt: prismaTeam.createdAt || new Date(),
    updatedAt: prismaTeam.updatedAt || new Date(),
  };
}

export default async function TeamVerificationPage({ params }: TeamVerificationPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  let team;
  let usingFallback = false;

  try {
    // Fetch team from PostgreSQL via Prisma
    const prismaTeam = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profile: {
                  select: {
                    profilePhotoUrl: true,
                    title: true,
                    bio: true,
                    yearsExperience: true,
                  },
                },
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (prismaTeam) {
      team = transformPrismaTeam(prismaTeam, params.id);
    } else {
      // Team not found, use fallback
      team = getFallbackTeam(params.id);
      usingFallback = true;
    }
  } catch (error) {
    console.error('Error fetching team from database:', error);
    // Use fallback data if database fails
    team = getFallbackTeam(params.id);
    usingFallback = true;
  }

  const handleUpdate = () => {
    // In a real app, this would trigger a refetch of team data
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href={`/app/teams/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-text-tertiary hover:text-text-secondary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Team Profile
        </Link>
        <h1 className="page-title">Team Verification</h1>
        <p className="page-subtitle">
          Manage verification documents, references, and background checks to enhance your team&apos;s credibility
        </p>
      </div>

      {/* Demo data notice */}
      {usingFallback && (
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-gold-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gold-800">Demo Data</h3>
              <p className="text-sm text-gold-700 mt-1">
                This team was not found in the database. Showing demo data for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team verification component */}
      <TeamVerification team={team as any} onUpdate={handleUpdate} />
    </div>
  );
}

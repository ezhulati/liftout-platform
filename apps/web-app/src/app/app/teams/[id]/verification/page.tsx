import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TeamVerification } from '@/components/teams/TeamVerification';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface TeamVerificationPageProps {
  params: {
    id: string;
  };
}

export default async function TeamVerificationPage({ params }: TeamVerificationPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  // Mock team data for demo purposes - simplified version for verification component
  const mockTeam = {
    id: params.id,
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
  };

  const handleUpdate = () => {
    // In a real app, this would trigger a refetch of team data
    console.log('Team verification updated');
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href={`/app/teams/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Team Profile
        </Link>
        <h1 className="page-title">Team Verification</h1>
        <p className="page-subtitle">
          Manage verification documents, references, and background checks to enhance your team's credibility
        </p>
      </div>

      {/* Team verification component */}
      <TeamVerification team={mockTeam as any} onUpdate={handleUpdate} />
    </div>
  );
}
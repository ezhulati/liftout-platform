import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Get recommended teams/opportunities
// Returns demo data for now - can be connected to matchingService later
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'teams'; // 'teams' or 'opportunities'

    if (type === 'teams') {
      return NextResponse.json({
        matches: getDemoTeamMatches(),
        source: 'demo',
      });
    } else {
      return NextResponse.json({
        matches: getDemoOpportunityMatches(),
        source: 'demo',
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

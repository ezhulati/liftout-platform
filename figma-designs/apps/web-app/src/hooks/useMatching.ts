'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Demo entity detection helper
const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id?.startsWith('demo-');
};

// Mock team match data for demo users
const getMockTeamMatches = (): { matches: TeamMatch[]; total: number } => ({
  matches: [
    {
      team: {
        id: 'demo-team-1',
        name: 'Strategic Analytics Team',
        description: 'High-performing analytics team with expertise in financial modeling',
        industry: 'Financial Services',
        specialization: 'Data Analytics',
        location: 'New York, NY',
        remoteStatus: 'hybrid',
        size: 4,
        yearsWorkingTogether: 3,
        availabilityStatus: 'available',
        verificationStatus: 'verified',
        memberCount: 4,
        applicationCount: 2,
        skills: ['Python', 'SQL', 'Machine Learning', 'Financial Modeling'],
      },
      score: {
        total: 87,
        breakdown: { skillsMatch: 90, industryMatch: 85, locationMatch: 80, sizeMatch: 95, compensationMatch: 85 },
        recommendation: 'excellent',
        strengths: ['Strong skills alignment', 'Industry expertise'],
        concerns: [],
      },
    },
  ],
  total: 1,
});

// Mock opportunity match data for demo users
const getMockOpportunityMatches = (): { matches: OpportunityMatch[]; total: number } => ({
  matches: [
    {
      opportunity: {
        id: 'demo-opp-1',
        title: 'Senior Engineering Team - FinTech Expansion',
        description: 'Growing fintech startup seeking experienced engineering team',
        company: {
          id: 'demo-company-1',
          name: 'TechCorp Inc.',
          industry: 'Financial Technology',
          logoUrl: null,
          verificationStatus: 'verified',
        },
        industry: 'Financial Technology',
        location: 'San Francisco, CA',
        remotePolicy: 'hybrid',
        compensation: { min: 180000, max: 250000, currency: 'USD' },
        teamSize: { min: 3, max: 6 },
        requiredSkills: ['TypeScript', 'React', 'Node.js', 'AWS'],
        urgency: 'high',
        featured: true,
        applicationCount: 5,
        createdAt: new Date().toISOString(),
      },
      score: {
        total: 82,
        breakdown: { skillsMatch: 85, industryMatch: 80, locationMatch: 75, sizeMatch: 90, compensationMatch: 80 },
        recommendation: 'good',
        strengths: ['Excellent skills match', 'Competitive compensation'],
        concerns: ['Location requires relocation consideration'],
      },
    },
  ],
  total: 1,
});

export interface MatchScore {
  total: number;
  breakdown: {
    skillsMatch: number;
    industryMatch: number;
    locationMatch: number;
    sizeMatch: number;
    compensationMatch: number;
    experienceMatch?: number;
    availabilityMatch?: number;
    urgencyBonus?: number;
    companyQuality?: number;
  };
  recommendation: 'excellent' | 'good' | 'fair' | 'poor';
  strengths: string[];
  concerns: string[];
  insights?: string[];
}

export interface TeamMatch {
  team: {
    id: string;
    name: string;
    description: string | null;
    industry: string | null;
    specialization: string | null;
    location: string | null;
    remoteStatus: string;
    size: number;
    yearsWorkingTogether: number | null;
    availabilityStatus: string;
    verificationStatus: string;
    memberCount: number;
    applicationCount: number;
    skills: string[];
  };
  score: MatchScore;
}

export interface OpportunityMatch {
  opportunity: {
    id: string;
    title: string;
    description: string | null;
    company: {
      id: string;
      name: string;
      industry: string | null;
      logoUrl: string | null;
      verificationStatus: string;
    };
    industry: string | null;
    location: string | null;
    remotePolicy: string;
    compensation: {
      min: number | null;
      max: number | null;
      currency: string;
    };
    teamSize: {
      min: number | null;
      max: number | null;
    };
    requiredSkills: string[];
    urgency: string;
    featured: boolean;
    applicationCount: number;
    createdAt: string;
  };
  score: MatchScore;
}

interface UseTeamMatchesOptions {
  opportunityId: string;
  minScore?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseOpportunityMatchesOptions {
  teamId: string;
  minScore?: number;
  limit?: number;
  enabled?: boolean;
}

// Fetch matching teams for an opportunity
async function fetchTeamMatches(
  opportunityId: string,
  minScore: number = 50,
  limit: number = 20
): Promise<{ matches: TeamMatch[]; total: number }> {
  // Demo entity handling
  if (isDemoEntity(opportunityId)) {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('[Demo] Returning mock team matches');
    return getMockTeamMatches();
  }

  const params = new URLSearchParams({
    opportunityId,
    minScore: minScore.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`/api/matching/teams?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch team matches');
  }

  const data = await response.json();
  return data.data;
}

// Fetch matching opportunities for a team
async function fetchOpportunityMatches(
  teamId: string,
  minScore: number = 50,
  limit: number = 20
): Promise<{ matches: OpportunityMatch[]; total: number }> {
  // Demo entity handling
  if (isDemoEntity(teamId)) {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('[Demo] Returning mock opportunity matches');
    return getMockOpportunityMatches();
  }

  const params = new URLSearchParams({
    teamId,
    minScore: minScore.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`/api/matching/opportunities?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch opportunity matches');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Hook to get matching teams for an opportunity
 */
export function useTeamMatches({
  opportunityId,
  minScore = 50,
  limit = 20,
  enabled = true,
}: UseTeamMatchesOptions) {
  return useQuery({
    queryKey: ['teamMatches', opportunityId, minScore, limit],
    queryFn: () => fetchTeamMatches(opportunityId, minScore, limit),
    enabled: enabled && !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get matching opportunities for a team
 */
export function useOpportunityMatches({
  teamId,
  minScore = 50,
  limit = 20,
  enabled = true,
}: UseOpportunityMatchesOptions) {
  return useQuery({
    queryKey: ['opportunityMatches', teamId, minScore, limit],
    queryFn: () => fetchOpportunityMatches(teamId, minScore, limit),
    enabled: enabled && !!teamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to calculate a single match score (client-side preview)
 * Use this for quick previews before making API calls
 */
export function useMatchPreview() {
  const calculatePreviewScore = (
    teamSkills: string[],
    opportunitySkills: string[],
    teamIndustry: string,
    opportunityIndustry: string
  ): number => {
    // Quick skills match
    const teamSkillsLower = teamSkills.map(s => s.toLowerCase());
    const oppSkillsLower = opportunitySkills.map(s => s.toLowerCase());

    const matchedSkills = oppSkillsLower.filter(skill =>
      teamSkillsLower.some(ts => ts.includes(skill) || skill.includes(ts))
    ).length;

    const skillsScore = oppSkillsLower.length > 0
      ? (matchedSkills / oppSkillsLower.length) * 100
      : 50;

    // Quick industry match
    const industryScore = teamIndustry.toLowerCase() === opportunityIndustry.toLowerCase()
      ? 100
      : teamIndustry.toLowerCase().includes(opportunityIndustry.toLowerCase()) ||
        opportunityIndustry.toLowerCase().includes(teamIndustry.toLowerCase())
        ? 70
        : 40;

    // Weighted average
    return Math.round(skillsScore * 0.6 + industryScore * 0.4);
  };

  return { calculatePreviewScore };
}

/**
 * Get recommendation label and color based on score
 */
export function getMatchRecommendation(score: number): {
  label: string;
  color: string;
  bgColor: string;
  description: string;
} {
  if (score >= 85) {
    return {
      label: 'Excellent Match',
      color: 'text-success',
      bgColor: 'bg-success-light',
      description: 'Highly compatible - strong alignment across key factors',
    };
  }
  if (score >= 70) {
    return {
      label: 'Good Match',
      color: 'text-navy',
      bgColor: 'bg-navy-50',
      description: 'Good compatibility - minor gaps that can be addressed',
    };
  }
  if (score >= 55) {
    return {
      label: 'Fair Match',
      color: 'text-gold',
      bgColor: 'bg-gold-50',
      description: 'Moderate compatibility - some areas need attention',
    };
  }
  return {
    label: 'Low Match',
    color: 'text-text-tertiary',
    bgColor: 'bg-bg-alt',
    description: 'Limited compatibility - significant gaps exist',
  };
}

/**
 * Get breakdown factor label
 */
export function getFactorLabel(factor: string): string {
  const labels: Record<string, string> = {
    skillsMatch: 'Skills Alignment',
    industryMatch: 'Industry Fit',
    locationMatch: 'Location Match',
    sizeMatch: 'Team Size Fit',
    compensationMatch: 'Compensation',
    experienceMatch: 'Experience Level',
    availabilityMatch: 'Availability',
    urgencyBonus: 'Urgency Match',
    companyQuality: 'Company Profile',
  };
  return labels[factor] || factor;
}

/**
 * Get breakdown factor weight (for display)
 */
export function getFactorWeight(factor: string): number {
  const weights: Record<string, number> = {
    skillsMatch: 30,
    industryMatch: 20,
    compensationMatch: 15,
    sizeMatch: 10,
    locationMatch: 10,
    experienceMatch: 10,
    availabilityMatch: 5,
    urgencyBonus: 5,
    companyQuality: 10,
  };
  return weights[factor] || 10;
}

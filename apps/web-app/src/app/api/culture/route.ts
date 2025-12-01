import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/culture - Get culture assessment for team-company matching
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const companyId = searchParams.get('companyId');
    const applicationId = searchParams.get('applicationId');

    // If applicationId provided, get team and company from it
    if (applicationId) {
      const application = await prisma.teamApplication.findUnique({
        where: { id: applicationId },
        include: {
          team: true,
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

      const compatibility = calculateCultureCompatibility(
        application.team,
        application.opportunity.company
      );

      return NextResponse.json({
        success: true,
        data: {
          ...compatibility,
          team: {
            id: application.team.id,
            name: application.team.name,
          },
          company: {
            id: application.opportunity.company.id,
            name: application.opportunity.company.name,
          },
        },
      });
    }

    // Get team and company by IDs
    if (teamId && companyId) {
      const [team, company] = await Promise.all([
        prisma.team.findUnique({ where: { id: teamId } }),
        prisma.company.findUnique({ where: { id: companyId } }),
      ]);

      if (!team || !company) {
        return NextResponse.json({ error: 'Team or company not found' }, { status: 404 });
      }

      const compatibility = calculateCultureCompatibility(team, company);

      return NextResponse.json({
        success: true,
        data: {
          ...compatibility,
          team: { id: team.id, name: team.name },
          company: { id: company.id, name: company.name },
        },
      });
    }

    // Return general culture profiles
    const userType = session.user.userType;

    if (userType === 'company') {
      // Get company's culture profile
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId: session.user.id },
        include: { company: true },
      });

      if (!companyUser) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      }

      const profile = buildCompanyCultureProfile(companyUser.company);
      return NextResponse.json({ success: true, data: profile });
    } else {
      // Get user's teams culture profiles
      const teamMembers = await prisma.teamMember.findMany({
        where: { userId: session.user.id, status: 'active' },
        include: { team: true },
      });

      const profiles = teamMembers.map(tm => buildTeamCultureProfile(tm.team));
      return NextResponse.json({ success: true, data: profiles });
    }
  } catch (error) {
    console.error('Error fetching culture data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch culture data' },
      { status: 500 }
    );
  }
}

// Helper functions

function buildTeamCultureProfile(team: any) {
  // Parse culture-related fields
  const workingStyle = team.workingStyle || 'collaborative';
  const communicationStyle = team.communicationStyle || 'balanced';
  const teamCulture = team.teamCulture || '';

  // Calculate culture dimensions based on team attributes
  const dimensions = {
    powerDistance: calculateFromStyle(workingStyle, 'hierarchy', 45),
    individualismVsCollectivism: calculateFromStyle(workingStyle, 'collaboration', 40),
    uncertaintyAvoidance: calculateFromStyle(communicationStyle, 'structure', 60),
    longTermOrientation: 70, // Default for professional teams
    innovationVsStability: calculateFromCulture(teamCulture, 'innovation', 65),
    processVsResults: calculateFromStyle(workingStyle, 'results', 55),
    riskTolerance: calculateFromCulture(teamCulture, 'risk', 60),
    transparencyVsConfidentiality: calculateFromStyle(communicationStyle, 'openness', 65),
  };

  // Calculate team dynamics from attributes
  const teamDynamics = {
    cohesion: Math.min(95, 60 + (Number(team.yearsWorkingTogether) || 0) * 10),
    trust: Math.min(95, 65 + (Number(team.yearsWorkingTogether) || 0) * 8),
    psychologicalSafety: 70,
    diversityAppreciation: 75,
    roleClarity: 80,
    sharedGoals: 85,
    knowledgeSharing: 75,
    adaptability: 70,
  };

  return {
    id: `culture-${team.id}`,
    entityId: team.id,
    entityType: 'team',
    name: team.name,
    cultureDimensions: dimensions,
    teamDynamics,
    communicationStyle: {
      directness: calculateFromStyle(communicationStyle, 'directness', 65),
      formality: calculateFromStyle(communicationStyle, 'formality', 55),
      frequency: 70,
    },
    workEnvironment: {
      type: team.remoteStatus || 'hybrid',
      autonomy: 75,
      collaboration: calculateFromStyle(workingStyle, 'collaboration', 80),
      formalityLevel: 50,
    },
    assessmentDate: new Date(),
    confidenceLevel: team.teamCulture ? 75 : 50,
    lastUpdated: team.updatedAt,
  };
}

function buildCompanyCultureProfile(company: any) {
  // Parse culture-related fields
  const companyCulture = company.companyCulture || '';
  const values = Array.isArray(company.values) ? company.values : [];

  // Calculate culture dimensions
  const dimensions = {
    powerDistance: calculateFromCulture(companyCulture, 'hierarchy', 55),
    individualismVsCollectivism: calculateFromCulture(companyCulture, 'team', 50),
    uncertaintyAvoidance: calculateFromSize(company.employeeCount, 55),
    longTermOrientation: 75,
    innovationVsStability: calculateFromCulture(companyCulture, 'innovation', 60),
    processVsResults: calculateFromCulture(companyCulture, 'results', 50),
    riskTolerance: calculateFromCulture(companyCulture, 'risk', 55),
    transparencyVsConfidentiality: calculateFromCulture(companyCulture, 'transparency', 60),
  };

  return {
    id: `culture-${company.id}`,
    entityId: company.id,
    entityType: 'company',
    name: company.name,
    cultureDimensions: dimensions,
    coreValues: values.map((v: any, i: number) => ({
      id: `val-${i}`,
      name: typeof v === 'string' ? v : v.name || 'Value',
      description: typeof v === 'object' ? v.description || '' : '',
      importance: 80,
      category: 'performance',
    })),
    communicationStyle: {
      directness: 70,
      formality: calculateFromSize(company.employeeCount, 60),
      frequency: 65,
    },
    workEnvironment: {
      type: 'hybrid',
      autonomy: 70,
      collaboration: 65,
      formalityLevel: calculateFromSize(company.employeeCount, 55),
    },
    leadershipStyle: {
      approach: 'transformational',
      accessibility: 70,
      supportiveness: 75,
      visionCommunication: 80,
      empowerment: 70,
    },
    assessmentDate: new Date(),
    confidenceLevel: companyCulture ? 80 : 55,
    lastUpdated: company.updatedAt,
  };
}

function calculateCultureCompatibility(team: any, company: any) {
  const teamProfile = buildTeamCultureProfile(team);
  const companyProfile = buildCompanyCultureProfile(company);

  // Calculate dimension compatibility
  const dimensionScores: { dimension: string; teamScore: number; companyScore: number; compatibility: number; gap: number; impact: string; recommendation: string }[] = [];

  const dimensionNames: Record<string, string> = {
    powerDistance: 'Hierarchy Preference',
    individualismVsCollectivism: 'Team vs Individual Focus',
    uncertaintyAvoidance: 'Structure Preference',
    innovationVsStability: 'Innovation Orientation',
    processVsResults: 'Process vs Results',
    riskTolerance: 'Risk Tolerance',
    transparencyVsConfidentiality: 'Communication Openness',
  };

  let totalCompatibility = 0;
  let dimensionCount = 0;

  for (const [key, name] of Object.entries(dimensionNames)) {
    const teamScore = teamProfile.cultureDimensions[key as keyof typeof teamProfile.cultureDimensions] || 50;
    const companyScore = companyProfile.cultureDimensions[key as keyof typeof companyProfile.cultureDimensions] || 50;
    const gap = Math.abs(teamScore - companyScore);
    const compatibility = Math.max(0, 100 - gap);

    totalCompatibility += compatibility;
    dimensionCount++;

    dimensionScores.push({
      dimension: name,
      teamScore,
      companyScore,
      compatibility,
      gap,
      impact: gap > 40 ? 'high' : gap > 20 ? 'medium' : 'low',
      recommendation: generateRecommendation(name, teamScore, companyScore, gap),
    });
  }

  const overallScore = Math.round(totalCompatibility / dimensionCount);

  // Identify risks and strengths
  const riskAreas = dimensionScores
    .filter(d => d.gap > 30)
    .map(d => ({
      id: `risk-${d.dimension.toLowerCase().replace(/\s+/g, '-')}`,
      category: 'values',
      description: `Significant gap in ${d.dimension} (${d.gap} points)`,
      severity: d.gap > 50 ? 'high' : 'medium',
      probability: Math.min(90, 50 + d.gap),
      impact: `May affect team integration and collaboration`,
      mitigationStrategies: [d.recommendation],
      timeframe: 'short_term',
    }));

  const strengthAreas = dimensionScores
    .filter(d => d.gap < 15)
    .map(d => ({
      id: `strength-${d.dimension.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Strong alignment on ${d.dimension}`,
      synergy: d.compatibility,
      leverageOpportunities: [`Build on shared ${d.dimension.toLowerCase()} for faster integration`],
    }));

  return {
    id: `compat-${team.id}-${company.id}`,
    teamProfileId: teamProfile.id,
    companyProfileId: companyProfile.id,
    overallScore,
    compatibilityLevel: getCompatibilityLevel(overallScore),
    dimensionCompatibility: dimensionScores,
    riskAreas,
    strengthAreas,
    teamProfile: {
      cultureDimensions: teamProfile.cultureDimensions,
      teamDynamics: teamProfile.teamDynamics,
      communicationStyle: teamProfile.communicationStyle,
    },
    companyProfile: {
      cultureDimensions: companyProfile.cultureDimensions,
      coreValues: companyProfile.coreValues,
      communicationStyle: companyProfile.communicationStyle,
    },
    integrationPlan: {
      id: `plan-${team.id}-${company.id}`,
      timeline: riskAreas.length > 2 ? 120 : 90,
      phases: [
        {
          id: 'phase-1',
          name: 'Cultural Discovery',
          duration: 30,
          activities: ['Team introduction sessions', 'Culture ambassador pairing', 'Values alignment workshop'],
        },
        {
          id: 'phase-2',
          name: 'Integration',
          duration: 60,
          activities: ['Process training', 'Cross-team projects', 'Feedback loops'],
        },
      ],
      successMetrics: [
        'Team retention >95% at 6 months',
        'Cultural integration score >80%',
        'Performance metrics maintained',
      ],
    },
    assessmentDate: new Date(),
    confidenceLevel: Math.min(teamProfile.confidenceLevel, companyProfile.confidenceLevel),
  };
}

function calculateFromStyle(style: string, attribute: string, defaultValue: number): number {
  if (!style) return defaultValue;

  const styleMap: Record<string, Record<string, number>> = {
    collaborative: { collaboration: 85, hierarchy: 35, results: 60 },
    hierarchical: { collaboration: 50, hierarchy: 75, results: 65 },
    agile: { collaboration: 80, hierarchy: 30, results: 75 },
    autonomous: { collaboration: 45, hierarchy: 25, results: 70 },
    direct: { directness: 85, formality: 60, openness: 75 },
    balanced: { directness: 60, formality: 55, openness: 65, structure: 60 },
    formal: { directness: 50, formality: 80, openness: 45, structure: 75 },
    open: { directness: 70, formality: 40, openness: 85, structure: 45 },
  };

  const normalizedStyle = style.toLowerCase();
  return styleMap[normalizedStyle]?.[attribute] || defaultValue;
}

function calculateFromCulture(culture: string, keyword: string, defaultValue: number): number {
  if (!culture) return defaultValue;

  const lowerCulture = culture.toLowerCase();

  const keywordMap: Record<string, { positive: string[]; negative: string[]; boost: number }> = {
    innovation: {
      positive: ['innovate', 'creative', 'cutting-edge', 'pioneer', 'disrupt'],
      negative: ['traditional', 'conservative', 'stable'],
      boost: 20,
    },
    hierarchy: {
      positive: ['structured', 'hierarchy', 'formal', 'process'],
      negative: ['flat', 'egalitarian', 'democratic'],
      boost: 25,
    },
    team: {
      positive: ['team', 'collaborative', 'together', 'collective'],
      negative: ['individual', 'autonomous', 'independent'],
      boost: 25,
    },
    risk: {
      positive: ['bold', 'risk', 'aggressive', 'ambitious'],
      negative: ['cautious', 'conservative', 'safe'],
      boost: 20,
    },
    transparency: {
      positive: ['transparent', 'open', 'honest', 'candid'],
      negative: ['confidential', 'private', 'discrete'],
      boost: 20,
    },
    results: {
      positive: ['results', 'performance', 'achievement', 'outcome'],
      negative: ['process', 'procedure', 'methodology'],
      boost: 15,
    },
  };

  const mapping = keywordMap[keyword];
  if (!mapping) return defaultValue;

  let score = defaultValue;

  for (const word of mapping.positive) {
    if (lowerCulture.includes(word)) {
      score += mapping.boost;
      break;
    }
  }

  for (const word of mapping.negative) {
    if (lowerCulture.includes(word)) {
      score -= mapping.boost;
      break;
    }
  }

  return Math.max(10, Math.min(95, score));
}

function calculateFromSize(employeeCount: number | null, defaultValue: number): number {
  if (!employeeCount) return defaultValue;

  // Larger companies tend to be more formal and structured
  if (employeeCount > 10000) return Math.min(85, defaultValue + 20);
  if (employeeCount > 1000) return Math.min(75, defaultValue + 10);
  if (employeeCount > 100) return defaultValue;
  return Math.max(35, defaultValue - 15);
}

function generateRecommendation(dimension: string, teamScore: number, companyScore: number, gap: number): string {
  if (gap < 15) {
    return `Strong alignment on ${dimension} - leverage this for smooth integration`;
  }

  const recommendations: Record<string, string> = {
    'Hierarchy Preference': teamScore > companyScore
      ? 'Team prefers more structure - clarify reporting lines and decision authority early'
      : 'Team is more egalitarian - provide autonomy while explaining company processes',
    'Team vs Individual Focus': teamScore < companyScore
      ? 'Team is more collaborative - emphasize team-based projects and shared goals'
      : 'Team values individual contribution - ensure clear personal accountability',
    'Innovation Orientation': teamScore > companyScore
      ? 'Team is innovation-driven - channel energy into R&D or improvement initiatives'
      : 'Team prefers stability - emphasize optimization over disruption initially',
    'Risk Tolerance': teamScore > companyScore
      ? 'Team takes more risks - establish guardrails while allowing calculated experimentation'
      : 'Team is more cautious - build trust through gradual expansion of responsibilities',
  };

  return recommendations[dimension] || `Address ${dimension} gap through targeted onboarding activities`;
}

function getCompatibilityLevel(score: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'mismatched' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  if (score >= 40) return 'poor';
  return 'mismatched';
}

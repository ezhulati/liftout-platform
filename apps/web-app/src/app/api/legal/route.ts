import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/legal - Get legal analysis for a team or application
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const teamId = searchParams.get('teamId');
    const analysisType = searchParams.get('type') || 'full'; // 'full' | 'non-compete' | 'compliance'

    if (applicationId) {
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

      const analysis = buildLegalAnalysis(application, analysisType);
      return NextResponse.json({ success: true, data: analysis });
    }

    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
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
      });

      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }

      const analysis = buildTeamLegalAnalysis(team);
      return NextResponse.json({ success: true, data: analysis });
    }

    // No applicationId or teamId provided - return empty legal overview
    // Documents would be fetched from Document model if it existed
    return NextResponse.json({
      success: true,
      data: {
        documents: [],
        message: 'Provide applicationId or teamId for detailed legal analysis'
      }
    });
  } catch (error) {
    console.error('Error fetching legal analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal analysis' },
      { status: 500 }
    );
  }
}

// POST /api/legal - Generate legal document or update analysis
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, applicationId, documentType, variables } = body;

    if (action === 'generate-document') {
      const document = generateLegalDocument(documentType, variables);
      return NextResponse.json({ success: true, data: document });
    }

    if (action === 'update-non-compete') {
      const { memberId, nonCompeteData } = body;

      // Store non-compete analysis in user profile metadata
      const user = await prisma.user.findUnique({
        where: { id: memberId },
        include: { profile: true },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Store in profile extra fields or create separate storage
      // For now, return success with the analysis
      const analysis = analyzeNonCompete(nonCompeteData);
      return NextResponse.json({ success: true, data: analysis });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing legal request:', error);
    return NextResponse.json(
      { error: 'Failed to process legal request' },
      { status: 500 }
    );
  }
}

// Helper functions

function buildLegalAnalysis(application: any, analysisType: string) {
  const team = application.team;
  const company = application.opportunity.company;
  const members = team.members || [];
  const location = team.location || company.headquartersLocation || 'New York';

  // Determine jurisdiction from location
  const jurisdiction = extractJurisdiction(location);

  // Build member-level non-compete analyses
  const memberAnalyses = members.map((member: any) => ({
    memberId: member.userId,
    memberName: `${member.user.firstName} ${member.user.lastName}`,
    role: member.role,
    nonCompeteAnalysis: generateMemberNonCompeteAnalysis(member, jurisdiction),
  }));

  // Calculate overall risk
  const highRiskMembers = memberAnalyses.filter(
    (m: any) => m.nonCompeteAnalysis.violationRisk === 'high' || m.nonCompeteAnalysis.violationRisk === 'prohibitive'
  );

  const overallRisk = highRiskMembers.length > members.length / 2
    ? 'high'
    : highRiskMembers.length > 0
      ? 'medium'
      : 'low';

  // Build compliance checklist
  const complianceChecks = buildComplianceChecklist(team, company, jurisdiction);

  // Calculate estimated costs
  const estimatedCosts = calculateLegalCosts(team, jurisdiction, overallRisk);

  return {
    id: `legal-${application.id}`,
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
    jurisdiction: {
      primary: jurisdiction,
      description: getJurisdictionDescription(jurisdiction),
      nonCompeteEnforcement: getJurisdictionEnforcement(jurisdiction),
    },
    memberAnalyses,
    overallRiskAssessment: {
      level: overallRisk,
      score: overallRisk === 'high' ? 75 : overallRisk === 'medium' ? 50 : 25,
      summary: generateRiskSummary(overallRisk, highRiskMembers.length, members.length),
      keyRisks: identifyKeyRisks(memberAnalyses, complianceChecks),
    },
    complianceChecks,
    estimatedCosts,
    recommendations: generateRecommendations(overallRisk, memberAnalyses, jurisdiction),
    requiredDocuments: getRequiredDocuments(jurisdiction, team.size),
    timeline: {
      estimatedCompletionDays: overallRisk === 'high' ? 90 : overallRisk === 'medium' ? 60 : 45,
      criticalPath: getCriticalPath(memberAnalyses),
    },
    generatedAt: new Date(),
  };
}

function buildTeamLegalAnalysis(team: any) {
  const members = team.members || [];
  const location = team.location || 'New York';
  const jurisdiction = extractJurisdiction(location);

  const memberAnalyses = members.map((member: any) => ({
    memberId: member.userId,
    memberName: `${member.user.firstName} ${member.user.lastName}`,
    role: member.role,
    nonCompeteAnalysis: generateMemberNonCompeteAnalysis(member, jurisdiction),
  }));

  return {
    id: `legal-team-${team.id}`,
    team: {
      id: team.id,
      name: team.name,
      size: team.size,
    },
    jurisdiction,
    memberAnalyses,
    summary: {
      totalMembers: members.length,
      highRiskMembers: memberAnalyses.filter((m: any) => m.nonCompeteAnalysis.violationRisk === 'high').length,
      mediumRiskMembers: memberAnalyses.filter((m: any) => m.nonCompeteAnalysis.violationRisk === 'medium').length,
      lowRiskMembers: memberAnalyses.filter((m: any) => m.nonCompeteAnalysis.violationRisk === 'low').length,
    },
    generatedAt: new Date(),
  };
}

function generateMemberNonCompeteAnalysis(member: any, jurisdiction: string) {
  // Simulate non-compete analysis based on role and jurisdiction
  const isLeader = member.role === 'lead' || member.role === 'founder';
  const jurisdictionFactor = getJurisdictionFactor(jurisdiction);

  // Leaders typically have stronger non-competes
  const hasNonCompete = isLeader || Math.random() > 0.3;
  const duration = isLeader ? 12 : 6;

  if (!hasNonCompete) {
    return {
      hasNonCompete: false,
      violationRisk: 'low',
      enforcementLikelihood: 0,
      recommendations: ['No non-compete restrictions identified'],
    };
  }

  const baseEnforcement = 50 + (isLeader ? 20 : 0);
  const enforcementLikelihood = Math.min(95, Math.max(5, baseEnforcement + jurisdictionFactor));

  const violationRisk = enforcementLikelihood >= 70
    ? 'high'
    : enforcementLikelihood >= 40
      ? 'medium'
      : 'low';

  return {
    hasNonCompete: true,
    nonCompeteTerms: {
      duration,
      geographicScope: jurisdiction === 'California' ? 'Limited' : 'Regional',
      industryScope: ['Financial Services', 'Technology'],
      compensation: isLeader ? 150000 : 0,
    },
    enforcementLikelihood,
    violationRisk,
    factors: [
      {
        factor: 'Duration',
        impact: duration <= 12 ? 'neutral' : 'weakens',
        description: `${duration} month restriction`,
      },
      {
        factor: 'Jurisdiction',
        impact: jurisdictionFactor < 0 ? 'weakens' : 'strengthens',
        description: `${jurisdiction} enforcement policies`,
      },
      {
        factor: 'Role Level',
        impact: isLeader ? 'strengthens' : 'neutral',
        description: isLeader ? 'Leadership role increases enforceability' : 'Standard role',
      },
    ],
    recommendations: generateMemberRecommendations(violationRisk, isLeader, jurisdiction),
    estimatedGardenLeaveCost: hasNonCompete ? (isLeader ? 150000 : 75000) : 0,
  };
}

function extractJurisdiction(location: string): string {
  const locationLower = location.toLowerCase();

  const jurisdictionMap: Record<string, string> = {
    'new york': 'New York',
    'nyc': 'New York',
    'california': 'California',
    'san francisco': 'California',
    'los angeles': 'California',
    'texas': 'Texas',
    'austin': 'Texas',
    'florida': 'Florida',
    'miami': 'Florida',
    'delaware': 'Delaware',
    'illinois': 'Illinois',
    'chicago': 'Illinois',
    'massachusetts': 'Massachusetts',
    'boston': 'Massachusetts',
  };

  for (const [key, value] of Object.entries(jurisdictionMap)) {
    if (locationLower.includes(key)) return value;
  }

  return 'New York'; // Default
}

function getJurisdictionFactor(jurisdiction: string): number {
  const factors: Record<string, number> = {
    'California': -40, // Very weak enforcement
    'New York': 10,
    'Delaware': 15,
    'Texas': 5,
    'Florida': 20,
    'Illinois': 0,
    'Massachusetts': -10,
  };

  return factors[jurisdiction] || 0;
}

function getJurisdictionEnforcement(jurisdiction: string): string {
  const enforcement: Record<string, string> = {
    'California': 'Weak - Non-competes generally unenforceable',
    'New York': 'Moderate - Enforced if reasonable',
    'Delaware': 'Moderate-Strong - Business-friendly',
    'Texas': 'Moderate - Reformed but enforceable',
    'Florida': 'Strong - Generally enforced',
    'Illinois': 'Moderate - Recent reforms',
    'Massachusetts': 'Weak - Garden leave required',
  };

  return enforcement[jurisdiction] || 'Moderate';
}

function getJurisdictionDescription(jurisdiction: string): string {
  const descriptions: Record<string, string> = {
    'California': 'California has the strongest employee protections, making most non-compete agreements unenforceable under Business and Professions Code Section 16600.',
    'New York': 'New York enforces reasonable non-competes but requires them to be necessary to protect legitimate business interests.',
    'Delaware': 'Delaware is business-friendly and generally enforces non-competes if they are reasonable in scope and duration.',
    'Texas': 'Texas reformed non-compete law in 2011, requiring ancillary agreements but generally enforcing reasonable restrictions.',
    'Florida': 'Florida strongly enforces non-competes and has favorable presumptions for employers.',
    'Illinois': 'Illinois requires adequate consideration and has enacted reforms limiting enforcement for lower-wage workers.',
    'Massachusetts': 'Massachusetts requires garden leave pay and limits duration to 12 months for most non-competes.',
  };

  return descriptions[jurisdiction] || 'Jurisdiction has moderate non-compete enforcement policies.';
}

function buildComplianceChecklist(team: any, company: any, jurisdiction: string) {
  return [
    {
      id: 'employment-law',
      category: 'Employment Law',
      status: 'needs_review',
      items: [
        {
          id: 'notice-requirements',
          name: 'Notice Period Compliance',
          requirement: 'Ensure proper notice periods are observed',
          status: 'pending',
          riskLevel: 'medium',
        },
        {
          id: 'employment-agreements',
          name: 'Employment Agreement Review',
          requirement: 'Review and prepare new employment agreements',
          status: 'pending',
          riskLevel: 'medium',
        },
      ],
    },
    {
      id: 'non-compete',
      category: 'Non-Compete Restrictions',
      status: 'needs_review',
      items: [
        {
          id: 'nc-analysis',
          name: 'Non-Compete Analysis',
          requirement: 'Analyze all existing non-compete agreements',
          status: 'pending',
          riskLevel: 'high',
        },
        {
          id: 'garden-leave',
          name: 'Garden Leave Planning',
          requirement: 'Plan garden leave if required',
          status: 'pending',
          riskLevel: 'high',
        },
      ],
    },
    {
      id: 'ip-trade-secrets',
      category: 'IP & Trade Secrets',
      status: 'needs_review',
      items: [
        {
          id: 'ip-assignment',
          name: 'IP Assignment Review',
          requirement: 'Review IP assignment clauses in current contracts',
          status: 'pending',
          riskLevel: 'high',
        },
        {
          id: 'trade-secrets',
          name: 'Trade Secret Protection',
          requirement: 'Ensure no trade secret violations',
          status: 'pending',
          riskLevel: 'critical',
        },
      ],
    },
    {
      id: 'regulatory',
      category: 'Regulatory Compliance',
      status: 'needs_review',
      items: [
        {
          id: 'industry-regs',
          name: 'Industry Regulations',
          requirement: 'Comply with industry-specific regulations',
          status: 'pending',
          riskLevel: 'medium',
        },
        {
          id: 'data-protection',
          name: 'Data Protection',
          requirement: 'Ensure data protection compliance',
          status: 'pending',
          riskLevel: 'medium',
        },
      ],
    },
  ];
}

function calculateLegalCosts(team: any, jurisdiction: string, overallRisk: string) {
  const baseCosts: Record<string, number> = {
    'California': 50000,
    'New York': 125000,
    'Delaware': 75000,
    'Texas': 100000,
    'Florida': 150000,
  };

  const baseCost = baseCosts[jurisdiction] || 100000;
  const sizeMultiplier = 1 + (team.size - 1) * 0.15;
  const riskMultiplier = overallRisk === 'high' ? 1.5 : overallRisk === 'medium' ? 1.2 : 1.0;

  const legalFees = Math.round(baseCost * sizeMultiplier * riskMultiplier);
  const gardenLeaveCost = overallRisk === 'high'
    ? team.size * 100000
    : overallRisk === 'medium'
      ? team.size * 50000
      : 0;

  return {
    legalFees,
    gardenLeaveCost,
    contingencyLitigation: overallRisk === 'high' ? 200000 : 50000,
    total: legalFees + gardenLeaveCost + (overallRisk === 'high' ? 200000 : 50000),
    breakdown: [
      { category: 'Legal Review & Documentation', amount: legalFees },
      { category: 'Garden Leave (if required)', amount: gardenLeaveCost },
      { category: 'Contingency for Disputes', amount: overallRisk === 'high' ? 200000 : 50000 },
    ],
  };
}

function generateRiskSummary(risk: string, highRiskCount: number, totalMembers: number): string {
  if (risk === 'high') {
    return `${highRiskCount} of ${totalMembers} team members have high-risk non-compete situations requiring immediate attention.`;
  }
  if (risk === 'medium') {
    return `Some team members have moderate non-compete restrictions. Careful planning recommended.`;
  }
  return `Low legal risk identified. Standard employment transition procedures should suffice.`;
}

function identifyKeyRisks(memberAnalyses: any[], complianceChecks: any[]) {
  const risks = [];

  const highRiskMembers = memberAnalyses.filter((m: any) => m.nonCompeteAnalysis.violationRisk === 'high');
  if (highRiskMembers.length > 0) {
    risks.push({
      id: 'nc-risk',
      category: 'Non-Compete',
      severity: 'high',
      description: `${highRiskMembers.length} team members have enforceable non-compete agreements`,
    });
  }

  const criticalItems = complianceChecks
    .flatMap(c => c.items)
    .filter(i => i.riskLevel === 'critical');

  if (criticalItems.length > 0) {
    risks.push({
      id: 'compliance-risk',
      category: 'Compliance',
      severity: 'high',
      description: `${criticalItems.length} critical compliance items require attention`,
    });
  }

  return risks;
}

function generateRecommendations(risk: string, memberAnalyses: any[], jurisdiction: string) {
  const recommendations = [];

  if (risk === 'high') {
    recommendations.push({
      id: 'garden-leave',
      priority: 'critical',
      title: 'Implement Garden Leave Program',
      description: 'Budget for garden leave payments to honor non-compete restrictions',
      estimatedCost: memberAnalyses.reduce((sum: number, m: any) =>
        sum + (m.nonCompeteAnalysis.estimatedGardenLeaveCost || 0), 0),
    });
    recommendations.push({
      id: 'legal-counsel',
      priority: 'critical',
      title: 'Engage Specialized Legal Counsel',
      description: 'Retain employment law specialists familiar with team liftouts',
    });
  }

  recommendations.push({
    id: 'nda-review',
    priority: 'high',
    title: 'NDA and Confidentiality Review',
    description: 'Ensure team members can transition without violating confidentiality obligations',
  });

  if (jurisdiction !== 'California') {
    recommendations.push({
      id: 'negotiate-release',
      priority: 'medium',
      title: 'Negotiate Non-Compete Releases',
      description: 'Attempt to negotiate releases or modifications to existing restrictions',
    });
  }

  return recommendations;
}

function generateMemberRecommendations(risk: string, isLeader: boolean, jurisdiction: string) {
  const recs = [];

  if (risk === 'high') {
    recs.push('Consider full garden leave period before starting');
    if (isLeader) {
      recs.push('Negotiate release or modification of non-compete');
    }
  }

  if (risk === 'medium') {
    recs.push('Review specific terms for potential challenges');
    recs.push('Consider role modification to avoid direct competition');
  }

  if (jurisdiction === 'California') {
    recs.push('California law may render non-compete unenforceable');
  }

  return recs;
}

function getRequiredDocuments(jurisdiction: string, teamSize: number) {
  const docs = [
    {
      id: 'employment-agreements',
      name: 'Current Employment Agreements',
      description: 'Copies of all team member employment contracts',
      required: true,
      count: teamSize,
    },
    {
      id: 'non-compete-copies',
      name: 'Non-Compete Agreements',
      description: 'All non-compete and non-solicitation agreements',
      required: true,
      count: teamSize,
    },
    {
      id: 'nda-copies',
      name: 'Confidentiality Agreements',
      description: 'NDAs and confidentiality provisions',
      required: true,
      count: teamSize,
    },
    {
      id: 'ip-assignments',
      name: 'IP Assignment Agreements',
      description: 'Intellectual property assignment documentation',
      required: true,
      count: teamSize,
    },
  ];

  return docs;
}

function getCriticalPath(memberAnalyses: any[]) {
  const highRisk = memberAnalyses.filter((m: any) => m.nonCompeteAnalysis.violationRisk === 'high');

  if (highRisk.length > 0) {
    const maxDuration = Math.max(...highRisk.map((m: any) =>
      m.nonCompeteAnalysis.nonCompeteTerms?.duration || 0));
    return [
      { step: 'Legal Review', duration: 14 },
      { step: 'Negotiation Attempts', duration: 30 },
      { step: 'Garden Leave (if needed)', duration: maxDuration * 30 },
    ];
  }

  return [
    { step: 'Legal Review', duration: 14 },
    { step: 'Documentation', duration: 14 },
    { step: 'Transition', duration: 30 },
  ];
}

function generateLegalDocument(documentType: string, variables: Record<string, any>) {
  // Return document template based on type
  const templates: Record<string, (v: Record<string, any>) => string> = {
    'nda': (v) => `
MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is entered into on ${v.date || new Date().toLocaleDateString()} between:
Party 1: ${v.party1Name || '[PARTY 1]'}
Party 2: ${v.party2Name || '[PARTY 2]'}

1. CONFIDENTIAL INFORMATION
Both parties agree to maintain confidentiality of all non-public information shared.

2. OBLIGATIONS
- Hold information in strict confidence
- Use only for evaluation purposes
- Not disclose to third parties

3. TERM
This agreement remains in effect for ${v.duration || '2'} years.

4. GOVERNING LAW
Governed by the laws of ${v.jurisdiction || 'New York'}.

[Signatures]
    `,
    'employment': (v) => `
EMPLOYMENT AGREEMENT

Employee: ${v.employeeName || '[EMPLOYEE]'}
Position: ${v.position || '[POSITION]'}
Company: ${v.companyName || '[COMPANY]'}

1. COMPENSATION
Base Salary: $${(v.baseSalary || 0).toLocaleString()} annually

2. START DATE
${v.startDate || '[START DATE]'}

3. BENEFITS
Standard company benefits package applies.

4. GOVERNING LAW
Governed by the laws of ${v.jurisdiction || 'New York'}.

[Signatures]
    `,
  };

  const generator = templates[documentType];
  if (!generator) {
    return { error: 'Unknown document type' };
  }

  return {
    type: documentType,
    content: generator(variables),
    generatedAt: new Date(),
    variables,
  };
}

function analyzeNonCompete(data: any) {
  const { duration, geographicScope, industryScope, jurisdiction } = data;

  const jurisdictionFactor = getJurisdictionFactor(jurisdiction);
  let score = 50;

  // Duration factor
  if (duration <= 6) score -= 15;
  else if (duration <= 12) score += 5;
  else score += 20;

  // Geographic scope
  if (geographicScope === 'worldwide') score += 10;
  else if (geographicScope === 'national') score += 5;
  else score -= 10;

  // Industry scope
  if (Array.isArray(industryScope) && industryScope.length > 3) score += 10;

  score += jurisdictionFactor;
  score = Math.max(5, Math.min(95, score));

  return {
    enforcementLikelihood: score,
    violationRisk: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
    recommendations: generateMemberRecommendations(
      score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
      true,
      jurisdiction
    ),
  };
}

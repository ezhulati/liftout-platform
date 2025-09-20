export interface CultureProfile {
  id: string;
  entityId: string; // team or company ID
  entityType: 'team' | 'company';
  
  // Core Culture Dimensions (Based on Hofstede + Corporate Culture frameworks)
  cultureDimensions: CultureDimensions;
  
  // Values & Beliefs
  coreValues: CoreValue[];
  workingPrinciples: WorkingPrinciple[];
  
  // Behavioral Patterns
  communicationStyle: CommunicationStyle;
  decisionMaking: DecisionMakingStyle;
  conflictResolution: ConflictResolutionStyle;
  
  // Work Environment
  workEnvironment: WorkEnvironment;
  leadershipStyle: LeadershipStyle;
  performanceOrientation: PerformanceOrientation;
  
  // Team Dynamics (for teams)
  teamDynamics?: TeamDynamics;
  
  // Assessment metadata
  assessmentDate: Date;
  assessmentMethod: 'survey' | 'interview' | 'observation' | 'combined';
  confidenceLevel: number; // 0-100
  lastUpdated: Date;
}

export interface CultureDimensions {
  // Hofstede's Cultural Dimensions (adapted for corporate culture)
  powerDistance: number; // 0-100: hierarchy vs egalitarian
  individualismVsCollectivism: number; // 0-100: individual vs team focus
  uncertaintyAvoidance: number; // 0-100: structure vs flexibility
  longTermOrientation: number; // 0-100: long-term vs short-term focus
  
  // Corporate-specific dimensions
  innovationVsStability: number; // 0-100: innovation vs stability
  processVsResults: number; // 0-100: process focus vs results focus
  riskTolerance: number; // 0-100: risk-averse vs risk-taking
  transparencyVsConfidentiality: number; // 0-100: open vs confidential
}

export interface CoreValue {
  id: string;
  name: string;
  description: string;
  importance: number; // 0-100
  category: ValueCategory;
  evidencePoints: string[]; // Observable behaviors that demonstrate this value
}

export type ValueCategory = 
  | 'performance'
  | 'integrity'
  | 'innovation'
  | 'collaboration'
  | 'customer_focus'
  | 'quality'
  | 'diversity'
  | 'sustainability'
  | 'growth'
  | 'accountability';

export interface WorkingPrinciple {
  id: string;
  principle: string;
  description: string;
  frequency: number; // 0-100: how often this principle is applied
  criticality: number; // 0-100: how critical this principle is to success
}

export interface CommunicationStyle {
  directness: number; // 0-100: indirect vs direct
  formality: number; // 0-100: informal vs formal
  frequency: number; // 0-100: minimal vs frequent communication
  channels: CommunicationChannel[];
  feedbackStyle: 'immediate' | 'scheduled' | 'informal' | 'formal_only';
}

export interface CommunicationChannel {
  type: 'email' | 'slack' | 'meetings' | 'one_on_one' | 'presentations' | 'informal';
  usage: number; // 0-100: frequency of use
  effectiveness: number; // 0-100: perceived effectiveness
}

export interface DecisionMakingStyle {
  centralization: number; // 0-100: distributed vs centralized
  speed: number; // 0-100: deliberate vs fast
  dataOrientation: number; // 0-100: intuition vs data-driven
  consensusBuilding: number; // 0-100: individual vs consensus
  riskAssessment: 'comprehensive' | 'moderate' | 'minimal' | 'intuitive';
}

export interface ConflictResolutionStyle {
  approach: 'avoidance' | 'accommodation' | 'competition' | 'compromise' | 'collaboration';
  escalationSpeed: number; // 0-100: immediate vs gradual escalation
  mediationPreference: 'internal' | 'external' | 'peer' | 'hierarchical';
  resolutionFocus: 'relationship' | 'task' | 'balanced';
}

export interface WorkEnvironment {
  physicalSpace: PhysicalSpace;
  workSchedule: WorkSchedule;
  autonomy: number; // 0-100: micromanaged vs autonomous
  collaboration: number; // 0-100: individual vs collaborative
  formalityLevel: number; // 0-100: casual vs formal
}

export interface PhysicalSpace {
  type: 'remote' | 'hybrid' | 'office' | 'flexible';
  openness: number; // 0-100: private offices vs open plan
  interaction: number; // 0-100: isolated vs high interaction
  flexibility: number; // 0-100: fixed vs flexible workspace
}

export interface WorkSchedule {
  flexibility: number; // 0-100: fixed vs flexible hours
  intensity: number; // 0-100: relaxed vs intense pace
  workLifeBalance: number; // 0-100: work-focused vs balance-focused
  overtimeExpectation: 'rare' | 'seasonal' | 'regular' | 'constant';
}

export interface LeadershipStyle {
  approach: 'autocratic' | 'democratic' | 'laissez_faire' | 'transformational' | 'servant';
  accessibility: number; // 0-100: distant vs accessible
  supportiveness: number; // 0-100: hands-off vs supportive
  visionCommunication: number; // 0-100: unclear vs clear vision
  empowerment: number; // 0-100: controlling vs empowering
}

export interface PerformanceOrientation {
  meritocracy: number; // 0-100: tenure-based vs merit-based
  goalClarity: number; // 0-100: vague vs clear goals
  feedbackFrequency: number; // 0-100: annual vs continuous
  recognitionStyle: 'private' | 'team' | 'public' | 'monetary' | 'mixed';
  improvementFocus: 'strengths' | 'weaknesses' | 'balanced';
}

export interface TeamDynamics {
  cohesion: number; // 0-100: fragmented vs cohesive
  trust: number; // 0-100: low trust vs high trust
  psychologicalSafety: number; // 0-100: unsafe vs safe to take risks
  diversityAppreciation: number; // 0-100: homogeneous vs diversity-valued
  
  // Team-specific patterns
  roleClarity: number; // 0-100: unclear vs clear roles
  sharedGoals: number; // 0-100: individual vs shared focus
  knowledgeSharing: number; // 0-100: hoarding vs sharing
  adaptability: number; // 0-100: rigid vs adaptable
}

export interface CultureCompatibility {
  id: string;
  teamProfileId: string;
  companyProfileId: string;
  
  // Overall compatibility
  overallScore: number; // 0-100
  compatibilityLevel: 'excellent' | 'good' | 'moderate' | 'poor' | 'mismatched';
  
  // Dimension-wise compatibility
  dimensionCompatibility: DimensionCompatibility[];
  
  // Risk areas
  riskAreas: CultureRisk[];
  strengthAreas: CultureStrength[];
  
  // Integration recommendations
  integrationPlan: CultureIntegrationPlan;
  
  // Assessment metadata
  assessmentDate: Date;
  confidenceLevel: number;
}

export interface DimensionCompatibility {
  dimension: string;
  teamScore: number;
  companyScore: number;
  compatibility: number; // 0-100
  gap: number; // absolute difference
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface CultureRisk {
  id: string;
  category: 'values' | 'communication' | 'leadership' | 'work_style' | 'performance';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  impact: string;
  mitigationStrategies: string[];
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
}

export interface CultureStrength {
  id: string;
  description: string;
  synergy: number; // 0-100: potential synergy value
  leverageOpportunities: string[];
}

export interface CultureIntegrationPlan {
  id: string;
  phases: IntegrationPhase[];
  timeline: number; // days
  successMetrics: string[];
  milestones: IntegrationMilestone[];
  resources: IntegrationResource[];
}

export interface IntegrationPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  activities: IntegrationActivity[];
  successCriteria: string[];
  risks: string[];
}

export interface IntegrationActivity {
  id: string;
  name: string;
  description: string;
  type: 'workshop' | 'mentoring' | 'shadowing' | 'training' | 'social' | 'assessment';
  participants: ('team_members' | 'company_leaders' | 'hr' | 'external_facilitator')[];
  duration: number; // hours
  frequency: 'once' | 'weekly' | 'monthly' | 'as_needed';
}

export interface IntegrationMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  successMetrics: string[];
  dependencies: string[];
}

export interface IntegrationResource {
  type: 'facilitator' | 'training_materials' | 'assessment_tools' | 'technology' | 'space';
  description: string;
  cost?: number;
  timeline: string;
}

// Culture assessment algorithms

export function calculateCultureCompatibility(
  teamProfile: CultureProfile, 
  companyProfile: CultureProfile
): CultureCompatibility {
  const dimensionCompatibility = calculateDimensionCompatibility(
    teamProfile.cultureDimensions,
    companyProfile.cultureDimensions
  );
  
  const valueCompatibility = calculateValueCompatibility(
    teamProfile.coreValues,
    companyProfile.coreValues
  );
  
  const communicationCompatibility = calculateCommunicationCompatibility(
    teamProfile.communicationStyle,
    companyProfile.communicationStyle
  );
  
  const leadershipCompatibility = calculateLeadershipCompatibility(
    teamProfile.leadershipStyle,
    companyProfile.leadershipStyle
  );
  
  // Weighted overall score
  const overallScore = (
    dimensionCompatibility * 0.3 +
    valueCompatibility * 0.25 +
    communicationCompatibility * 0.25 +
    leadershipCompatibility * 0.2
  );
  
  const riskAreas = identifyRiskAreas(teamProfile, companyProfile, dimensionCompatibility);
  const strengthAreas = identifyStrengthAreas(teamProfile, companyProfile);
  
  return {
    id: `compat-${teamProfile.id}-${companyProfile.id}`,
    teamProfileId: teamProfile.id,
    companyProfileId: companyProfile.id,
    overallScore,
    compatibilityLevel: getCompatibilityLevel(overallScore),
    dimensionCompatibility: calculateDetailedDimensionCompatibility(teamProfile, companyProfile),
    riskAreas,
    strengthAreas,
    integrationPlan: generateIntegrationPlan(teamProfile, companyProfile, riskAreas),
    assessmentDate: new Date(),
    confidenceLevel: Math.min(teamProfile.confidenceLevel, companyProfile.confidenceLevel),
  };
}

function calculateDimensionCompatibility(
  teamDimensions: CultureDimensions,
  companyDimensions: CultureDimensions
): number {
  const dimensions = [
    'powerDistance',
    'individualismVsCollectivism',
    'uncertaintyAvoidance',
    'longTermOrientation',
    'innovationVsStability',
    'processVsResults',
    'riskTolerance',
    'transparencyVsConfidentiality'
  ] as const;
  
  let totalCompatibility = 0;
  dimensions.forEach(dim => {
    const gap = Math.abs(teamDimensions[dim] - companyDimensions[dim]);
    const compatibility = Math.max(0, 100 - gap);
    totalCompatibility += compatibility;
  });
  
  return totalCompatibility / dimensions.length;
}

function calculateValueCompatibility(teamValues: CoreValue[], companyValues: CoreValue[]): number {
  if (teamValues.length === 0 || companyValues.length === 0) return 50;
  
  let totalAlignment = 0;
  let comparisons = 0;
  
  teamValues.forEach(teamValue => {
    const matchingCompanyValue = companyValues.find(cv => cv.category === teamValue.category);
    if (matchingCompanyValue) {
      const importanceGap = Math.abs(teamValue.importance - matchingCompanyValue.importance);
      const alignment = Math.max(0, 100 - importanceGap);
      totalAlignment += alignment;
      comparisons++;
    }
  });
  
  return comparisons > 0 ? totalAlignment / comparisons : 50;
}

function calculateCommunicationCompatibility(
  teamComm: CommunicationStyle,
  companyComm: CommunicationStyle
): number {
  const factors = [
    Math.abs(teamComm.directness - companyComm.directness),
    Math.abs(teamComm.formality - companyComm.formality),
    Math.abs(teamComm.frequency - companyComm.frequency),
  ];
  
  const avgGap = factors.reduce((sum, gap) => sum + gap, 0) / factors.length;
  return Math.max(0, 100 - avgGap);
}

function calculateLeadershipCompatibility(
  teamLeadership: LeadershipStyle,
  companyLeadership: LeadershipStyle
): number {
  if (teamLeadership.approach === companyLeadership.approach) {
    return 90; // High compatibility for same approach
  }
  
  // Define compatibility matrix for different leadership styles
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'democratic': { 'transformational': 85, 'servant': 80, 'laissez_faire': 60, 'autocratic': 30 },
    'transformational': { 'democratic': 85, 'servant': 75, 'laissez_faire': 50, 'autocratic': 40 },
    'servant': { 'democratic': 80, 'transformational': 75, 'laissez_faire': 65, 'autocratic': 25 },
    'laissez_faire': { 'democratic': 60, 'transformational': 50, 'servant': 65, 'autocratic': 20 },
    'autocratic': { 'democratic': 30, 'transformational': 40, 'servant': 25, 'laissez_faire': 20 }
  };
  
  return compatibilityMatrix[teamLeadership.approach]?.[companyLeadership.approach] || 50;
}

function calculateDetailedDimensionCompatibility(
  teamProfile: CultureProfile,
  companyProfile: CultureProfile
): DimensionCompatibility[] {
  const dimensions = [
    { key: 'powerDistance', name: 'Power Distance', weight: 0.15 },
    { key: 'individualismVsCollectivism', name: 'Individual vs Team Focus', weight: 0.20 },
    { key: 'uncertaintyAvoidance', name: 'Structure vs Flexibility', weight: 0.15 },
    { key: 'innovationVsStability', name: 'Innovation vs Stability', weight: 0.20 },
    { key: 'riskTolerance', name: 'Risk Tolerance', weight: 0.15 },
    { key: 'transparencyVsConfidentiality', name: 'Transparency', weight: 0.15 }
  ];
  
  return dimensions.map(dim => {
    const teamScore = teamProfile.cultureDimensions[dim.key as keyof CultureDimensions];
    const companyScore = companyProfile.cultureDimensions[dim.key as keyof CultureDimensions];
    const gap = Math.abs(teamScore - companyScore);
    const compatibility = Math.max(0, 100 - gap);
    
    return {
      dimension: dim.name,
      teamScore,
      companyScore,
      compatibility,
      gap,
      impact: gap > 50 ? 'critical' : gap > 30 ? 'high' : gap > 15 ? 'medium' : 'low',
      recommendation: generateDimensionRecommendation(dim.name, teamScore, companyScore, gap)
    };
  });
}

function generateDimensionRecommendation(
  dimension: string, 
  teamScore: number, 
  companyScore: number, 
  gap: number
): string {
  if (gap < 15) return `Strong alignment on ${dimension.toLowerCase()} - leverage this compatibility`;
  
  if (dimension === 'Individual vs Team Focus') {
    if (teamScore > companyScore) {
      return 'Team is more collaborative - create opportunities for team-based projects';
    } else {
      return 'Team is more individual-focused - provide clear individual goals and recognition';
    }
  }
  
  if (dimension === 'Innovation vs Stability') {
    if (teamScore > companyScore) {
      return 'Team is more innovation-oriented - channel energy into R&D initiatives';
    } else {
      return 'Team values stability - emphasize process improvement and optimization';
    }
  }
  
  return `Moderate gap in ${dimension.toLowerCase()} - develop bridging strategies during integration`;
}

function identifyRiskAreas(
  teamProfile: CultureProfile,
  companyProfile: CultureProfile,
  compatibilityScore: number
): CultureRisk[] {
  const risks: CultureRisk[] = [];
  
  // Communication style risks
  const commGap = Math.abs(teamProfile.communicationStyle.directness - companyProfile.communicationStyle.directness);
  if (commGap > 40) {
    risks.push({
      id: 'comm-directness',
      category: 'communication',
      description: 'Significant difference in communication directness may lead to misunderstandings',
      severity: 'high',
      probability: 75,
      impact: 'Potential for miscommunication, conflict, and reduced team effectiveness',
      mitigationStrategies: [
        'Communication style training for both teams',
        'Establish clear communication protocols',
        'Regular feedback sessions to address misunderstandings'
      ],
      timeframe: 'immediate'
    });
  }
  
  // Decision-making risks
  const decisionGap = Math.abs(teamProfile.decisionMaking.centralization - companyProfile.decisionMaking.centralization);
  if (decisionGap > 35) {
    risks.push({
      id: 'decision-centralization',
      category: 'leadership',
      description: 'Mismatch in decision-making approaches may cause frustration',
      severity: 'medium',
      probability: 65,
      impact: 'Slower decision-making, role confusion, reduced autonomy satisfaction',
      mitigationStrategies: [
        'Define clear decision-making authority levels',
        'Gradual transition to company decision-making style',
        'Regular leadership alignment meetings'
      ],
      timeframe: 'short_term'
    });
  }
  
  return risks;
}

function identifyStrengthAreas(
  teamProfile: CultureProfile,
  companyProfile: CultureProfile
): CultureStrength[] {
  const strengths: CultureStrength[] = [];
  
  // Innovation synergy
  if (teamProfile.cultureDimensions.innovationVsStability > 70 && 
      companyProfile.cultureDimensions.innovationVsStability > 70) {
    strengths.push({
      id: 'innovation-synergy',
      description: 'Both team and company are highly innovation-oriented',
      synergy: 85,
      leverageOpportunities: [
        'Lead next-generation product development',
        'Establish innovation lab or incubator',
        'Cross-pollinate ideas with other innovative teams'
      ]
    });
  }
  
  // Performance alignment
  if (teamProfile.performanceOrientation.meritocracy > 80 && 
      companyProfile.performanceOrientation.meritocracy > 80) {
    strengths.push({
      id: 'performance-alignment',
      description: 'Strong mutual focus on merit-based performance',
      synergy: 90,
      leverageOpportunities: [
        'Showcase team as performance benchmark',
        'Implement best practices across organization',
        'Fast-track high performers to leadership roles'
      ]
    });
  }
  
  return strengths;
}

function generateIntegrationPlan(
  teamProfile: CultureProfile,
  companyProfile: CultureProfile,
  risks: CultureRisk[]
): CultureIntegrationPlan {
  const phases: IntegrationPhase[] = [
    {
      id: 'phase-1',
      name: 'Cultural Discovery & Alignment',
      description: 'Initial integration focused on understanding and aligning cultural differences',
      duration: 30,
      activities: [
        {
          id: 'cultural-immersion',
          name: 'Cultural Immersion Sessions',
          description: 'Joint sessions for team and company to share values, practices, and expectations',
          type: 'workshop',
          participants: ['team_members', 'company_leaders', 'hr'],
          duration: 4,
          frequency: 'weekly'
        },
        {
          id: 'buddy-system',
          name: 'Culture Buddy Program',
          description: 'Pair team members with company culture ambassadors',
          type: 'mentoring',
          participants: ['team_members', 'company_leaders'],
          duration: 2,
          frequency: 'weekly'
        }
      ],
      successCriteria: [
        'Team members report 80%+ comfort with company culture',
        'Zero major cultural conflicts reported',
        'Completion of cultural assessment surveys'
      ],
      risks: [
        'Initial resistance to change',
        'Information overload',
        'Superficial engagement'
      ]
    },
    {
      id: 'phase-2',
      name: 'Operational Integration',
      description: 'Integrate team into company processes and working methods',
      duration: 60,
      activities: [
        {
          id: 'process-training',
          name: 'Company Process Training',
          description: 'Training on company-specific processes, tools, and methodologies',
          type: 'training',
          participants: ['team_members', 'hr'],
          duration: 8,
          frequency: 'as_needed'
        }
      ],
      successCriteria: [
        'Team operating at 90% efficiency in company processes',
        'Successful completion of first major project'
      ],
      risks: [
        'Process adaptation difficulties',
        'Productivity temporary decline'
      ]
    }
  ];
  
  return {
    id: `integration-${teamProfile.id}-${companyProfile.id}`,
    phases,
    timeline: 90,
    successMetrics: [
      'Team retention rate >95% at 6 months',
      'Cultural integration score >80%',
      'Performance metrics maintained or improved'
    ],
    milestones: [
      {
        id: 'milestone-1',
        name: 'Cultural Baseline Established',
        description: 'Initial cultural assessment completed and integration plan finalized',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        successMetrics: ['Assessment completion', 'Plan approval'],
        dependencies: []
      }
    ],
    resources: [
      {
        type: 'facilitator',
        description: 'Organizational psychology consultant for cultural integration',
        cost: 50000,
        timeline: '90 days'
      },
      {
        type: 'training_materials',
        description: 'Custom cultural integration materials and assessments',
        cost: 15000,
        timeline: '30 days'
      }
    ]
  };
}

function getCompatibilityLevel(score: number): 'excellent' | 'good' | 'moderate' | 'poor' | 'mismatched' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  if (score >= 40) return 'poor';
  return 'mismatched';
}

// Mock data for development
export const mockCultureProfiles: CultureProfile[] = [
  {
    id: 'culture-gs-qis',
    entityId: 'team-gs-qis',
    entityType: 'team',
    cultureDimensions: {
      powerDistance: 65, // Moderate hierarchy
      individualismVsCollectivism: 45, // Balanced, slight team focus
      uncertaintyAvoidance: 75, // High structure preference
      longTermOrientation: 80, // Long-term focused
      innovationVsStability: 85, // High innovation
      processVsResults: 30, // Results-focused
      riskTolerance: 90, // High risk tolerance
      transparencyVsConfidentiality: 40, // Moderate confidentiality
    },
    coreValues: [
      {
        id: 'val-1',
        name: 'Analytical Excellence',
        description: 'Commitment to rigorous quantitative analysis and data-driven decision making',
        importance: 95,
        category: 'performance',
        evidencePoints: ['Complex model development', 'Peer review processes', 'Continuous learning']
      },
      {
        id: 'val-2',
        name: 'Innovation in Finance',
        description: 'Pioneering new quantitative methods and trading strategies',
        importance: 90,
        category: 'innovation',
        evidencePoints: ['Patent applications', 'Research publications', 'Industry recognition']
      }
    ],
    workingPrinciples: [
      {
        id: 'wp-1',
        principle: 'Data-Driven Decisions',
        description: 'All strategic decisions must be supported by quantitative analysis',
        frequency: 95,
        criticality: 90
      }
    ],
    communicationStyle: {
      directness: 80,
      formality: 70,
      frequency: 60,
      channels: [
        { type: 'email', usage: 80, effectiveness: 75 },
        { type: 'meetings', usage: 60, effectiveness: 85 }
      ],
      feedbackStyle: 'immediate'
    },
    decisionMaking: {
      centralization: 40,
      speed: 70,
      dataOrientation: 95,
      consensusBuilding: 60,
      riskAssessment: 'comprehensive'
    },
    conflictResolution: {
      approach: 'collaboration',
      escalationSpeed: 30,
      mediationPreference: 'peer',
      resolutionFocus: 'task'
    },
    workEnvironment: {
      physicalSpace: {
        type: 'hybrid',
        openness: 60,
        interaction: 70,
        flexibility: 50
      },
      workSchedule: {
        flexibility: 70,
        intensity: 85,
        workLifeBalance: 60,
        overtimeExpectation: 'regular'
      },
      autonomy: 80,
      collaboration: 75,
      formalityLevel: 60
    },
    leadershipStyle: {
      approach: 'transformational',
      accessibility: 75,
      supportiveness: 80,
      visionCommunication: 85,
      empowerment: 80
    },
    performanceOrientation: {
      meritocracy: 90,
      goalClarity: 85,
      feedbackFrequency: 80,
      recognitionStyle: 'mixed',
      improvementFocus: 'strengths'
    },
    teamDynamics: {
      cohesion: 85,
      trust: 88,
      psychologicalSafety: 80,
      diversityAppreciation: 75,
      roleClarity: 90,
      sharedGoals: 85,
      knowledgeSharing: 80,
      adaptability: 85
    },
    assessmentDate: new Date('2024-09-15'),
    assessmentMethod: 'combined',
    confidenceLevel: 85,
    lastUpdated: new Date('2024-09-15')
  },
  {
    id: 'culture-blackstone',
    entityId: 'company-blackstone',
    entityType: 'company',
    cultureDimensions: {
      powerDistance: 70, // Higher hierarchy
      individualismVsCollectivism: 55, // Balanced with slight individual focus
      uncertaintyAvoidance: 60, // Moderate structure
      longTermOrientation: 85, // Very long-term focused
      innovationVsStability: 75, // Innovation-oriented
      processVsResults: 25, // Strong results focus
      riskTolerance: 85, // High risk tolerance
      transparencyVsConfidentiality: 35, // Confidential culture
    },
    coreValues: [
      {
        id: 'val-comp-1',
        name: 'Excellence',
        description: 'Pursuit of the highest standards in everything we do',
        importance: 95,
        category: 'performance',
        evidencePoints: ['Industry-leading returns', 'Top talent recruitment', 'Client satisfaction']
      },
      {
        id: 'val-comp-2',
        name: 'Entrepreneurship',
        description: 'Thinking like owners and taking calculated risks for superior returns',
        importance: 90,
        category: 'innovation',
        evidencePoints: ['New fund launches', 'Market entry strategies', 'Innovation investments']
      }
    ],
    workingPrinciples: [
      {
        id: 'wp-comp-1',
        principle: 'Client First',
        description: 'Always prioritize client interests and long-term relationships',
        frequency: 90,
        criticality: 95
      }
    ],
    communicationStyle: {
      directness: 85,
      formality: 75,
      frequency: 70,
      channels: [
        { type: 'email', usage: 85, effectiveness: 80 },
        { type: 'meetings', usage: 80, effectiveness: 90 }
      ],
      feedbackStyle: 'scheduled'
    },
    decisionMaking: {
      centralization: 60,
      speed: 80,
      dataOrientation: 85,
      consensusBuilding: 50,
      riskAssessment: 'comprehensive'
    },
    conflictResolution: {
      approach: 'competition',
      escalationSpeed: 50,
      mediationPreference: 'hierarchical',
      resolutionFocus: 'task'
    },
    workEnvironment: {
      physicalSpace: {
        type: 'hybrid',
        openness: 40,
        interaction: 60,
        flexibility: 60
      },
      workSchedule: {
        flexibility: 60,
        intensity: 90,
        workLifeBalance: 50,
        overtimeExpectation: 'regular'
      },
      autonomy: 70,
      collaboration: 65,
      formalityLevel: 75
    },
    leadershipStyle: {
      approach: 'transformational',
      accessibility: 70,
      supportiveness: 75,
      visionCommunication: 90,
      empowerment: 75
    },
    performanceOrientation: {
      meritocracy: 95,
      goalClarity: 90,
      feedbackFrequency: 75,
      recognitionStyle: 'mixed',
      improvementFocus: 'strengths'
    },
    assessmentDate: new Date('2024-09-10'),
    assessmentMethod: 'survey',
    confidenceLevel: 90,
    lastUpdated: new Date('2024-09-10')
  }
];

export const mockCompatibilityAssessment = calculateCultureCompatibility(
  mockCultureProfiles[0], // GS QIS team
  mockCultureProfiles[1]  // Blackstone
);
export interface TeamDiscoveryProfile {
  id: string;
  companyId: string;
  companyName: string;
  teamName: string;
  department: string;
  size: number;
  members: TeamMember[];
  
  // Performance Intelligence
  performanceMetrics: PerformanceMetrics;
  marketPosition: MarketPosition;
  recentAchievements: Achievement[];
  
  // Market Intelligence
  vulnerabilityScore: number; // 0-100, likelihood of being open to liftout
  competitiveValue: number; // 0-100, strategic value to competitors
  marketDemand: number; // 0-100, demand for this team's skills
  
  // Discovery Signals
  signals: DiscoverySignal[];
  lastUpdated: Date;
  confidenceLevel: number; // 0-100, reliability of intelligence
  
  // Liftout Intelligence
  estimatedLiftoutCost: number;
  estimatedTimeToLiftout: number; // days
  keyInfluencers: string[]; // team member IDs who drive decision-making
  retentionRisks: RetentionRisk[];
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  seniority: 'junior' | 'mid' | 'senior' | 'principal' | 'executive';
  tenure: number; // years at company
  teamTenure: number; // years with this specific team
  
  // Individual Intelligence
  linkedinActivity: LinkedInActivity;
  publicVisibility: number; // 0-100, how visible they are in market
  individualValue: number; // 0-100, individual market value
  influenceLevel: number; // 0-100, influence within team
}

export interface PerformanceMetrics {
  revenueImpact: number; // annual revenue attributed to team
  profitMargin: number; // team's profit contribution
  clientSatisfaction: number; // 0-100
  deliverySuccess: number; // 0-100, on-time delivery rate
  innovationIndex: number; // 0-100, new initiatives/patents
  
  // Comparative metrics
  industryPercentile: number; // 0-100, vs industry peers
  companyPercentile: number; // 0-100, vs other teams in company
  trendDirection: 'improving' | 'stable' | 'declining';
}

export interface MarketPosition {
  industry: string;
  subSector: string;
  geographicMarkets: string[];
  clientTypes: string[];
  
  // Competitive intelligence
  competitorTeams: CompetitorTeam[];
  marketShare: number; // 0-100, in their niche
  differentiators: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  impact: 'high' | 'medium' | 'low';
  visibility: 'public' | 'industry' | 'internal';
  revenueImpact?: number;
}

export interface DiscoverySignal {
  id: string;
  type: DiscoverySignalType;
  strength: number; // 0-100, signal strength
  source: string;
  date: Date;
  description: string;
  reliability: number; // 0-100, source reliability
}

export type DiscoverySignalType = 
  | 'leadership_change' // new boss, reorganization
  | 'compensation_lag' // below market rates
  | 'project_cancellation' // strategic initiatives killed
  | 'budget_cuts' // resource constraints
  | 'talent_exodus' // colleagues leaving
  | 'merger_uncertainty' // company being acquired
  | 'cultural_misalignment' // values conflicts
  | 'growth_constraints' // limited advancement
  | 'technology_debt' // outdated tools/processes
  | 'market_disruption' // industry headwinds
  | 'linkedin_activity' // increased networking
  | 'conference_speaking' // raising profile
  | 'recruiter_outreach' // being actively recruited
  | 'skill_development' // learning new capabilities
  | 'geographic_preferences'; // wanting to relocate

export interface LinkedInActivity {
  lastActive: Date;
  postFrequency: number; // posts per month
  networkGrowth: number; // connections added per month
  engagementRate: number; // likes/comments ratio
  jobSearchSignals: number; // 0-100, likelihood actively searching
  industryInfluence: number; // 0-100, thought leadership
}

export interface RetentionRisk {
  memberId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  timeline: string; // estimated time until departure
  impact: string; // impact on team if they leave
  mitigationStrategies: string[];
}

export interface CompetitorTeam {
  companyName: string;
  teamName: string;
  size: number;
  performanceComparison: 'weaker' | 'similar' | 'stronger';
  recentMoves: string[]; // recent hires/departures
}

export interface DiscoveryTarget {
  id: string;
  targetCompany: string;
  targetTeam: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  strategicRationale: string;
  
  // Intelligence Gathering
  intelligence: TeamDiscoveryProfile | null;
  surveillanceLevel: 'passive' | 'active' | 'intensive';
  lastIntelligenceUpdate: Date;
  
  // Approach Planning
  approachStrategy: ApproachStrategy | null;
  bestApproachWindow: Date | null;
  keyContacts: string[];
  
  // Progress Tracking
  status: 'researching' | 'monitoring' | 'engaging' | 'negotiating' | 'closed';
  nextAction: string;
  assignedAnalyst: string;
}

export interface ApproachStrategy {
  method: 'direct' | 'network' | 'conference' | 'headhunter' | 'competitive_intel';
  keyMessage: string;
  valueProposition: string[];
  timing: 'immediate' | 'next_quarter' | 'when_signals_improve';
  riskAssessment: string;
  contingencyPlans: string[];
}

export interface MarketIntelligence {
  id: string;
  industry: string;
  sector: string;
  
  // Market Trends
  talentSupply: number; // 0-100, availability of talent
  talentDemand: number; // 0-100, competition for talent
  salaryTrends: 'increasing' | 'stable' | 'decreasing';
  averageCompensation: number;
  
  // Liftout Activity
  recentLiftouts: RecentLiftout[];
  liftoutFrequency: number; // per quarter
  averageLiftoutSize: number;
  successRate: number; // 0-100
  
  // Strategic Intelligence
  disruptiveTrends: string[];
  emergingOpportunities: string[];
  threatAssessment: string[];
}

export interface RecentLiftout {
  fromCompany: string;
  toCompany: string;
  teamSize: number;
  estimatedValue: number;
  date: Date;
  publicVisibility: boolean;
  industryImpact: string;
}

// Discovery Algorithm Functions

export function calculateVulnerabilityScore(signals: DiscoverySignal[]): number {
  const weights = {
    leadership_change: 15,
    compensation_lag: 20,
    project_cancellation: 10,
    budget_cuts: 15,
    talent_exodus: 25,
    merger_uncertainty: 20,
    cultural_misalignment: 12,
    growth_constraints: 18,
    technology_debt: 8,
    market_disruption: 10,
    linkedin_activity: 5,
    conference_speaking: 3,
    recruiter_outreach: 15,
    skill_development: 5,
    geographic_preferences: 7,
  };

  let totalScore = 0;
  let maxPossibleScore = 0;

  signals.forEach(signal => {
    const weight = weights[signal.type] || 5;
    const weightedScore = (signal.strength / 100) * weight * (signal.reliability / 100);
    totalScore += weightedScore;
    maxPossibleScore += weight;
  });

  return maxPossibleScore > 0 ? Math.min(100, (totalScore / maxPossibleScore) * 100) : 0;
}

export function calculateCompetitiveValue(team: TeamDiscoveryProfile): number {
  const factors = {
    performance: team.performanceMetrics.industryPercentile * 0.3,
    marketPosition: team.marketPosition.marketShare * 0.2,
    innovation: team.performanceMetrics.innovationIndex * 0.2,
    revenueImpact: Math.min(100, (team.performanceMetrics.revenueImpact / 10000000) * 100) * 0.15, // $10M = 100%
    teamCohesion: calculateTeamCohesion(team.members) * 0.15,
  };

  return Object.values(factors).reduce((sum, value) => sum + value, 0);
}

export function calculateTeamCohesion(members: TeamMember[]): number {
  const avgTeamTenure = members.reduce((sum, m) => sum + m.teamTenure, 0) / members.length;
  const tenureScore = Math.min(100, (avgTeamTenure / 5) * 100); // 5 years = perfect score
  
  const seniorityDistribution = calculateSeniorityBalance(members);
  const balanceScore = seniorityDistribution * 100;
  
  return (tenureScore * 0.6) + (balanceScore * 0.4);
}

function calculateSeniorityBalance(members: TeamMember[]): number {
  const seniorityLevels = members.reduce((counts, member) => {
    counts[member.seniority] = (counts[member.seniority] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Ideal distribution: some seniors, some mids, fewer juniors/principals/executives
  const idealRatios = {
    junior: 0.2,
    mid: 0.3,
    senior: 0.3,
    principal: 0.15,
    executive: 0.05,
  };

  let balanceScore = 0;
  Object.entries(idealRatios).forEach(([level, idealRatio]) => {
    const actualRatio = (seniorityLevels[level] || 0) / members.length;
    const difference = Math.abs(idealRatio - actualRatio);
    balanceScore += (1 - difference);
  });

  return balanceScore / Object.keys(idealRatios).length;
}

export function prioritizeDiscoveryTargets(targets: DiscoveryTarget[]): DiscoveryTarget[] {
  return targets.sort((a, b) => {
    const scoreA = calculateTargetPriority(a);
    const scoreB = calculateTargetPriority(b);
    return scoreB - scoreA;
  });
}

function calculateTargetPriority(target: DiscoveryTarget): number {
  if (!target.intelligence) return 0;

  const factors = {
    competitiveValue: target.intelligence.competitiveValue * 0.3,
    vulnerability: target.intelligence.vulnerabilityScore * 0.25,
    marketDemand: target.intelligence.marketDemand * 0.2,
    confidence: target.intelligence.confidenceLevel * 0.15,
    strategicFit: getPriorityScore(target.priority) * 0.1,
  };

  return Object.values(factors).reduce((sum, value) => sum + value, 0);
}

function getPriorityScore(priority: string): number {
  const scores = { critical: 100, high: 75, medium: 50, low: 25 };
  return scores[priority as keyof typeof scores] || 0;
}

export function generateApproachStrategy(target: DiscoveryTarget): ApproachStrategy {
  if (!target.intelligence) {
    throw new Error('Cannot generate approach strategy without intelligence data');
  }

  const vulnerability = target.intelligence.vulnerabilityScore;
  const competitiveValue = target.intelligence.competitiveValue;
  const signals = target.intelligence.signals;

  // Determine approach method based on vulnerability and signals
  let method: ApproachStrategy['method'] = 'direct';
  if (vulnerability < 30) method = 'network';
  if (vulnerability > 70) method = 'direct';
  if (signals.some(s => s.type === 'recruiter_outreach')) method = 'headhunter';

  // Determine timing
  let timing: ApproachStrategy['timing'] = 'next_quarter';
  if (vulnerability > 80) timing = 'immediate';
  if (vulnerability < 40) timing = 'when_signals_improve';

  return {
    method,
    timing,
    keyMessage: generateKeyMessage(target.intelligence),
    valueProposition: generateValueProposition(target.intelligence),
    riskAssessment: generateRiskAssessment(target.intelligence),
    contingencyPlans: generateContingencyPlans(target.intelligence),
  };
}

function generateKeyMessage(intelligence: TeamDiscoveryProfile): string {
  const topSignals = intelligence.signals
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 2);

  if (topSignals.some(s => s.type === 'leadership_change')) {
    return 'Strategic partnership opportunity during organizational transition';
  }
  if (topSignals.some(s => s.type === 'growth_constraints')) {
    return 'Unlock your team\'s full potential with expanded resources and market access';
  }
  if (topSignals.some(s => s.type === 'compensation_lag')) {
    return 'Recognition and rewards that match your exceptional performance';
  }
  
  return 'Exclusive opportunity for a high-performing team to drive market-leading innovation';
}

function generateValueProposition(intelligence: TeamDiscoveryProfile): string[] {
  const props = [];
  
  if (intelligence.performanceMetrics.industryPercentile > 80) {
    props.push('Join industry leaders who recognize and reward top-tier performance');
  }
  
  if (intelligence.vulnerabilityScore > 60) {
    props.push('Expanded resources, budget, and strategic support for your initiatives');
  }
  
  props.push('Preserve team dynamics while accessing new markets and opportunities');
  props.push('Competitive compensation reflecting your proven value and market position');
  props.push('Strategic autonomy with executive-level support and vision alignment');
  
  return props;
}

function generateRiskAssessment(intelligence: TeamDiscoveryProfile): string {
  const risks = [];
  
  if (intelligence.vulnerabilityScore < 40) {
    risks.push('Low vulnerability - team may be satisfied with current situation');
  }
  
  if (intelligence.retentionRisks.some(r => r.riskLevel === 'critical')) {
    risks.push('Internal retention risks - some members may not move together');
  }
  
  if (intelligence.competitiveValue > 80) {
    risks.push('High value target - likely competitive bidding from other firms');
  }
  
  return risks.join('; ') || 'Moderate risk - standard liftout considerations apply';
}

function generateContingencyPlans(intelligence: TeamDiscoveryProfile): string[] {
  const plans = [];
  
  plans.push('Flexible start dates to accommodate transition planning');
  plans.push('Individual negotiations if full team liftout not feasible');
  plans.push('Partial team acquisition with key influencers first');
  plans.push('Extended courtship period with cultural integration previews');
  
  if (intelligence.estimatedLiftoutCost > 5000000) {
    plans.push('Phased compensation with performance milestones');
  }
  
  return plans;
}

// Mock data for development
export const mockDiscoveryTargets: DiscoveryTarget[] = [
  {
    id: '1',
    targetCompany: 'Goldman Sachs',
    targetTeam: 'Quantitative Investment Strategies',
    priority: 'critical',
    strategicRationale: 'Accelerate our systematic trading capabilities and expand into institutional markets',
    intelligence: {
      id: 'intel-1',
      companyId: 'gs-1',
      companyName: 'Goldman Sachs',
      teamName: 'Quantitative Investment Strategies',
      department: 'Global Markets Division',
      size: 12,
      members: [],
      performanceMetrics: {
        revenueImpact: 240000000,
        profitMargin: 78,
        clientSatisfaction: 92,
        deliverySuccess: 94,
        innovationIndex: 88,
        industryPercentile: 95,
        companyPercentile: 89,
        trendDirection: 'improving',
      },
      marketPosition: {
        industry: 'Financial Services',
        subSector: 'Systematic Trading',
        geographicMarkets: ['North America', 'Europe', 'Asia-Pacific'],
        clientTypes: ['Institutional Investors', 'Sovereign Wealth Funds', 'Pension Funds'],
        competitorTeams: [],
        marketShare: 15,
        differentiators: ['Machine Learning Alpha Generation', 'Multi-Asset Execution', 'Risk-Adjusted Returns'],
      },
      recentAchievements: [
        {
          id: 'ach-1',
          title: 'Best Quantitative Strategy Award 2024',
          description: 'Industry recognition for innovative ML-driven investment approach',
          date: new Date('2024-03-15'),
          impact: 'high',
          visibility: 'public',
          revenueImpact: 50000000,
        },
      ],
      vulnerabilityScore: 68,
      competitiveValue: 92,
      marketDemand: 95,
      signals: [
        {
          id: 'sig-1',
          type: 'leadership_change',
          strength: 75,
          source: 'Industry Intelligence',
          date: new Date('2024-08-20'),
          description: 'New division head implementing cost reduction initiatives',
          reliability: 85,
        },
        {
          id: 'sig-2',
          type: 'compensation_lag',
          strength: 60,
          source: 'Market Analysis',
          date: new Date('2024-09-01'),
          description: 'Compensation 15% below market for similar roles',
          reliability: 90,
        },
      ],
      lastUpdated: new Date(),
      confidenceLevel: 87,
      estimatedLiftoutCost: 8500000,
      estimatedTimeToLiftout: 120,
      keyInfluencers: ['michael-chen', 'sarah-rodriguez'],
      retentionRisks: [
        {
          memberId: 'michael-chen',
          riskLevel: 'medium',
          factors: ['compensation_gap', 'limited_advancement'],
          timeline: '6-12 months',
          impact: 'Team lead - critical for strategy execution',
          mitigationStrategies: ['competitive_package', 'leadership_role'],
        },
      ],
    },
    surveillanceLevel: 'active',
    lastIntelligenceUpdate: new Date(),
    approachStrategy: null,
    bestApproachWindow: new Date('2024-11-15'),
    keyContacts: ['michael-chen', 'sarah-rodriguez'],
    status: 'monitoring',
    nextAction: 'Schedule conference introduction with team lead',
    assignedAnalyst: 'Emma Thompson',
  },
  {
    id: '2',
    targetCompany: 'McKinsey & Company',
    targetTeam: 'Healthcare Innovation Practice',
    priority: 'high',
    strategicRationale: 'Establish dominant position in healthcare consulting and digital transformation',
    intelligence: {
      id: 'intel-2',
      companyId: 'mckinsey-1',
      companyName: 'McKinsey & Company',
      teamName: 'Healthcare Innovation Practice',
      department: 'Healthcare Systems & Services',
      size: 8,
      members: [],
      performanceMetrics: {
        revenueImpact: 120000000,
        profitMargin: 85,
        clientSatisfaction: 94,
        deliverySuccess: 97,
        innovationIndex: 91,
        industryPercentile: 92,
        companyPercentile: 88,
        trendDirection: 'stable',
      },
      marketPosition: {
        industry: 'Management Consulting',
        subSector: 'Healthcare Digital Transformation',
        geographicMarkets: ['North America', 'Europe'],
        clientTypes: ['Health Systems', 'Pharma Companies', 'MedTech Firms'],
        competitorTeams: [],
        marketShare: 22,
        differentiators: ['AI-Powered Diagnostics', 'Digital Health Strategy', 'Regulatory Navigation'],
      },
      recentAchievements: [
        {
          id: 'ach-2',
          title: 'Digital Health Innovation Award',
          description: 'Led breakthrough telemedicine implementation for major health system',
          date: new Date('2024-06-10'),
          impact: 'high',
          visibility: 'industry',
          revenueImpact: 25000000,
        },
      ],
      vulnerabilityScore: 45,
      competitiveValue: 89,
      marketDemand: 93,
      signals: [
        {
          id: 'sig-3',
          type: 'growth_constraints',
          strength: 55,
          source: 'Network Intelligence',
          date: new Date('2024-09-05'),
          description: 'Limited partner track expansion despite strong performance',
          reliability: 80,
        },
      ],
      lastUpdated: new Date(),
      confidenceLevel: 82,
      estimatedLiftoutCost: 6200000,
      estimatedTimeToLiftout: 180,
      keyInfluencers: ['alex-kumar', 'jennifer-white'],
      retentionRisks: [],
    },
    surveillanceLevel: 'passive',
    lastIntelligenceUpdate: new Date(),
    approachStrategy: null,
    bestApproachWindow: new Date('2024-12-01'),
    keyContacts: ['alex-kumar', 'jennifer-white'],
    status: 'researching',
    nextAction: 'Deep dive competitive analysis on healthcare consulting market',
    assignedAnalyst: 'David Park',
  },
];
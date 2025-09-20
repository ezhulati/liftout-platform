export interface MarketIntelligence {
  id: string;
  industry: string;
  sector: string;
  geography: string;
  
  // Market dynamics
  marketHealth: MarketHealth;
  competitiveIntensity: number; // 0-100
  talentSupplyDemand: SupplyDemandAnalysis;
  
  // Industry trends
  trends: MarketTrend[];
  disruptors: MarketDisruptor[];
  opportunities: MarketOpportunity[];
  threats: MarketThreat[];
  
  // Competitive landscape
  competitorAnalysis: CompetitorProfile[];
  marketShare: MarketShareData[];
  positioningMap: PositioningData;
  
  // Intelligence metadata
  lastUpdated: Date;
  dataQuality: number; // 0-100
  sources: IntelligenceSource[];
  analyst: string;
}

export interface MarketHealth {
  overallScore: number; // 0-100
  growthRate: number; // percentage
  volatility: number; // 0-100
  maturity: 'emerging' | 'growth' | 'mature' | 'declining';
  
  // Key indicators
  indicators: HealthIndicator[];
  outlook: 'positive' | 'neutral' | 'negative';
  timeframe: '6_months' | '12_months' | '24_months';
}

export interface HealthIndicator {
  name: string;
  value: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  importance: 'high' | 'medium' | 'low';
  description: string;
}

export interface SupplyDemandAnalysis {
  talentSupply: number; // 0-100 (0 = severe shortage, 100 = oversupply)
  talentDemand: number; // 0-100 (0 = no demand, 100 = extreme demand)
  equilibrium: 'shortage' | 'balanced' | 'surplus';
  
  // Segmented analysis
  byExperience: { level: string; supply: number; demand: number }[];
  bySkillSet: { skill: string; supply: number; demand: number }[];
  byGeography: { location: string; supply: number; demand: number }[];
  
  // Predictive indicators
  supplyTrend: 'increasing' | 'stable' | 'decreasing';
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  futureOutlook: string;
}

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  category: TrendCategory;
  
  // Trend characteristics
  strength: number; // 0-100
  velocity: 'slow' | 'moderate' | 'fast' | 'accelerating';
  direction: 'positive' | 'negative' | 'neutral';
  maturity: 'emerging' | 'developing' | 'mainstream' | 'declining';
  
  // Impact assessment
  impactAreas: string[];
  businessImplications: string[];
  talentImplications: string[];
  
  // Timeline
  timeHorizon: '3_months' | '6_months' | '12_months' | '24_months' | '5_years';
  confidence: number; // 0-100
  
  // Supporting data
  evidence: string[];
  sources: string[];
}

export type TrendCategory = 
  | 'technology'
  | 'regulation'
  | 'demographics'
  | 'economics'
  | 'geopolitics'
  | 'social'
  | 'environmental'
  | 'industry_specific';

export interface MarketDisruptor {
  id: string;
  name: string;
  description: string;
  type: 'technology' | 'business_model' | 'regulation' | 'economic' | 'social';
  
  // Disruption characteristics
  disruptionPotential: number; // 0-100
  timeToImpact: number; // months
  affectedSegments: string[];
  
  // Strategic implications
  threats: string[];
  opportunities: string[];
  strategicResponse: string[];
  
  // Monitoring indicators
  keyMetrics: string[];
  currentStatus: 'early_stage' | 'developing' | 'accelerating' | 'mainstream';
}

export interface MarketOpportunity {
  id: string;
  name: string;
  description: string;
  category: 'market_expansion' | 'capability_building' | 'competitive_advantage' | 'cost_reduction';
  
  // Opportunity sizing
  marketSize: number; // potential value
  accessibilityScore: number; // 0-100 (how easy to capture)
  timeToValue: number; // months
  investmentRequired: number;
  
  // Strategic fit
  strategicAlignment: number; // 0-100
  competitiveAdvantage: string[];
  riskFactors: string[];
  
  // Action plan
  nextSteps: string[];
  timeline: string;
  successMetrics: string[];
}

export interface MarketThreat {
  id: string;
  name: string;
  description: string;
  category: 'competitive' | 'regulatory' | 'technological' | 'economic' | 'reputational';
  
  // Threat assessment
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  
  // Impact analysis
  potentialImpact: string[];
  affectedAreas: string[];
  vulnerabilities: string[];
  
  // Mitigation
  mitigationStrategies: string[];
  contingencyPlans: string[];
  earlyWarningSignals: string[];
}

export interface CompetitorProfile {
  id: string;
  name: string;
  type: 'direct' | 'indirect' | 'potential' | 'disruptor';
  
  // Company overview
  size: 'startup' | 'mid_market' | 'enterprise' | 'global';
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  geography: string[];
  
  // Competitive positioning
  strengths: string[];
  weaknesses: string[];
  marketShare: number; // percentage
  growthRate: number; // percentage
  
  // Liftout activity
  liftoutActivity: LiftoutActivity;
  targetSegments: string[];
  competitiveThreats: string[];
  
  // Strategic intelligence
  recentMoves: CompetitorMove[];
  strategicDirection: string;
  vulnerabilities: string[];
  opportunities: string[];
}

export interface LiftoutActivity {
  frequency: 'low' | 'moderate' | 'high' | 'aggressive';
  recentCount: number; // last 12 months
  averageTeamSize: number;
  targetIndustries: string[];
  averageCompensation: number;
  successRate: number; // 0-100
  
  // Activity patterns
  seasonality: string;
  focusAreas: string[];
  competitiveAdvantages: string[];
}

export interface CompetitorMove {
  id: string;
  date: Date;
  type: 'liftout' | 'acquisition' | 'partnership' | 'investment' | 'market_entry' | 'product_launch';
  description: string;
  significance: 'low' | 'medium' | 'high' | 'strategic';
  implications: string[];
  response: string;
}

export interface MarketShareData {
  competitor: string;
  marketShare: number; // percentage
  change: number; // percentage change
  trend: 'gaining' | 'stable' | 'losing';
  segments: { segment: string; share: number }[];
}

export interface PositioningData {
  dimensions: PositioningDimension[];
  quadrants: PositioningQuadrant[];
  competitorPositions: CompetitorPosition[];
  whitespace: WhitespaceOpportunity[];
}

export interface PositioningDimension {
  name: string;
  description: string;
  lowLabel: string;
  highLabel: string;
}

export interface PositioningQuadrant {
  name: string;
  description: string;
  characteristics: string[];
  competitors: string[];
  attractiveness: number; // 0-100
}

export interface CompetitorPosition {
  competitor: string;
  xAxis: number; // 0-100
  yAxis: number; // 0-100
  size: number; // market share or revenue
  trend: 'moving_up' | 'moving_down' | 'moving_left' | 'moving_right' | 'stable';
}

export interface WhitespaceOpportunity {
  id: string;
  description: string;
  xRange: [number, number];
  yRange: [number, number];
  opportunity: string;
  accessibilityScore: number; // 0-100
  marketPotential: number;
}

export interface IntelligenceSource {
  type: 'public_filings' | 'industry_reports' | 'news_media' | 'social_signals' | 'network_intel' | 'primary_research';
  name: string;
  reliability: number; // 0-100
  recency: Date;
  coverage: string[];
}

export interface StrategicImplication {
  id: string;
  category: 'opportunity' | 'threat' | 'trend' | 'competitive_move';
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Strategic analysis
  implications: string[];
  recommendations: string[];
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  
  // Action planning
  nextSteps: string[];
  resources: string[];
  successMetrics: string[];
  responsibleParty: string;
}

export interface MarketAlert {
  id: string;
  type: 'competitor_move' | 'market_shift' | 'regulatory_change' | 'disruption' | 'opportunity';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  
  // Alert details
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  
  // Impact assessment
  affectedAreas: string[];
  potentialImpact: string;
  recommendedActions: string[];
  
  // Status tracking
  status: 'new' | 'acknowledged' | 'investigating' | 'responded' | 'resolved';
  assignedTo: string;
  dueDate: Date;
}

// Market intelligence algorithms

export function calculateMarketAttractiveness(
  marketHealth: MarketHealth,
  supplyDemand: SupplyDemandAnalysis,
  competitive: CompetitorProfile[]
): number {
  const healthScore = marketHealth.overallScore;
  const demandScore = supplyDemand.talentDemand;
  const supplyScore = 100 - supplyDemand.talentSupply; // Lower supply = higher attractiveness
  const competitiveScore = 100 - calculateCompetitiveIntensity(competitive);
  
  return (healthScore * 0.3 + demandScore * 0.25 + supplyScore * 0.25 + competitiveScore * 0.2);
}

export function calculateCompetitiveIntensity(competitors: CompetitorProfile[]): number {
  if (competitors.length === 0) return 0;
  
  const directCompetitors = competitors.filter(c => c.type === 'direct');
  const aggressivePlayers = competitors.filter(c => c.liftoutActivity.frequency === 'aggressive').length;
  const marketLeaders = competitors.filter(c => c.marketPosition === 'leader').length;
  
  // Intensity factors
  const competitorCount = Math.min(directCompetitors.length / 10, 1) * 30; // Up to 30 points
  const aggressiveness = (aggressivePlayers / competitors.length) * 40; // Up to 40 points
  const leadershipConcentration = (marketLeaders / competitors.length) * 30; // Up to 30 points
  
  return competitorCount + aggressiveness + leadershipConcentration;
}

export function identifyStrategicOpportunities(
  trends: MarketTrend[],
  competitors: CompetitorProfile[],
  positioning: PositioningData
): MarketOpportunity[] {
  const opportunities: MarketOpportunity[] = [];
  
  // Trend-based opportunities
  const emergingTrends = trends.filter(t => 
    t.maturity === 'emerging' && 
    t.strength > 70 && 
    t.direction === 'positive'
  );
  
  emergingTrends.forEach(trend => {
    opportunities.push({
      id: `trend-opp-${trend.id}`,
      name: `Capitalize on ${trend.name}`,
      description: `Leverage emerging trend in ${trend.name} to gain competitive advantage`,
      category: 'competitive_advantage',
      marketSize: 50000000, // Estimated market size
      accessibilityScore: 100 - trend.strength, // Easier when trend is less mature
      timeToValue: 12,
      investmentRequired: 2000000,
      strategicAlignment: 85,
      competitiveAdvantage: trend.businessImplications,
      riskFactors: ['Trend may not materialize', 'Competitive response'],
      nextSteps: ['Assess internal capabilities', 'Develop implementation plan'],
      timeline: '12-18 months',
      successMetrics: ['Market share growth', 'Revenue from trend-related services']
    });
  });
  
  // Whitespace opportunities
  positioning.whitespace.forEach(space => {
    if (space.accessibilityScore > 70) {
      opportunities.push({
        id: `whitespace-${space.id}`,
        name: space.description,
        description: `Enter underserved market segment: ${space.opportunity}`,
        category: 'market_expansion',
        marketSize: space.marketPotential,
        accessibilityScore: space.accessibilityScore,
        timeToValue: 18,
        investmentRequired: 5000000,
        strategicAlignment: 75,
        competitiveAdvantage: ['First mover advantage', 'Uncontested market space'],
        riskFactors: ['Market may be small', 'Difficult to defend position'],
        nextSteps: ['Market sizing study', 'Pilot program'],
        timeline: '18-24 months',
        successMetrics: ['Market penetration', 'Customer acquisition']
      });
    }
  });
  
  return opportunities;
}

export function assessCompetitiveThreat(
  competitor: CompetitorProfile,
  ourPosition: CompetitorPosition
): MarketThreat {
  const threatLevel = calculateThreatSeverity(competitor, ourPosition);
  
  return {
    id: `threat-${competitor.id}`,
    name: `Competitive threat from ${competitor.name}`,
    description: `${competitor.name} poses ${threatLevel} competitive threat based on recent activity and positioning`,
    category: 'competitive',
    severity: threatLevel,
    probability: calculateThreatProbability(competitor),
    timeframe: determineTimeframe(competitor.liftoutActivity.frequency),
    potentialImpact: [
      'Loss of market share',
      'Talent acquisition challenges',
      'Pricing pressure',
      'Client defection'
    ],
    affectedAreas: ['Talent acquisition', 'Client relationships', 'Market position'],
    vulnerabilities: competitor.strengths,
    mitigationStrategies: [
      'Enhance talent retention programs',
      'Accelerate liftout activities in key segments',
      'Strengthen client relationships',
      'Develop counter-positioning strategy'
    ],
    contingencyPlans: [
      'Rapid response team for competitive threats',
      'Pre-negotiated liftout opportunities',
      'Crisis communication plan'
    ],
    earlyWarningSignals: [
      'Increased liftout activity',
      'Aggressive hiring campaigns',
      'Client approach attempts',
      'Pricing changes'
    ]
  };
}

function calculateThreatSeverity(
  competitor: CompetitorProfile,
  ourPosition: CompetitorPosition
): 'low' | 'medium' | 'high' | 'critical' {
  let severity = 0;
  
  // Market position threat
  if (competitor.marketPosition === 'leader') severity += 30;
  else if (competitor.marketPosition === 'challenger') severity += 20;
  
  // Liftout activity threat
  if (competitor.liftoutActivity.frequency === 'aggressive') severity += 40;
  else if (competitor.liftoutActivity.frequency === 'high') severity += 25;
  
  // Growth threat
  if (competitor.growthRate > 20) severity += 20;
  else if (competitor.growthRate > 10) severity += 10;
  
  // Positioning threat (how close they are to us)
  const distance = Math.sqrt(
    Math.pow(competitor.strengths.length - ourPosition.xAxis, 2) +
    Math.pow(competitor.weaknesses.length - ourPosition.yAxis, 2)
  );
  if (distance < 20) severity += 10;
  
  if (severity >= 70) return 'critical';
  if (severity >= 50) return 'high';
  if (severity >= 30) return 'medium';
  return 'low';
}

function calculateThreatProbability(competitor: CompetitorProfile): number {
  let probability = 50; // Base probability
  
  // Adjust based on recent activity
  probability += competitor.recentMoves.filter(m => m.significance === 'strategic').length * 10;
  
  // Adjust based on liftout activity
  if (competitor.liftoutActivity.frequency === 'aggressive') probability += 30;
  else if (competitor.liftoutActivity.frequency === 'high') probability += 20;
  
  // Adjust based on growth rate
  if (competitor.growthRate > 20) probability += 15;
  
  return Math.min(100, Math.max(0, probability));
}

function determineTimeframe(frequency: string): 'immediate' | 'short_term' | 'medium_term' | 'long_term' {
  switch (frequency) {
    case 'aggressive': return 'immediate';
    case 'high': return 'short_term';
    case 'moderate': return 'medium_term';
    default: return 'long_term';
  }
}

export function generateMarketAlerts(
  trends: MarketTrend[],
  competitors: CompetitorProfile[],
  threats: MarketThreat[]
): MarketAlert[] {
  const alerts: MarketAlert[] = [];
  
  // Trend alerts
  trends.forEach(trend => {
    if (trend.strength > 80 && trend.maturity === 'emerging') {
      alerts.push({
        id: `alert-trend-${trend.id}`,
        type: 'market_shift',
        severity: 'high',
        title: `Emerging trend: ${trend.name}`,
        description: `High-strength emerging trend detected: ${trend.description}`,
        source: 'Trend Analysis Engine',
        timestamp: new Date(),
        affectedAreas: trend.impactAreas,
        potentialImpact: trend.businessImplications.join('; '),
        recommendedActions: [
          'Assess strategic implications',
          'Evaluate investment requirements',
          'Develop response strategy'
        ],
        status: 'new',
        assignedTo: 'Strategy Team',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
    }
  });
  
  // Competitive alerts
  competitors.forEach(competitor => {
    const recentStrategicMoves = competitor.recentMoves.filter(
      m => m.significance === 'strategic' && 
      m.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    );
    
    if (recentStrategicMoves.length > 0) {
      alerts.push({
        id: `alert-competitor-${competitor.id}`,
        type: 'competitor_move',
        severity: 'medium',
        title: `Competitive activity: ${competitor.name}`,
        description: `${competitor.name} has made ${recentStrategicMoves.length} strategic moves in the last 30 days`,
        source: 'Competitive Intelligence',
        timestamp: new Date(),
        affectedAreas: ['Market position', 'Talent acquisition'],
        potentialImpact: 'Increased competitive pressure and talent competition',
        recommendedActions: [
          'Analyze competitor moves',
          'Assess impact on our strategy',
          'Consider counter-measures'
        ],
        status: 'new',
        assignedTo: 'Competitive Intelligence Team',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
      });
    }
  });
  
  return alerts;
}

// Mock data for development
export const mockMarketIntelligence: MarketIntelligence = {
  id: 'market-fintech-us',
  industry: 'Financial Technology',
  sector: 'Alternative Investment Management',
  geography: 'United States',
  marketHealth: {
    overallScore: 78,
    growthRate: 15.3,
    volatility: 35,
    maturity: 'growth',
    indicators: [
      {
        name: 'AUM Growth',
        value: 23.5,
        trend: 'increasing',
        importance: 'high',
        description: 'Assets under management growing at 23.5% annually'
      },
      {
        name: 'New Fund Launches',
        value: 147,
        trend: 'increasing',
        importance: 'high',
        description: '147 new funds launched in the last 12 months'
      }
    ],
    outlook: 'positive',
    timeframe: '12_months'
  },
  competitiveIntensity: 72,
  talentSupplyDemand: {
    talentSupply: 25, // Severe shortage
    talentDemand: 90, // Very high demand
    equilibrium: 'shortage',
    byExperience: [
      { level: 'Senior (10+ years)', supply: 15, demand: 95 },
      { level: 'Mid-level (5-10 years)', supply: 30, demand: 85 },
      { level: 'Junior (0-5 years)', supply: 45, demand: 70 }
    ],
    bySkillSet: [
      { skill: 'Quantitative Analysis', supply: 20, demand: 95 },
      { skill: 'Risk Management', supply: 25, demand: 90 },
      { skill: 'Portfolio Management', supply: 30, demand: 85 }
    ],
    byGeography: [
      { location: 'New York', supply: 20, demand: 95 },
      { location: 'San Francisco', supply: 25, demand: 90 },
      { location: 'Chicago', supply: 35, demand: 75 }
    ],
    supplyTrend: 'stable',
    demandTrend: 'increasing',
    futureOutlook: 'Talent shortage expected to intensify as new funds continue launching'
  },
  trends: [
    {
      id: 'ai-quantitative',
      name: 'AI-Powered Quantitative Strategies',
      description: 'Integration of machine learning and AI into quantitative investment strategies',
      category: 'technology',
      strength: 85,
      velocity: 'accelerating',
      direction: 'positive',
      maturity: 'developing',
      impactAreas: ['Investment strategies', 'Risk management', 'Talent requirements'],
      businessImplications: [
        'Need for hybrid quant-AI teams',
        'Higher talent acquisition costs',
        'Competitive advantage for early adopters'
      ],
      talentImplications: [
        'Demand for ML/AI specialists',
        'Reskilling of traditional quants',
        'Premium for cross-functional expertise'
      ],
      timeHorizon: '12_months',
      confidence: 90,
      evidence: [
        'Major funds hiring AI specialists',
        'Academic research proliferation',
        'Regulatory guidance development'
      ],
      sources: ['Industry reports', 'Job posting analysis', 'Academic publications']
    }
  ],
  disruptors: [
    {
      id: 'crypto-defi',
      name: 'Decentralized Finance (DeFi)',
      description: 'Blockchain-based financial services disrupting traditional finance',
      type: 'technology',
      disruptionPotential: 75,
      timeToImpact: 24,
      affectedSegments: ['Trading', 'Lending', 'Asset Management'],
      threats: [
        'Disintermediation of traditional finance',
        'Regulatory uncertainty',
        'Talent migration to crypto'
      ],
      opportunities: [
        'New investment strategies',
        'Blockchain expertise premium',
        'Early mover advantage'
      ],
      strategicResponse: [
        'Develop DeFi capabilities',
        'Hire blockchain specialists',
        'Monitor regulatory developments'
      ],
      keyMetrics: ['DeFi TVL', 'Institutional adoption', 'Regulatory clarity'],
      currentStatus: 'developing'
    }
  ],
  opportunities: [],
  threats: [],
  competitorAnalysis: [
    {
      id: 'citadel',
      name: 'Citadel',
      type: 'direct',
      size: 'global',
      marketPosition: 'leader',
      geography: ['North America', 'Europe', 'Asia'],
      strengths: [
        'Technology infrastructure',
        'Compensation packages',
        'Brand recognition',
        'Global reach'
      ],
      weaknesses: [
        'High pressure culture',
        'Limited work-life balance',
        'High turnover in some divisions'
      ],
      marketShare: 15.2,
      growthRate: 18.5,
      liftoutActivity: {
        frequency: 'aggressive',
        recentCount: 8,
        averageTeamSize: 6,
        targetIndustries: ['Investment Banking', 'Hedge Funds', 'Tech'],
        averageCompensation: 350000,
        successRate: 85,
        seasonality: 'Year-end bonus season peak',
        focusAreas: ['Quantitative trading', 'Technology', 'Risk management'],
        competitiveAdvantages: ['Compensation', 'Technology platform', 'Career progression']
      },
      targetSegments: ['Quantitative analysts', 'Technology specialists', 'Risk managers'],
      competitiveThreats: [
        'Aggressive talent acquisition',
        'Technology platform competition',
        'Client poaching attempts'
      ],
      recentMoves: [
        {
          id: 'citadel-move-1',
          date: new Date('2024-09-01'),
          type: 'liftout',
          description: 'Acquired 8-person systematic trading team from Goldman Sachs',
          significance: 'strategic',
          implications: [
            'Strengthened systematic trading capabilities',
            'Increased pressure on Goldman talent retention',
            'Signal of continued aggressive expansion'
          ],
          response: 'Monitor for follow-on moves and defensive measures'
        }
      ],
      strategicDirection: 'Continued global expansion with focus on technology and systematic strategies',
      vulnerabilities: [
        'Cultural fit challenges with some acquired teams',
        'Regulatory scrutiny',
        'Dependence on key personnel'
      ],
      opportunities: [
        'Counter-recruit from their acquired teams',
        'Target talent frustrated with high-pressure culture',
        'Focus on work-life balance differentiation'
      ]
    }
  ],
  marketShare: [
    { competitor: 'Citadel', marketShare: 15.2, change: 2.3, trend: 'gaining', segments: [] },
    { competitor: 'Bridgewater', marketShare: 12.8, change: -0.5, trend: 'stable', segments: [] },
    { competitor: 'Renaissance Technologies', marketShare: 8.9, change: 1.1, trend: 'gaining', segments: [] },
    { competitor: 'Two Sigma', marketShare: 7.3, change: 0.8, trend: 'gaining', segments: [] },
    { competitor: 'Others', marketShare: 55.8, change: -3.7, trend: 'losing', segments: [] }
  ],
  positioningMap: {
    dimensions: [
      {
        name: 'Technology Focus',
        description: 'Level of technology integration and innovation',
        lowLabel: 'Traditional',
        highLabel: 'Tech-Native'
      },
      {
        name: 'Scale & Resources',
        description: 'Organizational scale and resource availability',
        lowLabel: 'Boutique',
        highLabel: 'Global Scale'
      }
    ],
    quadrants: [
      {
        name: 'Tech Giants',
        description: 'Large scale with high technology focus',
        characteristics: ['Advanced technology', 'Global reach', 'Deep resources'],
        competitors: ['Citadel', 'Two Sigma'],
        attractiveness: 85
      },
      {
        name: 'Traditional Powerhouses',
        description: 'Large scale with traditional approaches',
        characteristics: ['Established processes', 'Global presence', 'Conservative'],
        competitors: ['Bridgewater'],
        attractiveness: 65
      }
    ],
    competitorPositions: [
      { competitor: 'Citadel', xAxis: 90, yAxis: 95, size: 15.2, trend: 'moving_up' },
      { competitor: 'Two Sigma', xAxis: 95, yAxis: 75, size: 7.3, trend: 'moving_right' },
      { competitor: 'Bridgewater', xAxis: 40, yAxis: 90, size: 12.8, trend: 'stable' }
    ],
    whitespace: [
      {
        id: 'mid-tech-boutique',
        description: 'Mid-scale technology-focused boutiques',
        xRange: [60, 80],
        yRange: [30, 60],
        opportunity: 'Serve clients wanting tech innovation without mega-fund complexity',
        accessibilityScore: 75,
        marketPotential: 25000000
      }
    ]
  },
  lastUpdated: new Date(),
  dataQuality: 85,
  sources: [
    {
      type: 'industry_reports',
      name: 'Preqin Alternative Assets Report 2024',
      reliability: 90,
      recency: new Date('2024-09-01'),
      coverage: ['Market size', 'Growth rates', 'Competitor analysis']
    },
    {
      type: 'public_filings',
      name: 'SEC Form ADV filings',
      reliability: 95,
      recency: new Date('2024-08-15'),
      coverage: ['Assets under management', 'Fee structures', 'Investment strategies']
    }
  ],
  analyst: 'Sarah Chen, Senior Market Intelligence Analyst'
};
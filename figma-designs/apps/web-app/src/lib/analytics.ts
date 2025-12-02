export interface LiftoutAnalytics {
  id: string;
  companyId: string;
  reportingPeriod: {
    startDate: string;
    endDate: string;
    type: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  };
  generatedDate: string;
  platformMetrics: PlatformMetrics;
  businessOutcomes: BusinessOutcomes;
  performanceComparisons: PerformanceComparison[];
  industryBenchmarks: IndustryBenchmark[];
  costAnalysis: CostAnalysis;
  roiAnalysis: ROIAnalysis;
}

export interface PlatformMetrics {
  successfulLiftouts: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
    successRate: number; // percentage
    averageTimeToComplete: number; // days
  };
  
  matchQuality: {
    averageScore: number; // 1-100
    distribution: ScoreDistribution[];
    topPerformingMatches: MatchPerformance[];
    improvementTrends: TrendData[];
  };
  
  timeToHire: {
    average: number; // days
    median: number; // days
    fastest: number; // days
    slowest: number; // days
    benchmarkComparison: number; // vs industry average
    stageBreakdown: StageTimeline[];
  };
  
  retentionRates: {
    month3: number; // percentage
    month6: number;
    month12: number;
    month24: number;
    industryComparison: number;
    retentionFactors: RetentionFactor[];
  };
  
  clientSatisfaction: {
    overall: number; // 1-10 scale
    companyRating: number;
    teamRating: number;
    recommendationScore: number; // NPS
    satisfactionTrends: TrendData[];
    feedbackCategories: FeedbackCategory[];
  };
}

export interface BusinessOutcomes {
  revenueGrowth: {
    totalImpact: number; // USD
    quarterOverQuarter: number; // percentage
    yearOverYear: number; // percentage
    revenuePerLiftout: number;
    projectedAnnualImpact: number;
    revenueBreakdown: RevenueBreakdown[];
  };
  
  marketExpansion: {
    newMarkets: number;
    geographicReach: GeographicMetric[];
    functionalCapabilities: CapabilityMetric[];
    clientBaseGrowth: number; // percentage
    marketShareGains: MarketShareData[];
  };
  
  competitiveImpact: {
    talentAcquiredFromCompetitors: number;
    marketPositionImprovement: number; // percentage
    competitiveAdvantages: CompetitiveAdvantage[];
    clientMigration: ClientMigrationData[];
  };
  
  teamPerformance: {
    productivityGains: number; // percentage
    qualityMetrics: QualityMetric[];
    innovationIndex: number; // 1-100
    clientSatisfactionImprovement: number;
    deliverySpeed: SpeedMetric[];
  };
  
  careerAdvancement: {
    promotionRate: number; // percentage
    skillDevelopment: SkillDevelopmentMetric[];
    leadershipEmergence: number;
    internalMobility: number; // percentage
    compensationGrowth: number; // percentage
  };
}

export interface ScoreDistribution {
  range: string; // e.g., "80-90"
  count: number;
  percentage: number;
}

export interface MatchPerformance {
  teamId: string;
  teamName: string;
  matchScore: number;
  actualPerformance: number;
  variance: number;
  successFactors: string[];
}

export interface TrendData {
  period: string;
  value: number;
  change: number; // percentage change from previous period
}

export interface StageTimeline {
  stage: 'initial_contact' | 'due_diligence' | 'negotiation' | 'legal_review' | 'onboarding';
  averageDays: number;
  benchmarkDays: number;
  efficiency: number; // percentage vs benchmark
}

export interface RetentionFactor {
  factor: string;
  impact: 'positive' | 'negative';
  strength: number; // correlation strength
  description: string;
}

export interface FeedbackCategory {
  category: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  feedback: string[];
}

export interface RevenueBreakdown {
  source: string;
  amount: number;
  percentage: number;
  growth: number; // percentage
}

export interface GeographicMetric {
  region: string;
  teamsAcquired: number;
  revenueImpact: number;
  marketPenetration: number; // percentage
}

export interface CapabilityMetric {
  capability: string;
  teamsAdded: number;
  strengthRating: number; // 1-10
  strategicValue: 'high' | 'medium' | 'low';
}

export interface MarketShareData {
  market: string;
  previousShare: number; // percentage
  currentShare: number; // percentage
  growth: number; // percentage points
}

export interface CompetitiveAdvantage {
  advantage: string;
  impact: number; // 1-10
  sustainability: 'temporary' | 'medium_term' | 'long_term';
  description: string;
}

export interface ClientMigrationData {
  fromCompetitor: string;
  clientsGained: number;
  revenueValue: number;
  retentionRate: number; // percentage
}

export interface QualityMetric {
  metric: string;
  baseline: number;
  current: number;
  improvement: number; // percentage
}

export interface SpeedMetric {
  process: string;
  baselineTime: number; // days
  currentTime: number; // days
  improvement: number; // percentage
}

export interface SkillDevelopmentMetric {
  skill: string;
  baselineLevel: number; // 1-10
  currentLevel: number; // 1-10
  improvement: number;
  certifications: number;
}

export interface PerformanceComparison {
  metric: string;
  currentPeriod: number;
  previousPeriod: number;
  change: number; // percentage
  trend: 'improving' | 'stable' | 'declining';
  target: number;
  targetAchievement: number; // percentage
}

export interface IndustryBenchmark {
  metric: string;
  companyValue: number;
  industryAverage: number;
  topQuartile: number;
  ranking: number; // percentile
  gapAnalysis: string;
}

export interface CostAnalysis {
  totalInvestment: number;
  costPerLiftout: number;
  costBreakdown: CostBreakdown[];
  costEfficiency: {
    vsTraditionalHiring: number; // percentage savings
    vsMAActivity: number; // percentage savings
    vsConsulting: number; // percentage savings
  };
  budgetUtilization: number; // percentage
}

export interface CostBreakdown {
  category: 'recruitment' | 'due_diligence' | 'legal' | 'compensation' | 'integration' | 'other';
  amount: number;
  percentage: number;
  trend: number; // percentage change
}

export interface ROIAnalysis {
  totalROI: number; // percentage
  roiByLiftout: ROIByLiftout[];
  paybackPeriod: number; // months
  netPresentValue: number;
  internalRateOfReturn: number; // percentage
  riskAdjustedReturns: number;
  projections: ROIProjection[];
}

export interface ROIByLiftout {
  liftoutId: string;
  teamName: string;
  investment: number;
  returns: number;
  roi: number; // percentage
  paybackMonths: number;
  status: 'realized' | 'projected' | 'at_risk';
}

export interface ROIProjection {
  year: number;
  projectedReturns: number;
  confidenceLevel: number; // percentage
  scenarios: {
    conservative: number;
    expected: number;
    optimistic: number;
  };
}

// Utility functions
export function calculateOverallROI(analytics: LiftoutAnalytics): number {
  const { totalInvestment } = analytics.costAnalysis;
  const { totalImpact } = analytics.businessOutcomes.revenueGrowth;
  
  if (totalInvestment === 0) return 0;
  return ((totalImpact - totalInvestment) / totalInvestment) * 100;
}

export function getPerformanceGrade(analytics: LiftoutAnalytics): 'A' | 'B' | 'C' | 'D' | 'F' {
  const roi = calculateOverallROI(analytics);
  const retentionRate = analytics.platformMetrics.retentionRates.month12;
  const satisfactionScore = analytics.platformMetrics.clientSatisfaction.overall;
  const successRate = analytics.platformMetrics.successfulLiftouts.successRate;
  
  const score = (roi * 0.3 + retentionRate * 0.25 + satisfactionScore * 10 * 0.25 + successRate * 0.2);
  
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  if (score >= 65) return 'C';
  if (score >= 55) return 'D';
  return 'F';
}

export function identifyKeyInsights(analytics: LiftoutAnalytics): string[] {
  const insights: string[] = [];
  const { platformMetrics, businessOutcomes } = analytics;
  
  // Success rate insights
  if (platformMetrics.successfulLiftouts.successRate >= 80) {
    insights.push('Excellent liftout success rate indicates strong due diligence and team selection');
  } else if (platformMetrics.successfulLiftouts.successRate < 60) {
    insights.push('Low success rate suggests need for improved due diligence processes');
  }
  
  // Retention insights
  if (platformMetrics.retentionRates.month12 >= 90) {
    insights.push('Outstanding retention rates demonstrate effective integration and cultural fit');
  } else if (platformMetrics.retentionRates.month12 < 75) {
    insights.push('Retention challenges indicate need for enhanced onboarding and support');
  }
  
  // ROI insights
  const roi = calculateOverallROI(analytics);
  if (roi >= 200) {
    insights.push('Exceptional ROI demonstrates strong value creation from liftout strategy');
  } else if (roi < 100) {
    insights.push('ROI below expectations suggests need for cost optimization or value enhancement');
  }
  
  // Time to hire insights
  if (platformMetrics.timeToHire.benchmarkComparison > 20) {
    insights.push('Faster than industry average time-to-hire provides competitive advantage');
  } else if (platformMetrics.timeToHire.benchmarkComparison < -20) {
    insights.push('Slower hiring process may be limiting market opportunities');
  }
  
  return insights;
}

export function generateRecommendations(analytics: LiftoutAnalytics): string[] {
  const recommendations: string[] = [];
  const { platformMetrics, businessOutcomes, costAnalysis } = analytics;
  
  // Based on retention rates
  if (platformMetrics.retentionRates.month6 < 85) {
    recommendations.push('Implement enhanced 6-month integration support program');
  }
  
  // Based on match quality
  if (platformMetrics.matchQuality.averageScore < 75) {
    recommendations.push('Refine AI matching algorithms and due diligence criteria');
  }
  
  // Based on cost efficiency
  if (costAnalysis.costPerLiftout > 500000) {
    recommendations.push('Optimize cost structure through process automation and vendor negotiation');
  }
  
  // Based on satisfaction scores
  if (platformMetrics.clientSatisfaction.overall < 8) {
    recommendations.push('Enhance client experience through improved communication and support');
  }
  
  // Based on time to hire
  if (platformMetrics.timeToHire.average > 90) {
    recommendations.push('Streamline negotiation and legal review processes to reduce time-to-hire');
  }
  
  return recommendations;
}

// Mock data for demonstration
export const mockLiftoutAnalytics: LiftoutAnalytics = {
  id: 'analytics-q3-2024',
  companyId: 'medtech-innovations',
  reportingPeriod: {
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-09-30T00:00:00Z',
    type: 'quarterly',
  },
  generatedDate: '2024-10-01T00:00:00Z',
  
  platformMetrics: {
    successfulLiftouts: {
      total: 8,
      completed: 6,
      inProgress: 2,
      cancelled: 0,
      successRate: 100,
      averageTimeToComplete: 67,
    },
    
    matchQuality: {
      averageScore: 87,
      distribution: [
        { range: '90-100', count: 3, percentage: 50 },
        { range: '80-89', count: 2, percentage: 33 },
        { range: '70-79', count: 1, percentage: 17 },
      ],
      topPerformingMatches: [
        {
          teamId: 'team-goldman-analytics',
          teamName: 'Strategic Analytics Core',
          matchScore: 94,
          actualPerformance: 96,
          variance: 2,
          successFactors: ['Cultural alignment', 'Technical expertise match', 'Industry experience'],
        },
      ],
      improvementTrends: [
        { period: 'Q1 2024', value: 82, change: 0 },
        { period: 'Q2 2024', value: 85, change: 3.7 },
        { period: 'Q3 2024', value: 87, change: 2.4 },
      ],
    },
    
    timeToHire: {
      average: 67,
      median: 63,
      fastest: 45,
      slowest: 89,
      benchmarkComparison: 15, // 15% faster than industry
      stageBreakdown: [
        { stage: 'initial_contact', averageDays: 7, benchmarkDays: 10, efficiency: 130 },
        { stage: 'due_diligence', averageDays: 21, benchmarkDays: 28, efficiency: 133 },
        { stage: 'negotiation', averageDays: 18, benchmarkDays: 21, efficiency: 117 },
        { stage: 'legal_review', averageDays: 14, benchmarkDays: 18, efficiency: 129 },
        { stage: 'onboarding', averageDays: 7, benchmarkDays: 10, efficiency: 143 },
      ],
    },
    
    retentionRates: {
      month3: 98,
      month6: 94,
      month12: 91,
      month24: 87,
      industryComparison: 12, // 12% above industry average
      retentionFactors: [
        { factor: 'Cultural fit assessment', impact: 'positive', strength: 0.8, description: 'Strong cultural alignment drives retention' },
        { factor: 'Compensation competitiveness', impact: 'positive', strength: 0.7, description: 'Market-leading packages reduce turnover' },
      ],
    },
    
    clientSatisfaction: {
      overall: 8.7,
      companyRating: 8.9,
      teamRating: 8.5,
      recommendationScore: 75, // NPS
      satisfactionTrends: [
        { period: 'Q1 2024', value: 8.2, change: 0 },
        { period: 'Q2 2024', value: 8.5, change: 3.7 },
        { period: 'Q3 2024', value: 8.7, change: 2.4 },
      ],
      feedbackCategories: [
        { category: 'Team Quality', score: 9.1, trend: 'improving', feedback: ['Exceptional technical skills', 'Strong collaboration'] },
        { category: 'Integration Support', score: 8.4, trend: 'stable', feedback: ['Good onboarding process', 'Helpful documentation'] },
      ],
    },
  },
  
  businessOutcomes: {
    revenueGrowth: {
      totalImpact: 12500000,
      quarterOverQuarter: 34,
      yearOverYear: 127,
      revenuePerLiftout: 2083333,
      projectedAnnualImpact: 25000000,
      revenueBreakdown: [
        { source: 'New client acquisitions', amount: 7500000, percentage: 60, growth: 45 },
        { source: 'Expanded existing accounts', amount: 3200000, percentage: 26, growth: 28 },
        { source: 'Improved service delivery', amount: 1800000, percentage: 14, growth: 22 },
      ],
    },
    
    marketExpansion: {
      newMarkets: 3,
      geographicReach: [
        { region: 'West Coast', teamsAcquired: 2, revenueImpact: 5200000, marketPenetration: 23 },
        { region: 'Europe', teamsAcquired: 1, revenueImpact: 3100000, marketPenetration: 12 },
      ],
      functionalCapabilities: [
        { capability: 'Healthcare AI', teamsAdded: 2, strengthRating: 9, strategicValue: 'high' },
        { capability: 'Regulatory Compliance', teamsAdded: 1, strengthRating: 8, strategicValue: 'high' },
      ],
      clientBaseGrowth: 42,
      marketShareGains: [
        { market: 'Healthcare AI', previousShare: 8, currentShare: 15, growth: 7 },
      ],
    },
    
    competitiveImpact: {
      talentAcquiredFromCompetitors: 18,
      marketPositionImprovement: 23,
      competitiveAdvantages: [
        { advantage: 'Proprietary ML algorithms', impact: 9, sustainability: 'long_term', description: 'Unique algorithmic approaches' },
        { advantage: 'Regulatory expertise', impact: 8, sustainability: 'medium_term', description: 'Deep compliance knowledge' },
      ],
      clientMigration: [
        { fromCompetitor: 'TechCorp Solutions', clientsGained: 5, revenueValue: 2300000, retentionRate: 94 },
      ],
    },
    
    teamPerformance: {
      productivityGains: 28,
      qualityMetrics: [
        { metric: 'Code quality score', baseline: 7.2, current: 8.6, improvement: 19 },
        { metric: 'Client satisfaction', baseline: 7.8, current: 8.7, improvement: 12 },
      ],
      innovationIndex: 87,
      clientSatisfactionImprovement: 15,
      deliverySpeed: [
        { process: 'Product development', baselineTime: 120, currentTime: 89, improvement: 26 },
        { process: 'Client onboarding', baselineTime: 45, currentTime: 32, improvement: 29 },
      ],
    },
    
    careerAdvancement: {
      promotionRate: 31,
      skillDevelopment: [
        { skill: 'Machine Learning', baselineLevel: 6.5, currentLevel: 8.2, improvement: 1.7, certifications: 8 },
        { skill: 'Leadership', baselineLevel: 5.8, currentLevel: 7.4, improvement: 1.6, certifications: 3 },
      ],
      leadershipEmergence: 4,
      internalMobility: 22,
      compensationGrowth: 18,
    },
  },
  
  performanceComparisons: [
    { metric: 'Success Rate', currentPeriod: 100, previousPeriod: 87, change: 15, trend: 'improving', target: 85, targetAchievement: 118 },
    { metric: 'Time to Hire', currentPeriod: 67, previousPeriod: 78, change: -14, trend: 'improving', target: 70, targetAchievement: 104 },
  ],
  
  industryBenchmarks: [
    { metric: 'Retention Rate (12mo)', companyValue: 91, industryAverage: 78, topQuartile: 88, ranking: 85, gapAnalysis: 'Above top quartile performance' },
    { metric: 'Time to Productivity', companyValue: 45, industryAverage: 67, topQuartile: 52, ranking: 92, gapAnalysis: 'Best-in-class performance' },
  ],
  
  costAnalysis: {
    totalInvestment: 3400000,
    costPerLiftout: 566667,
    costBreakdown: [
      { category: 'compensation', amount: 2100000, percentage: 62, trend: 5 },
      { category: 'recruitment', amount: 510000, percentage: 15, trend: -8 },
      { category: 'legal', amount: 340000, percentage: 10, trend: 12 },
      { category: 'due_diligence', amount: 272000, percentage: 8, trend: -3 },
      { category: 'integration', amount: 178000, percentage: 5, trend: 15 },
    ],
    costEfficiency: {
      vsTraditionalHiring: 35,
      vsMAActivity: 67,
      vsConsulting: 42,
    },
    budgetUtilization: 87,
  },
  
  roiAnalysis: {
    totalROI: 268,
    roiByLiftout: [
      { liftoutId: 'liftout-001', teamName: 'Strategic Analytics Core', investment: 850000, returns: 4200000, roi: 394, paybackMonths: 8, status: 'realized' },
      { liftoutId: 'liftout-002', teamName: 'Healthcare AI Specialists', investment: 720000, returns: 2800000, roi: 289, paybackMonths: 10, status: 'realized' },
    ],
    paybackPeriod: 9,
    netPresentValue: 8200000,
    internalRateOfReturn: 156,
    riskAdjustedReturns: 234,
    projections: [
      { year: 1, projectedReturns: 15000000, confidenceLevel: 85, scenarios: { conservative: 12000000, expected: 15000000, optimistic: 19000000 } },
      { year: 2, projectedReturns: 28000000, confidenceLevel: 75, scenarios: { conservative: 22000000, expected: 28000000, optimistic: 35000000 } },
    ],
  },
};
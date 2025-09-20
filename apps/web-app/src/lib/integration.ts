export interface IntegrationTracker {
  id: string;
  liftoutId: string;
  teamId: string;
  companyId: string;
  
  // Basic info
  teamName: string;
  companyName: string;
  startDate: string;
  integrationManager: string;
  
  // Integration phases
  currentPhase: IntegrationPhase;
  phases: PhaseTracker[];
  
  // Performance tracking
  performanceMetrics: PerformanceTracker;
  culturalIntegration: CulturalIntegrationTracker;
  businessResults: BusinessResultsTracker;
  
  // Early warning system
  riskFactors: RiskFactor[];
  healthScore: number; // 1-100
  retentionRisk: 'low' | 'medium' | 'high';
  
  // Milestones and goals
  milestones: IntegrationMilestone[];
  successCriteria: SuccessCriteria[];
  
  // Feedback and surveys
  feedbackSessions: FeedbackSession[];
  surveysCompleted: Survey[];
  
  // Status and timeline
  status: 'pre_start' | 'onboarding' | 'integration' | 'stabilization' | 'optimization' | 'completed';
  overallProgress: number; // percentage
  projectedCompletionDate: string;
  actualCompletionDate?: string;
}

export type IntegrationPhase = 'pre_boarding' | 'onboarding' | 'team_formation' | 'productivity_ramp' | 'optimization' | 'full_integration';

export interface PhaseTracker {
  phase: IntegrationPhase;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetDuration: number; // days
  actualDuration?: number; // days
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number; // percentage
  
  // Phase-specific objectives
  objectives: PhaseObjective[];
  completedObjectives: number;
  
  // Key activities
  activities: IntegrationActivity[];
  
  // Success metrics for this phase
  phaseMetrics: PhaseMetric[];
  
  // Issues and blockers
  issues: PhaseIssue[];
  
  // Stakeholder involvement
  stakeholders: PhaseStakeholder[];
}

export interface PhaseObjective {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  completionCriteria: string[];
  dependencies: string[]; // Other objective IDs
}

export interface IntegrationActivity {
  id: string;
  title: string;
  type: 'training' | 'meeting' | 'setup' | 'documentation' | 'assessment' | 'social' | 'project_work';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  duration: number; // minutes
  participants: string[];
  facilitator?: string;
  location?: string;
  outcomes?: string[];
  materials?: string[];
}

export interface PhaseMetric {
  metric: string;
  target: number;
  actual?: number;
  unit: string;
  measurementDate?: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
}

export interface PhaseIssue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'cultural' | 'process' | 'resource' | 'communication';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: string;
  impact: string;
}

export interface PhaseStakeholder {
  userId: string;
  name: string;
  role: string;
  involvement: 'primary' | 'secondary' | 'informed';
  responsibilities: string[];
}

export interface PerformanceTracker {
  // Productivity metrics
  productivity: ProductivityMetric[];
  
  // Quality metrics
  quality: QualityMetric[];
  
  // Delivery metrics
  delivery: DeliveryMetric[];
  
  // Individual performance
  individualPerformance: IndividualPerformance[];
  
  // Team performance
  teamPerformance: TeamPerformanceMetric[];
  
  // Performance trends
  trends: PerformanceTrend[];
}

export interface ProductivityMetric {
  period: string; // weekly, monthly
  linesOfCode?: number;
  tasksCompleted: number;
  projectsDelivered: number;
  hoursWorked: number;
  utilizationRate: number; // percentage
  velocityScore: number; // relative to baseline
  benchmarkComparison: number; // vs company average
}

export interface QualityMetric {
  period: string;
  codeQualityScore?: number;
  bugRate: number;
  customerSatisfactionScore: number;
  peerReviewScore: number;
  accuracyRate: number; // percentage
  reworkRate: number; // percentage
}

export interface DeliveryMetric {
  period: string;
  onTimeDelivery: number; // percentage
  budgetCompliance: number; // percentage
  scopeCompliance: number; // percentage
  stakeholderSatisfaction: number; // 1-10
  clientFeedbackScore: number; // 1-10
}

export interface IndividualPerformance {
  employeeId: string;
  name: string;
  role: string;
  performanceScore: number; // 1-10
  goalAchievement: number; // percentage
  skillDevelopment: SkillProgress[];
  engagementScore: number; // 1-10
  retentionRisk: 'low' | 'medium' | 'high';
  careerProgression: string;
  feedbackSummary: string;
}

export interface SkillProgress {
  skill: string;
  baselineLevel: number; // 1-10
  currentLevel: number; // 1-10
  targetLevel: number; // 1-10
  improvementRate: number; // per month
  certifications: string[];
  trainingCompleted: string[];
}

export interface TeamPerformanceMetric {
  metric: string;
  value: number;
  target: number;
  variance: number; // percentage
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface PerformanceTrend {
  metric: string;
  timeSeriesData: TimeSeriesPoint[];
  trendDirection: 'up' | 'down' | 'stable';
  projectedValue: number;
  confidenceLevel: number; // percentage
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface CulturalIntegrationTracker {
  // Cultural fit assessment
  culturalFitScore: number; // 1-100
  cultureShockIndicators: CultureShockIndicator[];
  
  // Social integration
  socialConnections: SocialConnection[];
  networkIntegration: number; // percentage
  
  // Communication patterns
  communicationMetrics: CommunicationMetric[];
  
  // Behavioral observations
  behavioralAdaptation: BehavioralAdaptation[];
  
  // Cultural feedback
  culturalFeedback: CulturalFeedback[];
  
  // Integration activities
  culturalActivities: CulturalActivity[];
}

export interface CultureShockIndicator {
  indicator: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: 'rare' | 'occasional' | 'frequent';
  trend: 'improving' | 'stable' | 'worsening';
  description: string;
  recommendedActions: string[];
}

export interface SocialConnection {
  employeeId: string;
  connectionType: 'mentor' | 'peer' | 'cross_functional' | 'leadership';
  connectionStrength: number; // 1-10
  establishedDate: string;
  interactionFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  relationshipQuality: number; // 1-10
}

export interface CommunicationMetric {
  metric: string;
  value: number;
  benchmark: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'concerning';
  observations: string[];
}

export interface BehavioralAdaptation {
  behavior: string;
  adaptationLevel: number; // 1-10
  timeToAdapt: number; // days
  supportProvided: string[];
  currentStatus: string;
}

export interface CulturalFeedback {
  source: 'team_member' | 'manager' | 'peer' | 'client' | 'hr';
  feedbackType: 'positive' | 'constructive' | 'concern';
  category: 'communication' | 'collaboration' | 'values_alignment' | 'work_style';
  feedback: string;
  actionTaken?: string;
  date: string;
}

export interface CulturalActivity {
  activity: string;
  type: 'social' | 'training' | 'mentoring' | 'team_building';
  participants: string[];
  date: string;
  effectiveness: number; // 1-10
  feedback: string[];
}

export interface BusinessResultsTracker {
  // Revenue impact
  revenueMetrics: RevenueMetric[];
  
  // Cost metrics
  costMetrics: CostMetric[];
  
  // ROI tracking
  roiMetrics: ROIMetric[];
  
  // Market impact
  marketMetrics: MarketMetric[];
  
  // Innovation metrics
  innovationMetrics: InnovationMetric[];
  
  // Client impact
  clientMetrics: ClientMetric[];
}

export interface RevenueMetric {
  period: string;
  directRevenue: number;
  indirectRevenue: number;
  revenueGrowth: number; // percentage
  newClientRevenue: number;
  expandedClientRevenue: number;
  projectedAnnualImpact: number;
}

export interface CostMetric {
  category: 'integration' | 'training' | 'infrastructure' | 'support' | 'overhead';
  actualCost: number;
  budgetedCost: number;
  variance: number; // percentage
  costPerEmployee: number;
  oneTimeCosts: number;
  recurringCosts: number;
}

export interface ROIMetric {
  period: string;
  totalInvestment: number;
  totalReturns: number;
  roi: number; // percentage
  paybackPeriod: number; // months
  npv: number;
  irr: number; // percentage
  riskAdjustedReturn: number;
}

export interface MarketMetric {
  newMarketsEntered: number;
  marketShareGain: number; // percentage
  competitiveAdvantage: string[];
  brandImpact: number; // 1-10
  marketReception: number; // 1-10
}

export interface InnovationMetric {
  newProductsLaunched: number;
  patentsApplied: number;
  processImprovements: number;
  innovationIndex: number; // 1-100
  r_and_d_efficiency: number; // percentage
}

export interface ClientMetric {
  newClientsAcquired: number;
  clientRetentionRate: number; // percentage
  clientSatisfactionScore: number; // 1-10
  upsellRate: number; // percentage
  referralRate: number; // percentage
  clientLifetimeValue: number;
}

export interface RiskFactor {
  id: string;
  category: 'retention' | 'performance' | 'cultural' | 'business' | 'technical';
  risk: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Risk details
  description: string;
  indicators: string[];
  potentialConsequences: string[];
  
  // Mitigation
  mitigationStrategies: string[];
  preventiveActions: string[];
  contingencyPlans: string[];
  
  // Monitoring
  earlyWarningSignals: string[];
  monitoringFrequency: 'daily' | 'weekly' | 'monthly';
  responsible: string;
  
  // Status
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved' | 'escalated';
  lastAssessment: string;
  nextReview: string;
}

export interface IntegrationMilestone {
  id: string;
  name: string;
  description: string;
  phase: IntegrationPhase;
  targetDate: string;
  actualDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'at_risk';
  
  // Success criteria
  criteria: MilestoneCriteria[];
  completionPercentage: number;
  
  // Impact and importance
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  stakeholders: string[];
  
  // Dependencies
  dependencies: string[]; // Other milestone IDs
  blockers: string[];
  
  // Deliverables
  deliverables: Deliverable[];
}

export interface MilestoneCriteria {
  criterion: string;
  target: string;
  actual?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  verificationMethod: string;
  verifiedBy?: string;
  verificationDate?: string;
}

export interface Deliverable {
  name: string;
  type: 'document' | 'system' | 'process' | 'training' | 'assessment';
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  owner: string;
  dueDate: string;
  completedDate?: string;
  qualityScore?: number; // 1-10
}

export interface SuccessCriteria {
  id: string;
  category: 'performance' | 'retention' | 'cultural' | 'business' | 'innovation';
  criterion: string;
  target: string;
  measurement: string;
  timeframe: string;
  
  // Current status
  currentValue?: string;
  achievement: number; // percentage
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
  
  // Importance
  weight: number; // relative importance
  businessJustification: string;
  
  // Tracking
  lastMeasured?: string;
  nextMeasurement: string;
  responsible: string;
}

export interface FeedbackSession {
  id: string;
  type: '30_day' | '60_day' | '90_day' | 'quarterly' | 'ad_hoc';
  date: string;
  facilitator: string;
  participants: string[];
  
  // Session structure
  agenda: string[];
  duration: number; // minutes
  format: 'individual' | 'team' | 'mixed';
  
  // Feedback collected
  feedback: SessionFeedback[];
  actionItems: ActionItem[];
  
  // Outcomes
  satisfactionScore: number; // 1-10
  insights: string[];
  concernsRaised: string[];
  recommendations: string[];
  
  // Follow-up
  followUpScheduled: boolean;
  followUpDate?: string;
  followUpOwner?: string;
}

export interface SessionFeedback {
  category: 'integration_experience' | 'team_dynamics' | 'role_clarity' | 'support_quality' | 'cultural_fit' | 'growth_opportunities';
  rating: number; // 1-10
  comments: string;
  suggestions: string[];
  concerns: string[];
}

export interface ActionItem {
  id: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completedDate?: string;
  outcome?: string;
}

export interface Survey {
  id: string;
  type: 'onboarding' | 'cultural_fit' | 'job_satisfaction' | 'retention_risk' | 'performance_feedback';
  name: string;
  description: string;
  
  // Survey details
  questions: SurveyQuestion[];
  respondents: string[];
  responsesReceived: number;
  responseRate: number; // percentage
  
  // Timing
  scheduledDate: string;
  completionDeadline: string;
  actualCompletionDate?: string;
  
  // Results
  results: SurveyResults;
  analysis: SurveyAnalysis;
  
  // Actions
  actionsPlan: string[];
  implementationStatus: 'pending' | 'in_progress' | 'completed';
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'yes_no' | 'ranking';
  required: boolean;
  options?: string[]; // For multiple choice
  scale?: { min: number; max: number; }; // For rating
}

export interface SurveyResults {
  overallScore: number; // 1-10
  categoryScores: CategoryScore[];
  responseDistribution: ResponseDistribution[];
  openEndedResponses: string[];
  trends: SurveyTrend[];
}

export interface CategoryScore {
  category: string;
  score: number;
  benchmark: number;
  status: 'excellent' | 'good' | 'average' | 'needs_improvement' | 'poor';
}

export interface ResponseDistribution {
  questionId: string;
  responses: { option: string; count: number; percentage: number; }[];
}

export interface SurveyTrend {
  category: string;
  direction: 'improving' | 'stable' | 'declining';
  magnitude: number; // percentage change
  significance: 'high' | 'medium' | 'low';
}

export interface SurveyAnalysis {
  keyFindings: string[];
  strengthsIdentified: string[];
  areasForImprovement: string[];
  correlations: string[];
  recommendations: string[];
  riskIndicators: string[];
}

// Utility functions
export function calculateIntegrationHealthScore(tracker: IntegrationTracker): number {
  const weights = {
    performance: 0.3,
    cultural: 0.25,
    business: 0.25,
    milestones: 0.2,
  };

  const performanceScore = calculatePerformanceScore(tracker.performanceMetrics);
  const culturalScore = tracker.culturalIntegration.culturalFitScore;
  const businessScore = calculateBusinessScore(tracker.businessResults);
  const milestoneScore = calculateMilestoneScore(tracker.milestones);

  return Math.round(
    performanceScore * weights.performance +
    culturalScore * weights.cultural +
    businessScore * weights.business +
    milestoneScore * weights.milestones
  );
}

export function calculatePerformanceScore(metrics: PerformanceTracker): number {
  // Calculate average performance across all metrics
  const productivityAvg = metrics.productivity.reduce((acc, p) => acc + p.velocityScore, 0) / metrics.productivity.length;
  const qualityAvg = metrics.quality.reduce((acc, q) => acc + q.customerSatisfactionScore * 10, 0) / metrics.quality.length;
  const deliveryAvg = metrics.delivery.reduce((acc, d) => acc + d.onTimeDelivery, 0) / metrics.delivery.length;
  
  return Math.round((productivityAvg + qualityAvg + deliveryAvg) / 3);
}

export function calculateBusinessScore(results: BusinessResultsTracker): number {
  const roiScore = Math.min(results.roiMetrics[0]?.roi || 0, 100); // Cap at 100
  const revenueGrowth = Math.min(results.revenueMetrics[0]?.revenueGrowth || 0, 100);
  const clientSatisfaction = (results.clientMetrics[0]?.clientSatisfactionScore || 0) * 10;
  
  return Math.round((roiScore + revenueGrowth + clientSatisfaction) / 3);
}

export function calculateMilestoneScore(milestones: IntegrationMilestone[]): number {
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  
  if (totalMilestones === 0) return 100;
  return Math.round((completedMilestones / totalMilestones) * 100);
}

export function assessRetentionRisk(tracker: IntegrationTracker): 'low' | 'medium' | 'high' {
  const riskFactors = tracker.riskFactors.filter(rf => rf.category === 'retention' && rf.status !== 'resolved');
  const criticalRisks = riskFactors.filter(rf => rf.severity === 'critical').length;
  const highRisks = riskFactors.filter(rf => rf.severity === 'high').length;
  
  const culturalFit = tracker.culturalIntegration.culturalFitScore;
  const performanceScore = calculatePerformanceScore(tracker.performanceMetrics);
  
  if (criticalRisks > 0 || culturalFit < 60 || performanceScore < 60) {
    return 'high';
  }
  
  if (highRisks > 1 || culturalFit < 75 || performanceScore < 75) {
    return 'medium';
  }
  
  return 'low';
}

export function generateEarlyWarnings(tracker: IntegrationTracker): string[] {
  const warnings: string[] = [];
  
  // Performance warnings
  const recentPerformance = tracker.performanceMetrics.productivity.slice(-2);
  if (recentPerformance.length >= 2) {
    const trend = recentPerformance[1].velocityScore - recentPerformance[0].velocityScore;
    if (trend < -10) {
      warnings.push('Declining productivity trend detected');
    }
  }
  
  // Cultural warnings
  const culturalFit = tracker.culturalIntegration.culturalFitScore;
  if (culturalFit < 70) {
    warnings.push('Cultural integration concerns identified');
  }
  
  // Milestone warnings
  const delayedMilestones = tracker.milestones.filter(m => m.status === 'delayed' || m.status === 'at_risk');
  if (delayedMilestones.length > 2) {
    warnings.push(`${delayedMilestones.length} milestones are delayed or at risk`);
  }
  
  // Risk factor warnings
  const activeRisks = tracker.riskFactors.filter(rf => rf.status === 'identified' || rf.status === 'monitoring');
  const highImpactRisks = activeRisks.filter(rf => rf.impact === 'high');
  if (highImpactRisks.length > 0) {
    warnings.push(`${highImpactRisks.length} high-impact risks require attention`);
  }
  
  return warnings;
}

// Mock data for demonstration
export const mockIntegrationTracker: IntegrationTracker = {
  id: 'integration-001',
  liftoutId: 'liftout-001',
  teamId: 'team-goldman-analytics',
  companyId: 'medtech-innovations',
  teamName: 'Strategic Analytics Core',
  companyName: 'MedTech Innovations',
  startDate: '2025-01-15T00:00:00Z',
  integrationManager: 'Jennifer Walsh',
  currentPhase: 'team_formation',
  
  phases: [
    {
      phase: 'pre_boarding',
      name: 'Pre-boarding Preparation',
      description: 'Preparing systems, workspace, and documentation before team arrival',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-01-14T00:00:00Z',
      targetDuration: 14,
      actualDuration: 14,
      status: 'completed',
      progress: 100,
      objectives: [
        {
          id: 'obj-001',
          title: 'Setup workspace and equipment',
          description: 'Prepare dedicated team workspace with required hardware and software',
          priority: 'high',
          status: 'completed',
          assignedTo: 'IT Department',
          dueDate: '2025-01-10T00:00:00Z',
          completedDate: '2025-01-09T00:00:00Z',
          completionCriteria: ['Workstations configured', 'Software licenses activated', 'Security access granted'],
          dependencies: [],
        },
      ],
      completedObjectives: 3,
      activities: [
        {
          id: 'act-001',
          title: 'IT Setup Session',
          type: 'setup',
          status: 'completed',
          scheduledDate: '2025-01-08T00:00:00Z',
          duration: 240,
          participants: ['IT Team', 'Facilities'],
          outcomes: ['All workstations ready', 'Network access configured'],
          materials: ['Hardware checklist', 'Software inventory'],
        },
      ],
      phaseMetrics: [
        {
          metric: 'Setup Completion',
          target: 100,
          actual: 100,
          unit: '%',
          measurementDate: '2025-01-14T00:00:00Z',
          status: 'exceeded',
        },
      ],
      issues: [],
      stakeholders: [
        {
          userId: 'user-jennifer-walsh',
          name: 'Jennifer Walsh',
          role: 'Integration Manager',
          involvement: 'primary',
          responsibilities: ['Overall coordination', 'Stakeholder communication'],
        },
      ],
    },
    {
      phase: 'onboarding',
      name: 'Team Onboarding',
      description: 'First week orientation and initial team setup',
      startDate: '2025-01-15T00:00:00Z',
      endDate: '2025-01-22T00:00:00Z',
      targetDuration: 7,
      status: 'completed',
      progress: 100,
      objectives: [
        {
          id: 'obj-002',
          title: 'Complete HR onboarding',
          description: 'All team members complete standard HR onboarding process',
          priority: 'high',
          status: 'completed',
          assignedTo: 'HR Department',
          dueDate: '2025-01-17T00:00:00Z',
          completedDate: '2025-01-17T00:00:00Z',
          completionCriteria: ['All paperwork completed', 'Benefits enrollment done', 'ID badges issued'],
          dependencies: [],
        },
      ],
      completedObjectives: 4,
      activities: [],
      phaseMetrics: [],
      issues: [],
      stakeholders: [],
    },
    {
      phase: 'team_formation',
      name: 'Team Formation & Integration',
      description: 'Building relationships and establishing team dynamics within the company',
      startDate: '2025-01-23T00:00:00Z',
      endDate: '2025-02-20T00:00:00Z',
      targetDuration: 28,
      status: 'in_progress',
      progress: 65,
      objectives: [
        {
          id: 'obj-003',
          title: 'Establish cross-functional relationships',
          description: 'Team members build connections with key stakeholders across departments',
          priority: 'high',
          status: 'in_progress',
          assignedTo: 'Alex Thompson',
          dueDate: '2025-02-15T00:00:00Z',
          completionCriteria: ['Meet with all department heads', 'Join relevant project teams', 'Attend team lunches'],
          dependencies: [],
        },
      ],
      completedObjectives: 2,
      activities: [],
      phaseMetrics: [],
      issues: [
        {
          id: 'issue-001',
          title: 'Delayed access to proprietary healthcare data',
          description: 'Team waiting for security clearance to access sensitive healthcare datasets',
          severity: 'medium',
          category: 'technical',
          status: 'in_progress',
          reportedBy: 'Alex Thompson',
          reportedDate: '2025-02-01T00:00:00Z',
          assignedTo: 'Security Team',
          impact: 'May delay initial project work by 1-2 weeks',
        },
      ],
      stakeholders: [],
    },
  ],
  
  performanceMetrics: {
    productivity: [
      {
        period: '2025-02',
        tasksCompleted: 23,
        projectsDelivered: 2,
        hoursWorked: 160,
        utilizationRate: 87,
        velocityScore: 92,
        benchmarkComparison: 15, // 15% above company average
      },
    ],
    quality: [
      {
        period: '2025-02',
        codeQualityScore: 8.6,
        bugRate: 0.02,
        customerSatisfactionScore: 8.7,
        peerReviewScore: 8.9,
        accuracyRate: 97,
        reworkRate: 3,
      },
    ],
    delivery: [
      {
        period: '2025-02',
        onTimeDelivery: 94,
        budgetCompliance: 98,
        scopeCompliance: 96,
        stakeholderSatisfaction: 8.5,
        clientFeedbackScore: 8.8,
      },
    ],
    individualPerformance: [
      {
        employeeId: 'alex-thompson',
        name: 'Alex Thompson',
        role: 'Director of AI Strategy',
        performanceScore: 8.9,
        goalAchievement: 87,
        skillDevelopment: [
          {
            skill: 'Healthcare AI',
            baselineLevel: 6,
            currentLevel: 7.5,
            targetLevel: 9,
            improvementRate: 0.75,
            certifications: ['Healthcare AI Fundamentals'],
            trainingCompleted: ['HIPAA Compliance', 'Medical Imaging Basics'],
          },
        ],
        engagementScore: 8.7,
        retentionRisk: 'low',
        careerProgression: 'On track for Senior Director promotion',
        feedbackSummary: 'Excellent leadership and quick adaptation to healthcare domain',
      },
    ],
    teamPerformance: [
      {
        metric: 'Team Velocity',
        value: 92,
        target: 85,
        variance: 8.2,
        trend: 'improving',
        lastUpdated: '2025-02-15T00:00:00Z',
      },
    ],
    trends: [
      {
        metric: 'Productivity',
        timeSeriesData: [
          { date: '2025-01-15', value: 75 },
          { date: '2025-01-30', value: 83 },
          { date: '2025-02-15', value: 92 },
        ],
        trendDirection: 'up',
        projectedValue: 98,
        confidenceLevel: 85,
      },
    ],
  },
  
  culturalIntegration: {
    culturalFitScore: 84,
    cultureShockIndicators: [
      {
        indicator: 'Meeting culture adaptation',
        severity: 'mild',
        frequency: 'occasional',
        trend: 'improving',
        description: 'Team adjusting to more collaborative meeting style',
        recommendedActions: ['Provide meeting facilitation training', 'Pair with experienced facilitators'],
      },
    ],
    socialConnections: [
      {
        employeeId: 'alex-thompson',
        connectionType: 'mentor',
        connectionStrength: 8,
        establishedDate: '2025-01-20T00:00:00Z',
        interactionFrequency: 'weekly',
        relationshipQuality: 8,
      },
    ],
    communicationMetrics: [
      {
        metric: 'Cross-team collaboration',
        value: 8.2,
        benchmark: 7.5,
        status: 'good',
        observations: ['Proactive in reaching out to other teams', 'Clear communication style'],
      },
    ],
    behavioralAdaptation: [
      {
        behavior: 'Decision-making style',
        adaptationLevel: 8,
        timeToAdapt: 21,
        supportProvided: ['Leadership coaching', 'Decision-making frameworks'],
        currentStatus: 'Well adapted to collaborative decision-making',
      },
    ],
    culturalFeedback: [
      {
        source: 'manager',
        feedbackType: 'positive',
        category: 'collaboration',
        feedback: 'Excellent integration with existing teams, very collaborative approach',
        date: '2025-02-10T00:00:00Z',
      },
    ],
    culturalActivities: [
      {
        activity: 'Team lunch with product team',
        type: 'social',
        participants: ['alex-thompson', 'product-team'],
        date: '2025-02-05T00:00:00Z',
        effectiveness: 8,
        feedback: ['Great way to learn about product priorities'],
      },
    ],
  },
  
  businessResults: {
    revenueMetrics: [
      {
        period: '2025-02',
        directRevenue: 450000,
        indirectRevenue: 180000,
        revenueGrowth: 23,
        newClientRevenue: 280000,
        expandedClientRevenue: 170000,
        projectedAnnualImpact: 5400000,
      },
    ],
    costMetrics: [
      {
        category: 'integration',
        actualCost: 125000,
        budgetedCost: 150000,
        variance: -16.7,
        costPerEmployee: 25000,
        oneTimeCosts: 75000,
        recurringCosts: 50000,
      },
    ],
    roiMetrics: [
      {
        period: '2025-02',
        totalInvestment: 850000,
        totalReturns: 1840000,
        roi: 116,
        paybackPeriod: 11,
        npv: 990000,
        irr: 89,
        riskAdjustedReturn: 94,
      },
    ],
    marketMetrics: [
      {
        newMarketsEntered: 1,
        marketShareGain: 3.2,
        competitiveAdvantage: ['Advanced healthcare AI capabilities', 'Proven track record'],
        brandImpact: 8,
        marketReception: 8.5,
      },
    ],
    innovationMetrics: [
      {
        newProductsLaunched: 0,
        patentsApplied: 1,
        processImprovements: 3,
        innovationIndex: 87,
        r_and_d_efficiency: 23,
      },
    ],
    clientMetrics: [
      {
        newClientsAcquired: 4,
        clientRetentionRate: 98,
        clientSatisfactionScore: 8.7,
        upsellRate: 34,
        referralRate: 28,
        clientLifetimeValue: 420000,
      },
    ],
  },
  
  riskFactors: [
    {
      id: 'risk-001',
      category: 'cultural',
      risk: 'Adjustment to healthcare regulatory environment',
      probability: 'medium',
      impact: 'medium',
      severity: 'medium',
      description: 'Team may need additional time to fully understand healthcare compliance requirements',
      indicators: ['Questions about HIPAA compliance', 'Slower initial project velocity'],
      potentialConsequences: ['Delayed project timelines', 'Need for additional training'],
      mitigationStrategies: ['Provide comprehensive healthcare compliance training', 'Assign healthcare domain experts as mentors'],
      preventiveActions: ['Regular compliance check-ins', 'Access to legal and compliance resources'],
      contingencyPlans: ['Extended training period', 'External compliance consultant'],
      earlyWarningSignals: ['Compliance-related questions increasing', 'Hesitation in decision-making'],
      monitoringFrequency: 'weekly',
      responsible: 'Jennifer Walsh',
      status: 'monitoring',
      lastAssessment: '2025-02-15T00:00:00Z',
      nextReview: '2025-02-22T00:00:00Z',
    },
  ],
  
  healthScore: 87,
  retentionRisk: 'low',
  
  milestones: [
    {
      id: 'milestone-001',
      name: 'Full Team Onboarding Complete',
      description: 'All team members successfully onboarded and productive',
      phase: 'onboarding',
      targetDate: '2025-01-22T00:00:00Z',
      actualDate: '2025-01-22T00:00:00Z',
      status: 'completed',
      criteria: [
        {
          criterion: 'HR onboarding completion',
          target: '100%',
          actual: '100%',
          status: 'completed',
          verificationMethod: 'HR system check',
          verifiedBy: 'HR Department',
          verificationDate: '2025-01-22T00:00:00Z',
        },
      ],
      completionPercentage: 100,
      businessImpact: 'high',
      stakeholders: ['HR', 'IT', 'Direct Manager'],
      dependencies: [],
      blockers: [],
      deliverables: [
        {
          name: 'Onboarding Checklist',
          type: 'document',
          status: 'completed',
          owner: 'HR Department',
          dueDate: '2025-01-22T00:00:00Z',
          completedDate: '2025-01-22T00:00:00Z',
          qualityScore: 9,
        },
      ],
    },
  ],
  
  successCriteria: [
    {
      id: 'success-001',
      category: 'performance',
      criterion: 'Team productivity at 90% of benchmark within 90 days',
      target: '90%',
      measurement: 'Velocity score vs company benchmark',
      timeframe: '90 days',
      currentValue: '92%',
      achievement: 102,
      status: 'exceeded',
      weight: 25,
      businessJustification: 'Demonstrates successful integration and value creation',
      lastMeasured: '2025-02-15T00:00:00Z',
      nextMeasurement: '2025-03-01T00:00:00Z',
      responsible: 'Jennifer Walsh',
    },
  ],
  
  feedbackSessions: [
    {
      id: 'feedback-001',
      type: '30_day',
      date: '2025-02-15T00:00:00Z',
      facilitator: 'Jennifer Walsh',
      participants: ['alex-thompson', 'team-members'],
      agenda: ['Integration experience', 'Cultural adaptation', 'Support needs', 'Goal alignment'],
      duration: 90,
      format: 'team',
      feedback: [
        {
          category: 'integration_experience',
          rating: 8,
          comments: 'Very smooth integration process, excellent support from all teams',
          suggestions: ['More healthcare domain training', 'Earlier access to client data'],
          concerns: ['Initial data access delays'],
        },
      ],
      actionItems: [
        {
          id: 'action-001',
          action: 'Expedite healthcare dataset access',
          priority: 'high',
          assignedTo: 'Security Team',
          dueDate: '2025-02-25T00:00:00Z',
          status: 'in_progress',
        },
      ],
      satisfactionScore: 8.5,
      insights: ['Team is adapting well but needs faster data access'],
      concernsRaised: ['Data access bottlenecks'],
      recommendations: ['Streamline security clearance process for future hires'],
      followUpScheduled: true,
      followUpDate: '2025-03-15T00:00:00Z',
      followUpOwner: 'Jennifer Walsh',
    },
  ],
  
  surveysCompleted: [
    {
      id: 'survey-001',
      type: 'cultural_fit',
      name: '30-Day Cultural Integration Survey',
      description: 'Assessment of cultural adaptation and integration progress',
      questions: [
        {
          id: 'q1',
          question: 'How well do you feel integrated into the company culture?',
          type: 'rating',
          required: true,
          scale: { min: 1, max: 10 },
        },
      ],
      respondents: ['alex-thompson'],
      responsesReceived: 5,
      responseRate: 100,
      scheduledDate: '2025-02-10T00:00:00Z',
      completionDeadline: '2025-02-17T00:00:00Z',
      actualCompletionDate: '2025-02-15T00:00:00Z',
      results: {
        overallScore: 8.4,
        categoryScores: [
          {
            category: 'Cultural Adaptation',
            score: 8.4,
            benchmark: 7.2,
            status: 'excellent',
          },
        ],
        responseDistribution: [
          {
            questionId: 'q1',
            responses: [
              { option: '8-10', count: 4, percentage: 80 },
              { option: '6-7', count: 1, percentage: 20 },
            ],
          },
        ],
        openEndedResponses: ['Great mentorship program', 'Need faster data access'],
        trends: [
          {
            category: 'Cultural Adaptation',
            direction: 'improving',
            magnitude: 15,
            significance: 'high',
          },
        ],
      },
      analysis: {
        keyFindings: ['Strong cultural adaptation', 'High satisfaction with support'],
        strengthsIdentified: ['Mentorship program', 'Team collaboration'],
        areasForImprovement: ['Data access speed', 'Healthcare domain training'],
        correlations: ['Mentorship quality correlates with adaptation speed'],
        recommendations: ['Continue mentorship program', 'Accelerate data access'],
        riskIndicators: ['None identified'],
      },
      actionsPlan: ['Improve data access process', 'Enhance healthcare training'],
      implementationStatus: 'in_progress',
    },
  ],
  
  status: 'integration',
  overallProgress: 67,
  projectedCompletionDate: '2025-04-15T00:00:00Z',
};
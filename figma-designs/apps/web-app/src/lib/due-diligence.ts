export interface DueDiligenceCheck {
  id: string;
  category: 'team_validation' | 'performance_verification' | 'cultural_assessment' | 'risk_evaluation' | 'integration_planning';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'requires_attention';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  dueDate?: string;
  completedDate?: string;
  evidence?: Evidence[];
  notes?: string;
  result?: 'pass' | 'fail' | 'conditional';
}

export interface Evidence {
  id: string;
  type: 'document' | 'reference' | 'interview' | 'assessment' | 'verification';
  title: string;
  description: string;
  uploadedBy: string;
  uploadedDate: string;
  verified: boolean;
  confidential: boolean;
}

export interface DueDiligenceWorkflow {
  id: string;
  teamId: string;
  opportunityId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  targetCompletionDate: string;
  completionDate?: string;
  overallScore?: number;
  riskLevel: 'low' | 'medium' | 'high';
  checks: DueDiligenceCheck[];
  keyFindings: string[];
  recommendations: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'conditional';
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  relationship: 'former_client' | 'current_client' | 'former_colleague' | 'former_manager' | 'peer';
  contactInfo: {
    email: string;
    phone?: string;
    linkedin?: string;
  };
  status: 'pending' | 'contacted' | 'responded' | 'verified';
  response?: ReferenceResponse;
}

export interface ReferenceResponse {
  overallRating: number; // 1-10
  workQuality: number;
  teamCollaboration: number;
  reliability: number;
  leadership: number;
  adaptability: number;
  technicalSkills: number;
  communicationSkills: number;
  strengths: string[];
  areasForImprovement: string[];
  specificExamples: string;
  wouldRecommend: boolean;
  additionalComments: string;
  verifiedBy: string;
  verificationDate: string;
}

export interface TeamPerformanceMetrics {
  revenueGenerated: number;
  clientRetentionRate: number;
  projectSuccessRate: number;
  timeToMarket: number;
  qualityMetrics: number;
  customerSatisfaction: number;
  teamProductivity: number;
  innovationIndex: number;
}

export interface CulturalAssessment {
  workStyle: 'autonomous' | 'collaborative' | 'directive' | 'consultative';
  communicationStyle: 'direct' | 'diplomatic' | 'analytical' | 'expressive';
  decisionMaking: 'consensus' | 'hierarchical' | 'consultative' | 'delegated';
  conflictResolution: 'direct_discussion' | 'mediation' | 'escalation' | 'avoidance';
  learningOrientation: 'high' | 'medium' | 'low';
  adaptability: 'high' | 'medium' | 'low';
  riskTolerance: 'high' | 'medium' | 'low';
  valuesAlignment: number; // 1-10
  cultureMatch: number; // 1-10
}

export interface RiskFactors {
  nonCompeteRestrictions: boolean;
  intellectualPropertyConcerns: boolean;
  clientFollowRisk: 'high' | 'medium' | 'low';
  reputationalRisk: 'high' | 'medium' | 'low';
  integrationComplexity: 'high' | 'medium' | 'low';
  keyPersonDependency: boolean;
  competitorResponse: 'likely' | 'possible' | 'unlikely';
  regulatoryConsiderations: string[];
  financialRisks: string[];
  operationalRisks: string[];
}

export interface IntegrationPlan {
  timelineWeeks: number;
  onboardingPhases: IntegrationPhase[];
  resourceRequirements: ResourceRequirement[];
  successMetrics: SuccessMetric[];
  riskMitigationStrategies: string[];
  communicationPlan: CommunicationPlan;
  retentionStrategy: RetentionStrategy;
}

export interface IntegrationPhase {
  phase: number;
  name: string;
  durationWeeks: number;
  objectives: string[];
  deliverables: string[];
  milestones: string[];
}

export interface ResourceRequirement {
  type: 'budget' | 'personnel' | 'technology' | 'space' | 'training';
  description: string;
  quantity: number;
  cost: number;
  timeline: string;
}

export interface SuccessMetric {
  metric: string;
  target: number;
  timeframe: string;
  measurement: string;
}

export interface CommunicationPlan {
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  channels: string[];
  stakeholders: string[];
  escalationPath: string[];
}

export interface RetentionStrategy {
  compensationAdjustments: boolean;
  careerDevelopmentPlans: boolean;
  equityParticipation: boolean;
  specialProjects: boolean;
  mentorshipPrograms: boolean;
  flexibilityOptions: string[];
}

export const defaultDueDiligenceChecks: Omit<DueDiligenceCheck, 'id' | 'status' | 'evidence'>[] = [
  // Team Validation
  {
    category: 'team_validation',
    title: 'Team Composition Verification',
    description: 'Verify team member roles, responsibilities, and working relationships',
    priority: 'high',
  },
  {
    category: 'team_validation',
    title: 'Years Working Together Validation',
    description: 'Confirm the duration and quality of team collaboration history',
    priority: 'high',
  },
  {
    category: 'team_validation',
    title: 'Current Employment Status Check',
    description: 'Verify current positions, notice periods, and availability',
    priority: 'high',
  },
  {
    category: 'team_validation',
    title: 'Skills and Expertise Assessment',
    description: 'Validate technical skills, certifications, and domain expertise',
    priority: 'medium',
  },

  // Performance Verification
  {
    category: 'performance_verification',
    title: 'Track Record Documentation',
    description: 'Gather and verify documented achievements and project outcomes',
    priority: 'high',
  },
  {
    category: 'performance_verification',
    title: 'Client Reference Checks',
    description: 'Contact current and former clients for performance feedback',
    priority: 'high',
  },
  {
    category: 'performance_verification',
    title: 'Quantitative Performance Metrics',
    description: 'Analyze revenue generation, client retention, and project success rates',
    priority: 'medium',
  },
  {
    category: 'performance_verification',
    title: 'Portfolio and Case Studies Review',
    description: 'Evaluate work samples, case studies, and project portfolios',
    priority: 'medium',
  },

  // Cultural Assessment
  {
    category: 'cultural_assessment',
    title: 'Values Alignment Assessment',
    description: 'Evaluate alignment between team and company values',
    priority: 'high',
  },
  {
    category: 'cultural_assessment',
    title: 'Work Style Compatibility',
    description: 'Assess team work style compatibility with company culture',
    priority: 'medium',
  },
  {
    category: 'cultural_assessment',
    title: 'Leadership and Team Dynamics',
    description: 'Evaluate internal team leadership and collaboration patterns',
    priority: 'medium',
  },
  {
    category: 'cultural_assessment',
    title: 'Communication and Collaboration Styles',
    description: 'Assess communication preferences and collaboration approaches',
    priority: 'low',
  },

  // Risk Evaluation
  {
    category: 'risk_evaluation',
    title: 'Non-Compete and Legal Restrictions',
    description: 'Review employment contracts and legal restrictions',
    priority: 'high',
  },
  {
    category: 'risk_evaluation',
    title: 'Intellectual Property Assessment',
    description: 'Evaluate IP ownership and potential conflicts',
    priority: 'high',
  },
  {
    category: 'risk_evaluation',
    title: 'Client Relationship Analysis',
    description: 'Assess client relationships and potential follow risks',
    priority: 'medium',
  },
  {
    category: 'risk_evaluation',
    title: 'Competitive Response Evaluation',
    description: 'Analyze potential competitor reactions and counter-moves',
    priority: 'medium',
  },

  // Integration Planning
  {
    category: 'integration_planning',
    title: 'Onboarding Timeline Development',
    description: 'Create detailed onboarding and integration timeline',
    priority: 'high',
  },
  {
    category: 'integration_planning',
    title: 'Resource Requirements Planning',
    description: 'Identify and plan for required resources and infrastructure',
    priority: 'high',
  },
  {
    category: 'integration_planning',
    title: 'Success Metrics Definition',
    description: 'Define measurable success criteria and KPIs',
    priority: 'medium',
  },
  {
    category: 'integration_planning',
    title: 'Retention Strategy Development',
    description: 'Develop strategies for long-term team retention',
    priority: 'medium',
  },
];

export function createDueDiligenceWorkflow(
  teamId: string,
  opportunityId: string,
  targetCompletionWeeks: number = 6
): DueDiligenceWorkflow {
  const startDate = new Date();
  const targetCompletionDate = new Date(startDate);
  targetCompletionDate.setDate(startDate.getDate() + (targetCompletionWeeks * 7));

  return {
    id: `dd-${Date.now()}`,
    teamId,
    opportunityId,
    status: 'not_started',
    startDate: startDate.toISOString(),
    targetCompletionDate: targetCompletionDate.toISOString(),
    riskLevel: 'medium',
    checks: defaultDueDiligenceChecks.map((check, index) => ({
      ...check,
      id: `check-${Date.now()}-${index}`,
      status: 'pending',
      evidence: [],
    })),
    keyFindings: [],
    recommendations: [],
    approvalStatus: 'pending',
  };
}

export function calculateWorkflowProgress(workflow: DueDiligenceWorkflow): {
  completedChecks: number;
  totalChecks: number;
  progressPercentage: number;
  highPriorityCompleted: number;
  highPriorityTotal: number;
} {
  const completedChecks = workflow.checks.filter(check => check.status === 'completed').length;
  const totalChecks = workflow.checks.length;
  const progressPercentage = Math.round((completedChecks / totalChecks) * 100);
  
  const highPriorityChecks = workflow.checks.filter(check => check.priority === 'high');
  const highPriorityCompleted = highPriorityChecks.filter(check => check.status === 'completed').length;
  const highPriorityTotal = highPriorityChecks.length;

  return {
    completedChecks,
    totalChecks,
    progressPercentage,
    highPriorityCompleted,
    highPriorityTotal,
  };
}

export function assessOverallRisk(workflow: DueDiligenceWorkflow): 'low' | 'medium' | 'high' {
  const failedChecks = workflow.checks.filter(check => check.result === 'fail');
  const highPriorityFailed = failedChecks.filter(check => check.priority === 'high');
  const requiresAttention = workflow.checks.filter(check => check.status === 'requires_attention');

  if (highPriorityFailed.length > 0 || requiresAttention.length > 3) {
    return 'high';
  }

  if (failedChecks.length > 2 || requiresAttention.length > 1) {
    return 'medium';
  }

  return 'low';
}

export function generateRecommendations(workflow: DueDiligenceWorkflow): string[] {
  const recommendations: string[] = [];
  const failedChecks = workflow.checks.filter(check => check.result === 'fail');
  const conditionalChecks = workflow.checks.filter(check => check.result === 'conditional');

  if (failedChecks.length === 0 && conditionalChecks.length <= 2) {
    recommendations.push('Proceed with liftout - team meets all critical criteria');
  }

  if (failedChecks.some(check => check.category === 'risk_evaluation')) {
    recommendations.push('Address legal and IP risks before proceeding');
  }

  if (failedChecks.some(check => check.category === 'cultural_assessment')) {
    recommendations.push('Implement enhanced cultural integration program');
  }

  if (conditionalChecks.some(check => check.category === 'performance_verification')) {
    recommendations.push('Request additional performance documentation');
  }

  if (workflow.checks.filter(check => check.category === 'integration_planning' && check.status !== 'completed').length > 0) {
    recommendations.push('Complete integration planning before team start date');
  }

  return recommendations;
}

// Mock data for demonstration
export const mockDueDiligenceWorkflow: DueDiligenceWorkflow = {
  id: 'dd-demo-001',
  teamId: 'team-goldman-analytics',
  opportunityId: 'opp-medtech-ai',
  status: 'in_progress',
  startDate: '2024-09-15T00:00:00Z',
  targetCompletionDate: '2024-10-27T00:00:00Z',
  riskLevel: 'medium',
  checks: defaultDueDiligenceChecks.map((check, index) => ({
    ...check,
    id: `check-demo-${index}`,
    status: index < 8 ? 'completed' : index < 12 ? 'in_progress' : 'pending',
    result: index < 6 ? 'pass' : index < 8 ? 'conditional' : undefined,
    completedDate: index < 8 ? '2024-09-20T00:00:00Z' : undefined,
    evidence: index < 8 ? [{
      id: `evidence-${index}`,
      type: 'document',
      title: 'Supporting Documentation',
      description: 'Verification documents and references',
      uploadedBy: 'Due Diligence Team',
      uploadedDate: '2024-09-20T00:00:00Z',
      verified: true,
      confidential: false,
    }] : [],
  })),
  keyFindings: [
    'Team has strong 3.5-year collaboration history with documented success',
    'Exceptional client retention rate of 94% over last 2 years',
    'Some non-compete restrictions require 90-day notice period',
    'Strong cultural alignment with innovation-focused environment',
  ],
  recommendations: [
    'Proceed with offer pending completion of legal risk assessment',
    'Plan for 90-day transition period due to non-compete clauses',
    'Implement accelerated onboarding program for Q1 2025 start',
  ],
  approvalStatus: 'pending',
};
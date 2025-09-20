export interface NegotiationDeal {
  id: string;
  teamId: string;
  opportunityId: string;
  status: 'initiating' | 'term_sheet_draft' | 'negotiating' | 'legal_review' | 'finalized' | 'cancelled' | 'executed';
  priority: 'high' | 'medium' | 'low';
  createdDate: string;
  lastUpdated: string;
  targetCloseDate: string;
  actualCloseDate?: string;
  
  // Parties involved
  companyRepresentatives: NegotiationParty[];
  teamRepresentatives: NegotiationParty[];
  legalRepresentatives: LegalRepresentative[];
  
  // Deal terms
  currentTermSheet: TermSheet;
  termSheetHistory: TermSheetVersion[];
  
  // Negotiation process
  negotiationRounds: NegotiationRound[];
  currentRound: number;
  
  // Legal and compliance
  legalConsiderations: LegalConsideration[];
  complianceChecks: ComplianceCheck[];
  
  // Integration planning
  integrationPlan: IntegrationPlan;
  
  // Documents and contracts
  documents: NegotiationDocument[];
  finalContracts: Contract[];
}

export interface NegotiationParty {
  id: string;
  name: string;
  title: string;
  company: string;
  role: 'lead_negotiator' | 'decision_maker' | 'advisor' | 'team_member';
  contactInfo: {
    email: string;
    phone?: string;
  };
  authority: 'full' | 'limited' | 'advisory';
}

export interface LegalRepresentative {
  id: string;
  name: string;
  firm: string;
  specialization: string[];
  contactInfo: {
    email: string;
    phone?: string;
  };
  representing: 'company' | 'team';
}

export interface TermSheet {
  id: string;
  version: number;
  createdDate: string;
  createdBy: string;
  status: 'draft' | 'proposed' | 'under_review' | 'accepted' | 'rejected' | 'countered';
  
  // Compensation structure
  compensation: CompensationTerms;
  
  // Employment terms
  employment: EmploymentTerms;
  
  // Integration and transition
  transition: TransitionTerms;
  
  // Legal and IP
  legal: LegalTerms;
  
  // Performance and retention
  performance: PerformanceTerms;
  
  // Other considerations
  additionalTerms: AdditionalTerm[];
}

export interface CompensationTerms {
  // Base compensation
  baseSalaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Equity and incentives
  equityPackage?: {
    type: 'stock_options' | 'restricted_stock' | 'phantom_equity';
    percentage?: number;
    vestingSchedule: string;
    cliffPeriod?: number;
  };
  
  // Bonuses and incentives
  signingBonus?: number;
  performanceBonus?: {
    target: number;
    maximum: number;
    metrics: string[];
  };
  
  // Benefits
  benefits: {
    healthInsurance: boolean;
    retirement401k: boolean;
    vacationDays: number;
    professionalDevelopment: number;
  };
  
  // Total package value
  totalPackageEstimate: {
    year1: number;
    year2: number;
    year3: number;
  };
}

export interface EmploymentTerms {
  startDate: string;
  noticePeriod: number; // days
  probationPeriod?: number; // days
  workLocation: 'remote' | 'hybrid' | 'onsite';
  
  // Reporting structure
  reportingManager: string;
  teamStructure: string;
  
  // Responsibilities
  roleDefinitions: TeamMemberRole[];
  keyResponsibilities: string[];
  successMetrics: string[];
}

export interface TeamMemberRole {
  memberId: string;
  name: string;
  title: string;
  level: string;
  responsibilities: string[];
  reportingTo?: string;
}

export interface TransitionTerms {
  // Timeline
  transitionPeriod: number; // weeks
  onboardingSchedule: OnboardingPhase[];
  
  // Current employer
  currentEmployerNotice: number; // days
  nonCompeteWaiver?: boolean;
  clientTransition: {
    allowed: boolean;
    restrictions: string[];
    timeline?: number;
  };
  
  // Support during transition
  relocationSupport?: {
    provided: boolean;
    allowance?: number;
    timeline?: number;
  };
  
  temporaryHousing?: {
    provided: boolean;
    duration?: number;
  };
}

export interface OnboardingPhase {
  phase: number;
  name: string;
  duration: number; // days
  objectives: string[];
  milestones: string[];
  support: string[];
}

export interface LegalTerms {
  // Intellectual property
  ipAssignment: boolean;
  ipDisclosures: string[];
  
  // Non-compete and restrictions
  nonCompete: {
    required: boolean;
    duration?: number; // months
    geographic?: string;
    scope?: string[];
  };
  
  nonSolicitation: {
    required: boolean;
    duration?: number; // months
    scope?: string[];
  };
  
  // Confidentiality
  nda: {
    required: boolean;
    duration?: string;
    scope: string[];
  };
  
  // Employment at will
  atWillEmployment: boolean;
  severanceTerms?: SeveranceTerms;
}

export interface SeveranceTerms {
  noticePeriod: number; // weeks
  severancePay: number; // weeks of salary
  benefitsContinuation: number; // months
  conditions: string[];
}

export interface PerformanceTerms {
  reviewCycle: 'quarterly' | 'semi-annual' | 'annual';
  performanceMetrics: PerformanceMetric[];
  retentionIncentives: RetentionIncentive[];
  careerDevelopment: CareerDevelopmentPlan;
}

export interface PerformanceMetric {
  metric: string;
  target: string;
  measurement: string;
  timeline: string;
  weight: number; // percentage
}

export interface RetentionIncentive {
  type: 'bonus' | 'equity' | 'promotion' | 'development';
  description: string;
  timeline: string;
  conditions: string[];
}

export interface CareerDevelopmentPlan {
  mentorship: boolean;
  trainingBudget?: number;
  conferenceAllowance?: number;
  internalMobility: boolean;
  leadershipTrack?: boolean;
}

export interface AdditionalTerm {
  category: string;
  description: string;
  negotiable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface TermSheetVersion {
  termSheet: TermSheet;
  changesSummary: string[];
  previousVersion?: number;
  approvalStatus: {
    company: 'pending' | 'approved' | 'rejected';
    team: 'pending' | 'approved' | 'rejected';
    legal: 'pending' | 'approved' | 'rejected';
  };
}

export interface NegotiationRound {
  round: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'stalled';
  
  // Proposals and counterproposals
  proposals: NegotiationProposal[];
  
  // Meetings and communications
  meetings: NegotiationMeeting[];
  communications: NegotiationCommunication[];
  
  // Outcomes
  decisions: NegotiationDecision[];
  nextSteps: string[];
}

export interface NegotiationProposal {
  id: string;
  proposedBy: 'company' | 'team';
  proposalDate: string;
  termSheetId: string;
  summary: string;
  keyChanges: string[];
  rationale: string;
  responseBy?: string;
  response?: NegotiationResponse;
}

export interface NegotiationResponse {
  respondedBy: 'company' | 'team';
  responseDate: string;
  type: 'accept' | 'reject' | 'counter' | 'request_clarification';
  feedback: string;
  counterProposalId?: string;
}

export interface NegotiationMeeting {
  id: string;
  date: string;
  duration: number; // minutes
  type: 'video_call' | 'in_person' | 'phone_call';
  attendees: string[];
  agenda: string[];
  outcomes: string[];
  nextMeeting?: string;
}

export interface NegotiationCommunication {
  id: string;
  date: string;
  type: 'email' | 'document' | 'formal_notice';
  from: string;
  to: string[];
  subject: string;
  summary: string;
  actionRequired?: boolean;
  followUpBy?: string;
}

export interface NegotiationDecision {
  id: string;
  date: string;
  decision: string;
  decisionMaker: string;
  rationale: string;
  impact: string[];
  nextActions: string[];
}

export interface LegalConsideration {
  id: string;
  category: 'employment_law' | 'intellectual_property' | 'non_compete' | 'regulatory' | 'tax';
  description: string;
  jurisdiction: string;
  riskLevel: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'identified' | 'under_review' | 'resolved' | 'requires_action';
  assignedTo?: string;
}

export interface ComplianceCheck {
  id: string;
  requirement: string;
  description: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'non_applicable';
  evidence?: string[];
  verifiedBy?: string;
  verificationDate?: string;
}

export interface IntegrationPlan {
  id: string;
  overallTimeline: number; // weeks
  phases: IntegrationPhase[];
  resourceRequirements: ResourceRequirement[];
  successMetrics: IntegrationMetric[];
  riskMitigation: RiskMitigationStrategy[];
  communicationPlan: CommunicationStrategy;
}

export interface IntegrationPhase {
  phase: number;
  name: string;
  startWeek: number;
  duration: number; // weeks
  objectives: string[];
  deliverables: string[];
  milestones: Milestone[];
  dependencies: string[];
}

export interface Milestone {
  name: string;
  targetDate: string;
  criteria: string[];
  owner: string;
}

export interface ResourceRequirement {
  type: 'personnel' | 'technology' | 'office_space' | 'budget' | 'training';
  description: string;
  quantity?: number;
  cost?: number;
  timeline: string;
  responsible: string;
}

export interface IntegrationMetric {
  metric: string;
  target: string;
  measurement: string;
  frequency: string;
  owner: string;
}

export interface RiskMitigationStrategy {
  risk: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  contingency: string;
  owner: string;
}

export interface CommunicationStrategy {
  stakeholders: Stakeholder[];
  channels: CommunicationChannel[];
  frequency: string;
  escalationPath: string[];
}

export interface Stakeholder {
  name: string;
  role: string;
  involvement: 'primary' | 'secondary' | 'informed';
  contactInfo: string;
}

export interface CommunicationChannel {
  type: 'email' | 'slack' | 'meetings' | 'dashboard';
  purpose: string;
  frequency: string;
  participants: string[];
}

export interface NegotiationDocument {
  id: string;
  type: 'term_sheet' | 'nda' | 'letter_of_intent' | 'employment_contract' | 'legal_memo' | 'compliance_doc';
  title: string;
  description: string;
  uploadedBy: string;
  uploadedDate: string;
  version: number;
  status: 'draft' | 'review' | 'approved' | 'signed';
  confidential: boolean;
  accessLevel: 'public' | 'parties_only' | 'legal_only';
}

export interface Contract {
  id: string;
  type: 'employment_agreement' | 'non_compete' | 'nda' | 'intellectual_property';
  title: string;
  parties: string[];
  effectiveDate: string;
  expirationDate?: string;
  status: 'draft' | 'under_review' | 'executed' | 'terminated';
  signedBy: ContractSignature[];
  terms: string[];
}

export interface ContractSignature {
  party: string;
  signedBy: string;
  signedDate: string;
  method: 'electronic' | 'wet_signature' | 'docusign';
}

// Utility functions
export function calculateNegotiationProgress(deal: NegotiationDeal): {
  overallProgress: number;
  currentStage: string;
  completedRounds: number;
  daysToTarget: number;
} {
  const stages = ['initiating', 'term_sheet_draft', 'negotiating', 'legal_review', 'finalized'];
  const currentStageIndex = stages.indexOf(deal.status);
  const overallProgress = Math.round(((currentStageIndex + 1) / stages.length) * 100);
  
  const targetDate = new Date(deal.targetCloseDate);
  const today = new Date();
  const daysToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    overallProgress,
    currentStage: deal.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    completedRounds: deal.negotiationRounds.filter(r => r.status === 'completed').length,
    daysToTarget,
  };
}

export function assessDealRisk(deal: NegotiationDeal): 'low' | 'medium' | 'high' {
  let riskScore = 0;
  
  // Timeline risk
  const progress = calculateNegotiationProgress(deal);
  if (progress.daysToTarget < 7) riskScore += 2;
  else if (progress.daysToTarget < 14) riskScore += 1;
  
  // Legal risks
  const highRiskLegal = deal.legalConsiderations.filter(l => l.riskLevel === 'high').length;
  riskScore += highRiskLegal;
  
  // Negotiation rounds
  if (deal.currentRound > 5) riskScore += 2;
  else if (deal.currentRound > 3) riskScore += 1;
  
  // Stalled rounds
  const stalledRounds = deal.negotiationRounds.filter(r => r.status === 'stalled').length;
  riskScore += stalledRounds;
  
  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}

export function generateNegotiationTimeline(deal: NegotiationDeal): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  
  // Add deal creation
  events.push({
    date: deal.createdDate,
    type: 'milestone',
    title: 'Negotiation Initiated',
    description: 'Due diligence completed, negotiation process began',
  });
  
  // Add term sheet versions
  deal.termSheetHistory.forEach((version, index) => {
    events.push({
      date: version.termSheet.createdDate,
      type: 'document',
      title: `Term Sheet v${version.termSheet.version}`,
      description: version.changesSummary.join(', '),
    });
  });
  
  // Add negotiation rounds
  deal.negotiationRounds.forEach(round => {
    events.push({
      date: round.startDate,
      type: 'meeting',
      title: `Negotiation Round ${round.round}`,
      description: `${round.proposals.length} proposals, ${round.meetings.length} meetings`,
    });
  });
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export interface TimelineEvent {
  date: string;
  type: 'milestone' | 'document' | 'meeting' | 'decision';
  title: string;
  description: string;
}

// Mock data for demonstration
export const mockNegotiationDeal: NegotiationDeal = {
  id: 'neg-001',
  teamId: 'team-goldman-analytics',
  opportunityId: 'opp-medtech-ai',
  status: 'negotiating',
  priority: 'high',
  createdDate: '2024-09-22T00:00:00Z',
  lastUpdated: '2024-09-25T00:00:00Z',
  targetCloseDate: '2024-10-15T00:00:00Z',
  
  companyRepresentatives: [
    {
      id: 'comp-rep-001',
      name: 'Jennifer Walsh',
      title: 'VP of Talent Acquisition',
      company: 'MedTech Innovations',
      role: 'lead_negotiator',
      contactInfo: { email: 'j.walsh@medtech.com', phone: '+1 (617) 555-0123' },
      authority: 'full',
    },
    {
      id: 'comp-rep-002',
      name: 'David Kim',
      title: 'Chief Technology Officer',
      company: 'MedTech Innovations',
      role: 'decision_maker',
      contactInfo: { email: 'd.kim@medtech.com' },
      authority: 'full',
    },
  ],
  
  teamRepresentatives: [
    {
      id: 'team-rep-001',
      name: 'Alex Thompson',
      title: 'Team Lead',
      company: 'Goldman Sachs',
      role: 'lead_negotiator',
      contactInfo: { email: 'alex.thompson@gs.com', phone: '+1 (212) 555-0456' },
      authority: 'full',
    },
  ],
  
  legalRepresentatives: [
    {
      id: 'legal-001',
      name: 'Sarah Mitchell',
      firm: 'Cooley LLP',
      specialization: ['Employment Law', 'Corporate Transactions'],
      contactInfo: { email: 's.mitchell@cooley.com' },
      representing: 'company',
    },
  ],
  
  currentTermSheet: {
    id: 'ts-003',
    version: 3,
    createdDate: '2024-09-25T00:00:00Z',
    createdBy: 'Jennifer Walsh',
    status: 'under_review',
    
    compensation: {
      baseSalaryRange: { min: 220000, max: 280000, currency: 'USD' },
      equityPackage: {
        type: 'stock_options',
        percentage: 0.5,
        vestingSchedule: '4 years with 1 year cliff',
        cliffPeriod: 12,
      },
      signingBonus: 50000,
      performanceBonus: {
        target: 40000,
        maximum: 80000,
        metrics: ['Team performance', 'Product delivery', 'Client satisfaction'],
      },
      benefits: {
        healthInsurance: true,
        retirement401k: true,
        vacationDays: 25,
        professionalDevelopment: 5000,
      },
      totalPackageEstimate: {
        year1: 340000,
        year2: 320000,
        year3: 350000,
      },
    },
    
    employment: {
      startDate: '2025-01-15T00:00:00Z',
      noticePeriod: 90,
      workLocation: 'hybrid',
      reportingManager: 'David Kim, CTO',
      teamStructure: 'Dedicated Healthcare AI division',
      roleDefinitions: [
        {
          memberId: 'alex-thompson',
          name: 'Alex Thompson',
          title: 'Director of AI Strategy',
          level: 'Senior Director',
          responsibilities: ['Strategic AI initiatives', 'Team leadership', 'Client relationships'],
        },
      ],
      keyResponsibilities: ['Lead healthcare AI strategy', 'Build high-performing team', 'Drive innovation'],
      successMetrics: ['Team performance rating > 4.5/5', 'Product delivery on time', '95% client satisfaction'],
    },
    
    transition: {
      transitionPeriod: 12,
      onboardingSchedule: [
        {
          phase: 1,
          name: 'Orientation & Setup',
          duration: 5,
          objectives: ['Complete onboarding', 'Set up workspace', 'Meet key stakeholders'],
          milestones: ['All paperwork completed', 'Workspace ready', 'Introduction meetings done'],
          support: ['HR liaison', 'IT setup', 'Buddy system'],
        },
      ],
      currentEmployerNotice: 90,
      nonCompeteWaiver: true,
      clientTransition: {
        allowed: true,
        restrictions: ['No direct solicitation for 6 months'],
        timeline: 6,
      },
      relocationSupport: {
        provided: true,
        allowance: 25000,
        timeline: 90,
      },
    },
    
    legal: {
      ipAssignment: true,
      ipDisclosures: ['Previous work at Goldman Sachs', 'Personal projects'],
      nonCompete: {
        required: false,
        duration: 0,
      },
      nonSolicitation: {
        required: true,
        duration: 12,
        scope: ['Former Goldman Sachs colleagues'],
      },
      nda: {
        required: true,
        duration: 'Indefinite',
        scope: ['Company proprietary information', 'Client data', 'Strategic plans'],
      },
      atWillEmployment: true,
      severanceTerms: {
        noticePeriod: 8,
        severancePay: 16,
        benefitsContinuation: 6,
        conditions: ['Company-initiated termination without cause'],
      },
    },
    
    performance: {
      reviewCycle: 'quarterly',
      performanceMetrics: [
        {
          metric: 'Team Performance Rating',
          target: '4.5/5',
          measurement: '360-degree feedback',
          timeline: 'Quarterly',
          weight: 30,
        },
      ],
      retentionIncentives: [
        {
          type: 'equity',
          description: 'Additional equity grant after 2 years',
          timeline: '24 months',
          conditions: ['Performance rating > 4.0', 'Team retention > 90%'],
        },
      ],
      careerDevelopment: {
        mentorship: true,
        trainingBudget: 10000,
        conferenceAllowance: 5000,
        internalMobility: true,
        leadershipTrack: true,
      },
    },
    
    additionalTerms: [
      {
        category: 'Flexibility',
        description: 'Remote work 2 days per week',
        negotiable: true,
        priority: 'medium',
      },
    ],
  },
  
  termSheetHistory: [],
  negotiationRounds: [
    {
      round: 1,
      startDate: '2024-09-22T00:00:00Z',
      endDate: '2024-09-23T00:00:00Z',
      status: 'completed',
      proposals: [
        {
          id: 'prop-001',
          proposedBy: 'company',
          proposalDate: '2024-09-22T00:00:00Z',
          termSheetId: 'ts-001',
          summary: 'Initial term sheet proposal',
          keyChanges: ['Base salary $200-250k', 'Standard equity package', '2 weeks vacation'],
          rationale: 'Market-competitive offer aligned with company standards',
        },
      ],
      meetings: [
        {
          id: 'meet-001',
          date: '2024-09-23T00:00:00Z',
          duration: 90,
          type: 'video_call',
          attendees: ['Jennifer Walsh', 'Alex Thompson', 'David Kim'],
          agenda: ['Review initial proposal', 'Discuss compensation expectations', 'Timeline planning'],
          outcomes: ['Team requested higher base salary', 'Equity discussions tabled', 'Agreement on start date'],
        },
      ],
      communications: [],
      decisions: [
        {
          id: 'dec-001',
          date: '2024-09-23T00:00:00Z',
          decision: 'Revise compensation package',
          decisionMaker: 'Jennifer Walsh',
          rationale: 'Team expectations above initial offer',
          impact: ['Higher budget approval needed', 'Revised term sheet required'],
          nextActions: ['Get executive approval', 'Prepare counter-proposal'],
        },
      ],
      nextSteps: ['Prepare revised term sheet', 'Schedule follow-up meeting'],
    },
  ],
  currentRound: 3,
  
  legalConsiderations: [
    {
      id: 'legal-001',
      category: 'non_compete',
      description: 'Goldman Sachs non-compete clause review',
      jurisdiction: 'New York',
      riskLevel: 'medium',
      mitigation: 'Legal review confirmed no conflicts with healthcare AI work',
      status: 'resolved',
    },
  ],
  
  complianceChecks: [
    {
      id: 'comp-001',
      requirement: 'Background check completion',
      description: 'Standard background verification for all team members',
      status: 'completed',
      verifiedBy: 'HR Department',
      verificationDate: '2024-09-24T00:00:00Z',
    },
  ],
  
  integrationPlan: {
    id: 'int-001',
    overallTimeline: 16,
    phases: [
      {
        phase: 1,
        name: 'Onboarding & Setup',
        startWeek: 1,
        duration: 4,
        objectives: ['Complete team onboarding', 'Establish workspace', 'Initial training'],
        deliverables: ['Onboarding completion certificates', 'Workspace setup', 'Training records'],
        milestones: [
          {
            name: 'All team members onboarded',
            targetDate: '2025-02-15T00:00:00Z',
            criteria: ['HR paperwork complete', 'IT setup done', 'Office space assigned'],
            owner: 'Jennifer Walsh',
          },
        ],
        dependencies: ['Signed contracts', 'Background checks cleared'],
      },
    ],
    resourceRequirements: [
      {
        type: 'office_space',
        description: 'Dedicated team workspace in Boston office',
        timeline: 'Before start date',
        responsible: 'Facilities Manager',
      },
    ],
    successMetrics: [
      {
        metric: 'Team productivity',
        target: '100% within 90 days',
        measurement: 'Performance review scores',
        frequency: 'Monthly',
        owner: 'David Kim',
      },
    ],
    riskMitigation: [
      {
        risk: 'Key team member decides not to join',
        probability: 'low',
        impact: 'high',
        mitigation: 'Individual retention conversations',
        contingency: 'Alternative team member identified',
        owner: 'Alex Thompson',
      },
    ],
    communicationPlan: {
      stakeholders: [
        {
          name: 'Executive Team',
          role: 'Strategic oversight',
          involvement: 'informed',
          contactInfo: 'exec-team@medtech.com',
        },
      ],
      channels: [
        {
          type: 'email',
          purpose: 'Weekly updates',
          frequency: 'Weekly',
          participants: ['Jennifer Walsh', 'David Kim', 'Alex Thompson'],
        },
      ],
      frequency: 'Weekly during transition',
      escalationPath: ['David Kim', 'CEO'],
    },
  },
  
  documents: [
    {
      id: 'doc-001',
      type: 'term_sheet',
      title: 'Term Sheet v3.0',
      description: 'Latest term sheet incorporating team feedback',
      uploadedBy: 'Jennifer Walsh',
      uploadedDate: '2024-09-25T00:00:00Z',
      version: 3,
      status: 'review',
      confidential: true,
      accessLevel: 'parties_only',
    },
  ],
  
  finalContracts: [],
};
export interface LegalDocument {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  template: DocumentTemplate;
  status: 'draft' | 'review' | 'approved' | 'executed' | 'expired';
  
  // Document metadata
  createdDate: Date;
  lastModified: Date;
  version: number;
  jurisdiction: string;
  
  // Parties involved
  parties: ContractParty[];
  
  // Legal review
  reviewers: LegalReviewer[];
  approvals: DocumentApproval[];
  
  // Compliance tracking
  complianceChecks: ComplianceCheck[];
  riskAssessment: LegalRiskAssessment;
  
  // Generated content
  generatedContent?: string;
  variables: Record<string, any>;
}

export type DocumentType = 
  | 'employment_agreement'
  | 'non_disclosure_agreement'
  | 'non_compete_waiver'
  | 'team_liftout_agreement'
  | 'compensation_agreement'
  | 'intellectual_property_assignment'
  | 'garden_leave_agreement'
  | 'retention_bonus_agreement'
  | 'consulting_transition_agreement'
  | 'settlement_agreement';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  jurisdiction: string;
  lastUpdated: Date;
  
  // Template structure
  sections: TemplateSection[];
  variables: TemplateVariable[];
  
  // Legal validation
  legalReview: {
    reviewedBy: string;
    reviewDate: Date;
    nextReviewDue: Date;
    complianceNotes: string[];
  };
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  conditional?: {
    field: string;
    value: any;
  };
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'currency';
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface ContractParty {
  id: string;
  role: 'hiring_company' | 'departing_company' | 'team_member' | 'legal_counsel';
  
  // Entity details
  name: string;
  entityType: 'individual' | 'corporation' | 'llc' | 'partnership';
  address: Address;
  
  // Legal representation
  legalCounsel?: {
    firmName: string;
    attorneyName: string;
    contactInfo: ContactInfo;
  };
  
  // Signing authority
  signatory: {
    name: string;
    title: string;
    authorityLevel: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: Address;
}

export interface LegalReviewer {
  id: string;
  name: string;
  role: 'internal_counsel' | 'external_counsel' | 'compliance_officer' | 'partner';
  firmName?: string;
  jurisdiction: string;
  
  // Review assignment
  assignedDate: Date;
  dueDate: Date;
  status: 'pending' | 'in_review' | 'completed' | 'escalated';
  
  // Review results
  feedback?: string[];
  recommendations?: string[];
  approvalStatus?: 'approved' | 'approved_with_changes' | 'rejected';
}

export interface DocumentApproval {
  id: string;
  reviewerId: string;
  approvalDate: Date;
  status: 'approved' | 'approved_with_conditions' | 'rejected';
  comments: string;
  conditions?: string[];
}

export interface ComplianceCheck {
  id: string;
  category: ComplianceCategory;
  jurisdiction: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable';
  
  // Check details
  checkDate: Date;
  checkedBy: string;
  evidence?: string[];
  remediation?: string[];
  
  // Risk assessment
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
}

export type ComplianceCategory = 
  | 'employment_law'
  | 'non_compete_restrictions'
  | 'trade_secrets'
  | 'data_protection'
  | 'securities_law'
  | 'antitrust'
  | 'immigration'
  | 'tax_implications'
  | 'industry_regulations';

export interface LegalRiskAssessment {
  id: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  
  // Risk categories
  risks: LegalRisk[];
  
  // Mitigation strategies
  mitigationPlan: MitigationStrategy[];
  
  // Insurance considerations
  insuranceRecommendations: string[];
  
  // Assessment metadata
  assessedBy: string;
  assessmentDate: Date;
  nextReviewDate: Date;
}

export interface LegalRisk {
  id: string;
  category: ComplianceCategory;
  description: string;
  likelihood: number; // 0-100
  impact: number; // 0-100
  riskScore: number; // calculated: likelihood * impact / 100
  
  // Risk details
  jurisdiction: string;
  precedents?: string[];
  mitigationStatus: 'unaddressed' | 'in_progress' | 'mitigated' | 'accepted';
}

export interface MitigationStrategy {
  id: string;
  riskId: string;
  strategy: string;
  implementation: string;
  timeline: string;
  responsible: string;
  cost?: number;
  effectiveness: number; // 0-100, expected risk reduction
}

export interface NonCompeteAnalysis {
  id: string;
  teamMemberId: string;
  currentEmployer: string;
  
  // Non-compete terms
  hasNonCompete: boolean;
  nonCompeteTerms?: {
    duration: number; // months
    geographicScope: string;
    industryScope: string[];
    customerRestrictions: string;
    compensation?: number; // garden leave pay
  };
  
  // Legal analysis
  enforceability: {
    jurisdiction: string;
    enforcementLikelihood: number; // 0-100
    factors: EnforceabilityFactor[];
    recommendations: string[];
  };
  
  // Risk assessment
  violationRisk: 'low' | 'medium' | 'high' | 'prohibitive';
  legalCosts: {
    defenseCosts: number;
    settlementRange: { min: number; max: number };
    businessDisruption: string;
  };
  
  // Mitigation options
  mitigationOptions: NonCompeteMitigation[];
}

export interface EnforceabilityFactor {
  factor: string;
  impact: 'strengthens' | 'weakens' | 'neutral';
  description: string;
  weight: number; // 0-10, importance
}

export interface NonCompeteMitigation {
  id: string;
  strategy: 'garden_leave' | 'role_modification' | 'geographic_separation' | 'industry_change' | 'negotiated_release' | 'challenge_enforceability';
  description: string;
  cost: number;
  timeline: string;
  successProbability: number; // 0-100
  legalRequirements: string[];
}

export interface JurisdictionCompliance {
  jurisdiction: string;
  country: string;
  state?: string;
  
  // Employment law requirements
  employmentLaws: {
    noticeRequirements: number; // days
    gardenLeaveRules: string;
    nonCompeteEnforcement: 'strong' | 'moderate' | 'weak' | 'prohibited';
    tradSecretProtection: string;
  };
  
  // Regulatory considerations
  regulations: {
    dataProtection: string[];
    securities: string[];
    antitrust: string[];
    immigration: string[];
    industrySpecific: string[];
  };
  
  // Documentation requirements
  requiredDocuments: string[];
  notificationRequirements: string[];
  filingRequirements: string[];
}

// Legal template generation functions

export function generateEmploymentAgreement(variables: Record<string, any>): string {
  return `
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on ${variables.startDate} between ${variables.companyName}, a ${variables.companyState} corporation ("Company"), and ${variables.employeeName} ("Employee").

1. POSITION AND DUTIES
Employee will serve as ${variables.position} reporting to ${variables.supervisor}. Employee agrees to devote their full business time and attention to the Company's business.

2. COMPENSATION
Base Salary: $${variables.baseSalary.toLocaleString()} annually
Bonus Target: ${variables.bonusTarget}% of base salary
Equity Grant: ${variables.equityShares} shares vesting over ${variables.vestingPeriod} years

3. BENEFITS
Employee will be eligible for Company's standard benefits package including:
- Health, dental, and vision insurance
- 401(k) with company matching
- ${variables.vacationDays} days paid vacation annually
- Professional development budget: $${variables.developmentBudget}

4. CONFIDENTIALITY AND NON-COMPETE
Employee acknowledges access to Company's confidential information and agrees to:
- Maintain strict confidentiality of all proprietary information
- ${variables.hasNonCompete ? `Non-compete restrictions for ${variables.nonCompetePeriod} months post-termination` : 'No non-compete restrictions apply'}
- Assignment of work-related intellectual property to Company

5. TERMINATION
Either party may terminate this agreement with ${variables.terminationNotice} days written notice.
Severance: ${variables.severanceWeeks} weeks base salary if terminated without cause.

6. GOVERNING LAW
This Agreement shall be governed by the laws of ${variables.jurisdiction}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

${variables.companyName}                    ${variables.employeeName}

By: _____________________              _____________________
${variables.companySignatory}                    Employee
${variables.signatoryTitle}

Date: ___________________              Date: ___________________
`;
}

export function generateNDATemplate(variables: Record<string, any>): string {
  return `
MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on ${variables.date} between ${variables.party1Name} ("Party 1") and ${variables.party2Name} ("Party 2").

RECITALS
The parties wish to explore potential business opportunities and may disclose confidential information to each other.

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" includes all non-public information disclosed by either party, including but not limited to:
- Business plans and strategies
- Financial information and projections
- Customer lists and contact information
- Proprietary technology and processes
- Employee information and compensation data
- Trade secrets and know-how

2. OBLIGATIONS
Each party agrees to:
- Hold all Confidential Information in strict confidence
- Use Confidential Information solely for evaluation purposes
- Not disclose Confidential Information to third parties without written consent
- Return or destroy all Confidential Information upon request

3. EXCEPTIONS
Obligations do not apply to information that:
- Is or becomes publicly available through no breach of this Agreement
- Was known prior to disclosure
- Is independently developed without use of Confidential Information
- Is required to be disclosed by law or court order

4. TERM
This Agreement remains in effect for ${variables.duration} years from the date signed.

5. REMEDIES
Breach may cause irreparable harm warranting injunctive relief in addition to monetary damages.

6. GOVERNING LAW
Governed by the laws of ${variables.jurisdiction}.

${variables.party1Name}                    ${variables.party2Name}

By: _____________________              By: _____________________
${variables.party1Signatory}                  ${variables.party2Signatory}
${variables.party1Title}                      ${variables.party2Title}

Date: ___________________              Date: ___________________
`;
}

export function analyzeNonCompeteEnforcement(terms: any, jurisdiction: string): NonCompeteAnalysis {
  const jurisdictionFactors = getJurisdictionFactors(jurisdiction);
  
  // Calculate enforceability score
  let enforcementScore = 50; // base score
  
  // Duration factor
  if (terms.duration <= 6) enforcementScore += 20;
  else if (terms.duration <= 12) enforcementScore += 10;
  else if (terms.duration > 24) enforcementScore -= 30;
  
  // Geographic scope factor
  if (terms.geographicScope === 'worldwide') enforcementScore -= 25;
  else if (terms.geographicScope.includes('state')) enforcementScore += 10;
  else if (terms.geographicScope.includes('city')) enforcementScore += 15;
  
  // Compensation factor
  if (terms.compensation > 0) enforcementScore += 15;
  
  // Industry scope factor
  if (terms.industryScope.length > 5) enforcementScore -= 15;
  else if (terms.industryScope.length <= 2) enforcementScore += 10;
  
  // Jurisdiction-specific adjustments
  enforcementScore += jurisdictionFactors.baseEnforcement;
  
  const factors: EnforceabilityFactor[] = [
    {
      factor: 'Duration Reasonableness',
      impact: terms.duration <= 12 ? 'strengthens' : 'weakens',
      description: `${terms.duration} month restriction is ${terms.duration <= 12 ? 'reasonable' : 'potentially excessive'}`,
      weight: 9
    },
    {
      factor: 'Geographic Scope',
      impact: terms.geographicScope === 'worldwide' ? 'weakens' : 'strengthens',
      description: `${terms.geographicScope} scope is ${terms.geographicScope === 'worldwide' ? 'overly broad' : 'reasonable'}`,
      weight: 8
    },
    {
      factor: 'Consideration',
      impact: terms.compensation > 0 ? 'strengthens' : 'weakens',
      description: terms.compensation > 0 ? 'Garden leave compensation provided' : 'No consideration for restriction',
      weight: 7
    }
  ];

  return {
    id: `analysis-${Date.now()}`,
    teamMemberId: terms.teamMemberId,
    currentEmployer: terms.currentEmployer,
    hasNonCompete: true,
    nonCompeteTerms: terms,
    enforceability: {
      jurisdiction,
      enforcementLikelihood: Math.min(95, Math.max(5, enforcementScore)),
      factors,
      recommendations: generateEnforcementRecommendations(enforcementScore, terms)
    },
    violationRisk: determineViolationRisk(enforcementScore),
    legalCosts: {
      defenseCosts: 150000,
      settlementRange: { min: 25000, max: 500000 },
      businessDisruption: 'Potential 6-12 month litigation timeline with temporary restraining order risk'
    },
    mitigationOptions: generateMitigationOptions(terms, enforcementScore)
  };
}

function getJurisdictionFactors(jurisdiction: string): { baseEnforcement: number } {
  const jurisdictionMap: Record<string, number> = {
    'California': -40, // Very weak non-compete enforcement
    'New York': 10,   // Moderate enforcement
    'Delaware': 15,   // Business-friendly
    'Texas': 5,       // Moderate enforcement
    'Florida': 20,    // Strong enforcement
    'Illinois': 0,    // Balanced approach
  };
  
  return {
    baseEnforcement: jurisdictionMap[jurisdiction] || 0
  };
}

function generateEnforcementRecommendations(score: number, terms: any): string[] {
  const recommendations = [];
  
  if (score > 70) {
    recommendations.push('High enforcement risk - consider negotiated release or role modification');
    recommendations.push('Garden leave period may be required to honor restriction');
  } else if (score > 40) {
    recommendations.push('Moderate enforcement risk - review specific terms and precedents');
    recommendations.push('Consider geographic or role-based limitations to reduce conflict');
  } else {
    recommendations.push('Low enforcement risk - restriction may be overly broad');
    recommendations.push('Potential to challenge enforceability based on scope or consideration');
  }
  
  if (terms.compensation === 0) {
    recommendations.push('Lack of consideration weakens enforceability significantly');
  }
  
  return recommendations;
}

function determineViolationRisk(score: number): 'low' | 'medium' | 'high' | 'prohibitive' {
  if (score >= 80) return 'prohibitive';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function generateMitigationOptions(terms: any, enforcementScore: number): NonCompeteMitigation[] {
  const options: NonCompeteMitigation[] = [];
  
  // Garden leave option
  options.push({
    id: 'garden-leave',
    strategy: 'garden_leave',
    description: `Honor non-compete with ${terms.duration} months garden leave at current salary`,
    cost: terms.currentSalary * (terms.duration / 12),
    timeline: `${terms.duration} months`,
    successProbability: 95,
    legalRequirements: ['Formal notice to current employer', 'Written garden leave agreement']
  });
  
  // Role modification
  if (enforcementScore < 70) {
    options.push({
      id: 'role-mod',
      strategy: 'role_modification',
      description: 'Modify role to avoid direct competition while maintaining team leadership',
      cost: 50000, // Legal and consulting costs
      timeline: '2-3 months',
      successProbability: 70,
      legalRequirements: ['Legal opinion on role differentiation', 'Modified job description']
    });
  }
  
  // Negotiated release
  options.push({
    id: 'negotiated',
    strategy: 'negotiated_release',
    description: 'Negotiate partial or complete release from non-compete restrictions',
    cost: 100000, // Settlement/legal costs
    timeline: '3-6 months',
    successProbability: 60,
    legalRequirements: ['Formal release agreement', 'Consideration payment']
  });
  
  return options;
}

export function calculateComplianceCost(jurisdiction: string, teamSize: number, liftoutType: string): number {
  const baseCosts = {
    'California': 50000,  // Lower due to weak non-compete laws
    'New York': 125000,   // Higher due to complex employment law
    'Delaware': 75000,    // Moderate business-friendly jurisdiction
    'Texas': 100000,     // Moderate costs
    'Florida': 150000,   // Higher due to strong non-compete enforcement
  };
  
  const baseJurisdictionCost = baseCosts[jurisdiction as keyof typeof baseCosts] || 100000;
  const teamSizeMultiplier = 1 + (teamSize - 1) * 0.15; // Each additional member adds 15%
  
  const liftoutTypeMultipliers = {
    'competitive': 1.5,    // Direct competitor liftout
    'expansion': 1.2,      // Market expansion
    'capability': 1.0,     // New capability building
    'defensive': 1.3,      // Defensive counter-liftout
  };
  
  const typeMultiplier = liftoutTypeMultipliers[liftoutType as keyof typeof liftoutTypeMultipliers] || 1.0;
  
  return Math.round(baseJurisdictionCost * teamSizeMultiplier * typeMultiplier);
}

// Mock data for development
export const mockLegalDocuments: LegalDocument[] = [
  {
    id: 'doc-1',
    type: 'team_liftout_agreement',
    title: 'Goldman Sachs QIS Team Liftout Agreement',
    description: 'Master agreement for 12-member quantitative investment strategies team acquisition',
    template: {
      id: 'template-liftout-1',
      name: 'Multi-Member Team Liftout Agreement',
      type: 'team_liftout_agreement',
      jurisdiction: 'New York',
      lastUpdated: new Date('2024-09-01'),
      sections: [],
      variables: [],
      legalReview: {
        reviewedBy: 'Sarah Kim, Partner - Employment Law',
        reviewDate: new Date('2024-09-01'),
        nextReviewDue: new Date('2025-03-01'),
        complianceNotes: ['Updated for NY employment law changes', 'Enhanced IP assignment clauses']
      }
    },
    status: 'review',
    createdDate: new Date('2024-09-15'),
    lastModified: new Date('2024-09-18'),
    version: 2,
    jurisdiction: 'New York',
    parties: [
      {
        id: 'party-1',
        role: 'hiring_company',
        name: 'Blackstone Alternative Asset Management',
        entityType: 'corporation',
        address: {
          street: '345 Park Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10154',
          country: 'USA'
        },
        signatory: {
          name: 'James Richardson',
          title: 'Chief Human Resources Officer',
          authorityLevel: 'Full signing authority for employment agreements up to $50M'
        }
      }
    ],
    reviewers: [
      {
        id: 'reviewer-1',
        name: 'Sarah Kim',
        role: 'external_counsel',
        firmName: 'Skadden, Arps, Slate, Meagher & Flom',
        jurisdiction: 'New York',
        assignedDate: new Date('2024-09-16'),
        dueDate: new Date('2024-09-23'),
        status: 'in_review'
      }
    ],
    approvals: [],
    complianceChecks: [
      {
        id: 'check-1',
        category: 'employment_law',
        jurisdiction: 'New York',
        requirement: 'Notice period compliance for senior executives',
        status: 'compliant',
        checkDate: new Date('2024-09-17'),
        checkedBy: 'Sarah Kim',
        riskLevel: 'low',
        impact: 'Standard 30-day notice period meets NY requirements'
      },
      {
        id: 'check-2',
        category: 'non_compete_restrictions',
        jurisdiction: 'New York',
        requirement: 'Analysis of existing non-compete agreements',
        status: 'needs_review',
        checkDate: new Date('2024-09-17'),
        checkedBy: 'David Chen',
        riskLevel: 'high',
        impact: '8 of 12 team members have enforceable non-compete clauses requiring 12-month garden leave'
      }
    ],
    riskAssessment: {
      id: 'risk-1',
      overallRisk: 'medium',
      risks: [
        {
          id: 'risk-nc-1',
          category: 'non_compete_restrictions',
          description: 'Multiple team members subject to 12-month non-compete restrictions',
          likelihood: 85,
          impact: 70,
          riskScore: 60,
          jurisdiction: 'New York',
          mitigationStatus: 'in_progress'
        }
      ],
      mitigationPlan: [
        {
          id: 'mit-1',
          riskId: 'risk-nc-1',
          strategy: 'Structured garden leave program with full compensation',
          implementation: 'Negotiate 12-month garden leave at 100% current compensation plus benefits',
          timeline: '12 months post-departure',
          responsible: 'Sarah Kim - External Counsel',
          cost: 3600000,
          effectiveness: 90
        }
      ],
      insuranceRecommendations: [
        'Employment Practices Liability Insurance (minimum $10M coverage)',
        'Directors & Officers insurance enhancement for liftout-related claims'
      ],
      assessedBy: 'Risk Management Committee',
      assessmentDate: new Date('2024-09-17'),
      nextReviewDate: new Date('2024-10-17')
    },
    variables: {
      totalTeamSize: 12,
      estimatedGardenLeaveCost: 3600000,
      totalCompensationPackage: 32000000,
      jurisdiction: 'New York'
    }
  }
];

export const mockNonCompeteAnalyses: NonCompeteAnalysis[] = [
  {
    id: 'nc-analysis-1',
    teamMemberId: 'michael-chen',
    currentEmployer: 'Goldman Sachs',
    hasNonCompete: true,
    nonCompeteTerms: {
      duration: 12,
      geographicScope: 'Global for investment banking; Northeast US for other financial services',
      industryScope: ['Investment Banking', 'Asset Management', 'Hedge Funds', 'Private Equity'],
      customerRestrictions: 'No solicitation of GS clients for 18 months',
      compensation: 350000 // Garden leave at full salary
    },
    enforceability: {
      jurisdiction: 'New York',
      enforcementLikelihood: 78,
      factors: [
        {
          factor: 'Duration Reasonableness',
          impact: 'neutral',
          description: '12 month restriction is standard for senior roles in NY',
          weight: 9
        },
        {
          factor: 'Geographic Scope',
          impact: 'strengthens',
          description: 'Tiered geographic approach shows reasonable tailoring',
          weight: 8
        },
        {
          factor: 'Consideration',
          impact: 'strengthens',
          description: 'Full salary garden leave provides adequate consideration',
          weight: 7
        }
      ],
      recommendations: [
        'High enforcement risk due to well-drafted agreement and adequate consideration',
        'Recommend full garden leave compliance or negotiated modification',
        'Consider role-based differentiation to reduce direct competition overlap'
      ]
    },
    violationRisk: 'high',
    legalCosts: {
      defenseCosts: 275000,
      settlementRange: { min: 100000, max: 1000000 },
      businessDisruption: 'Potential 9-15 month litigation with preliminary injunction risk'
    },
    mitigationOptions: [
      {
        id: 'garden-leave-mc',
        strategy: 'garden_leave',
        description: 'Honor 12-month garden leave at $350K annual compensation',
        cost: 350000,
        timeline: '12 months',
        successProbability: 98,
        legalRequirements: ['Formal resignation notice', 'Garden leave acknowledgment']
      },
      {
        id: 'role-mod-mc',
        strategy: 'role_modification',
        description: 'Focus on systematic trading vs traditional investment banking',
        cost: 75000,
        timeline: '3-6 months',
        successProbability: 65,
        legalRequirements: ['Legal opinion on role differentiation', 'Detailed job description']
      }
    ]
  }
];

export const jurisdictionCompliance: JurisdictionCompliance[] = [
  {
    jurisdiction: 'New York',
    country: 'USA',
    state: 'New York',
    employmentLaws: {
      noticeRequirements: 30, // Senior executives
      gardenLeaveRules: 'Permitted with adequate consideration',
      nonCompeteEnforcement: 'moderate',
      tradSecretProtection: 'Strong protection under NY Trade Secrets Act'
    },
    regulations: {
      dataProtection: ['NY SHIELD Act compliance required'],
      securities: ['FINRA notification for registered persons', 'SEC Form U4 updates'],
      antitrust: ['Hart-Scott-Rodino filing if deal size exceeds thresholds'],
      immigration: ['H-1B transfer requirements', 'TN visa considerations'],
      industrySpecific: ['Banking regulations for prudential supervision', 'Investment adviser registration requirements']
    },
    requiredDocuments: [
      'Employment agreements with NY law governing clause',
      'Non-disclosure agreements compliant with NY Trade Secrets Act',
      'Assignment of inventions agreements'
    ],
    notificationRequirements: [
      'FINRA Form U5 filing within 30 days',
      'Client notification letters within 60 days'
    ],
    filingRequirements: [
      'Workers compensation insurance certificates',
      'Unemployment insurance registration'
    ]
  }
];
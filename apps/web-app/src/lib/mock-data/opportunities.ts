/**
 * Mock opportunities data for demo/fallback when API server is unavailable
 */

export interface MockOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  teamSize: number;
  location: string;
  remote: boolean;
  industry: string;
  type: 'expansion' | 'capability' | 'market_entry' | 'acquisition';
  compensation: {
    type: 'salary' | 'total_package' | 'equity';
    range: string;
    equity?: boolean;
    benefits?: string;
  };
  requirements: string[];
  responsibilities: string[];
  strategicRationale: string;
  integrationPlan: string;
  deadline: string;
  status: 'open' | 'in_review' | 'closed';
  postedAt: string;
  applicants: number;
  views: number;
  isConfidential?: boolean;
}

export const mockOpportunities: MockOpportunity[] = [
  {
    id: 'opp_mock_001',
    title: 'Strategic FinTech Analytics Team',
    company: 'Goldman Sachs',
    description: 'We are seeking an established high-performing quantitative analytics team to join our expanding FinTech division. This is a rare opportunity to bring your intact team to one of the world\'s leading financial institutions with access to cutting-edge infrastructure and global markets.',
    teamSize: 4,
    location: 'New York, NY',
    remote: false,
    industry: 'Financial Services',
    type: 'expansion',
    compensation: {
      type: 'salary',
      range: '$180k - $250k per person',
      equity: true,
      benefits: 'Full package including relocation assistance'
    },
    requirements: [
      'Minimum 3 years working together as a cohesive unit',
      'Proven track record in quantitative finance or fintech',
      'Experience with large-scale data analytics and ML models',
      'Strong leadership and collaborative decision-making'
    ],
    responsibilities: [
      'Lead development of next-generation trading analytics',
      'Build predictive models for market intelligence',
      'Collaborate with global teams on strategic initiatives',
      'Mentor and grow analytics capabilities across the firm'
    ],
    strategicRationale: 'Rapidly expand our quantitative capabilities to compete in algorithmic trading and market analytics.',
    integrationPlan: 'Dedicated 90-day onboarding with executive sponsorship, immediate access to our tech stack, and autonomy to establish team practices.',
    deadline: '2026-02-28',
    status: 'open',
    postedAt: '2025-01-15T10:00:00Z',
    applicants: 8,
    views: 234
  },
  {
    id: 'opp_mock_002',
    title: 'Healthcare AI Research Team',
    company: 'MedTech Innovations',
    description: 'MedTech Innovations is looking for an exceptional AI/ML team specializing in healthcare applications. Join us in revolutionizing patient care through intelligent diagnostic systems and predictive health analytics.',
    teamSize: 5,
    location: 'Boston, MA',
    remote: true,
    industry: 'Healthcare Technology',
    type: 'capability',
    compensation: {
      type: 'total_package',
      range: '$200k - $300k total package',
      equity: true,
      benefits: 'Comprehensive healthcare, equity grants, research budget'
    },
    requirements: [
      'Deep expertise in medical imaging or health informatics',
      'Published research or patents in healthcare AI preferred',
      'Experience with FDA regulatory pathways a plus',
      'Team cohesion score of 85+ demonstrating effective collaboration'
    ],
    responsibilities: [
      'Develop AI-powered diagnostic tools',
      'Lead clinical validation studies',
      'Build partnerships with healthcare providers',
      'Drive product roadmap for AI health initiatives'
    ],
    strategicRationale: 'Build world-class AI capabilities to accelerate our medical device innovation pipeline.',
    integrationPlan: 'Integration with our existing R&D team, dedicated lab space, direct report to CTO, and equity stake in new ventures.',
    deadline: '2026-03-15',
    status: 'open',
    postedAt: '2025-01-20T14:30:00Z',
    applicants: 12,
    views: 456
  },
  {
    id: 'opp_mock_003',
    title: 'European Market Expansion Team',
    company: 'Confidential Fortune 500',
    companyLogo: undefined,
    description: 'A Fortune 500 technology company is seeking an established business development and operations team to lead our European expansion. This confidential opportunity requires a team with proven cross-border experience and established European networks.',
    teamSize: 6,
    location: 'London, UK',
    remote: false,
    industry: 'Enterprise Software',
    type: 'market_entry',
    compensation: {
      type: 'total_package',
      range: '$250k - $400k total package',
      equity: true,
      benefits: 'Relocation package, housing allowance, school fees'
    },
    requirements: [
      'Existing European business network and relationships',
      'Experience launching products in EU markets',
      'Multilingual capabilities (English + 2 European languages)',
      'Track record of revenue growth in new markets'
    ],
    responsibilities: [
      'Establish European headquarters operations',
      'Build local partnerships and distribution channels',
      'Navigate regulatory and compliance requirements',
      'Hire and develop regional teams'
    ],
    strategicRationale: 'Accelerate European market entry by 18+ months through acquiring an established team with local expertise.',
    integrationPlan: 'Full autonomy to establish European operations, direct report to global CEO, board seat for team lead.',
    deadline: '2026-04-01',
    status: 'open',
    postedAt: '2025-01-25T09:00:00Z',
    applicants: 5,
    views: 189,
    isConfidential: true
  },
  {
    id: 'opp_mock_004',
    title: 'DevOps & Platform Engineering Team',
    company: 'Scale Labs',
    description: 'Scale Labs is building the next generation of developer tools and we need a battle-tested DevOps team to own our infrastructure. Bring your team and shape the foundation of our platform.',
    teamSize: 4,
    location: 'San Francisco, CA',
    remote: true,
    industry: 'Developer Tools',
    type: 'capability',
    compensation: {
      type: 'salary',
      range: '$170k - $230k per person',
      equity: true,
      benefits: 'Unlimited PTO, home office budget, conference budget'
    },
    requirements: [
      'Expert-level Kubernetes and cloud infrastructure experience',
      'Track record of building reliable, scalable systems',
      'Experience with developer experience and platform engineering',
      '2+ years working together as a team'
    ],
    responsibilities: [
      'Own and evolve our entire infrastructure',
      'Build internal developer platform and tools',
      'Establish SRE practices and incident response',
      'Scale systems for 10x growth'
    ],
    strategicRationale: 'Acquire proven platform expertise to support rapid growth and enterprise customer requirements.',
    integrationPlan: 'Immediate ownership of platform team, budget for tool selection, weekly sync with CEO.',
    deadline: '2026-02-15',
    status: 'open',
    postedAt: '2025-01-18T16:00:00Z',
    applicants: 15,
    views: 567
  },
  {
    id: 'opp_mock_005',
    title: 'M&A Advisory Team',
    company: 'Sterling Partners',
    description: 'Sterling Partners, a leading private equity firm, seeks an experienced M&A advisory team to strengthen our deal origination and execution capabilities. Join a firm with $5B+ AUM and a 20-year track record.',
    teamSize: 3,
    location: 'Chicago, IL',
    remote: false,
    industry: 'Private Equity',
    type: 'acquisition',
    compensation: {
      type: 'total_package',
      range: '$300k - $500k total comp',
      equity: true,
      benefits: 'Carried interest, deal bonuses, partner track'
    },
    requirements: [
      'Investment banking or PE deal experience (10+ deals)',
      'Existing LP relationships a strong plus',
      'Sector expertise in industrials or healthcare',
      'Proven ability to source and close transactions'
    ],
    responsibilities: [
      'Lead deal sourcing and origination',
      'Conduct due diligence and valuation analysis',
      'Support portfolio company operations',
      'Build relationships with advisors and intermediaries'
    ],
    strategicRationale: 'Strengthen deal pipeline and execution to deploy Fund VII capital on attractive timeline.',
    integrationPlan: 'Partner-track positions, immediate deal involvement, equity participation from day one.',
    deadline: '2026-03-30',
    status: 'open',
    postedAt: '2025-01-22T11:00:00Z',
    applicants: 6,
    views: 312
  }
];

// In-memory storage that can be modified (for demo purposes)
let opportunities = [...mockOpportunities];

/**
 * Get all opportunities with optional filtering
 */
export function getMockOpportunities(filters?: {
  search?: string;
  industry?: string;
  location?: string;
  type?: string;
  status?: string;
  minTeamSize?: number;
  maxTeamSize?: number;
}): { opportunities: MockOpportunity[]; total: number } {
  let filtered = [...opportunities];

  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchLower) ||
        opp.company.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.industry) {
      filtered = filtered.filter(opp =>
        opp.industry.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(opp =>
        opp.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(opp => opp.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(opp => opp.status === filters.status);
    }

    if (filters.minTeamSize) {
      filtered = filtered.filter(opp => opp.teamSize >= filters.minTeamSize!);
    }

    if (filters.maxTeamSize) {
      filtered = filtered.filter(opp => opp.teamSize <= filters.maxTeamSize!);
    }
  }

  return {
    opportunities: filtered,
    total: filtered.length
  };
}

/**
 * Get a single opportunity by ID
 */
export function getMockOpportunityById(id: string): MockOpportunity | null {
  return opportunities.find(opp => opp.id === id) || null;
}

/**
 * Create a new opportunity (for demo purposes)
 */
export function createMockOpportunity(data: Partial<MockOpportunity>): MockOpportunity {
  const newOpp: MockOpportunity = {
    id: `opp_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: data.title || 'New Opportunity',
    company: data.company || 'Your Company',
    description: data.description || '',
    teamSize: data.teamSize || 4,
    location: data.location || 'Remote',
    remote: data.remote ?? true,
    industry: data.industry || 'Technology',
    type: data.type || 'expansion',
    compensation: data.compensation || {
      type: 'salary',
      range: '$150k - $200k',
      equity: false
    },
    requirements: data.requirements || [],
    responsibilities: data.responsibilities || [],
    strategicRationale: data.strategicRationale || '',
    integrationPlan: data.integrationPlan || '',
    deadline: data.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'open',
    postedAt: new Date().toISOString(),
    applicants: 0,
    views: 0,
    isConfidential: data.isConfidential
  };

  opportunities.push(newOpp);
  return newOpp;
}

/**
 * Reset opportunities to initial mock data
 */
export function resetMockOpportunities(): void {
  opportunities = [...mockOpportunities];
}

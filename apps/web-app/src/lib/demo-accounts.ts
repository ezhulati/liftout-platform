// Demo user accounts for Liftout platform
export const DEMO_ACCOUNTS = {
  // Individual/Team Lead Demo Account
  individual: {
    email: 'demo@liftout.com',
    password: 'demo123',
    profile: {
      name: 'Alex Chen',
      title: 'Senior Data Scientist & Team Lead',
      company: 'TechFlow Analytics',
      location: 'San Francisco, CA',
      yearsExperience: 8,
      teamSize: 4,
      yearsWithTeam: 3.5,
      bio: 'Leading a high-performing data science team specializing in fintech analytics. We\'ve successfully delivered $2M+ in value through predictive modeling and risk assessment systems.',
      skills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling'],
      achievements: [
        'Led team that reduced fraud detection false positives by 35%',
        'Built predictive models generating $2.1M annual savings',
        'Mentored 12+ junior data scientists across 3 years'
      ]
    },
    team: {
      id: 'team_demo_001',
      name: 'TechFlow Data Science Team',
      description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions.',
      size: 4,
      yearsWorking: 3.5,
      cohesionScore: 94,
      successfulProjects: 23,
      clientSatisfaction: 96,
      openToLiftout: true,
      liftoutHistory: [
        {
          year: 2022,
          fromCompany: 'DataCorp Inc',
          toCompany: 'TechFlow Analytics',
          outcome: 'Successful integration, 40% productivity increase'
        }
      ]
    }
  },

  // Company Demo Account  
  company: {
    email: 'company@liftout.com',
    password: 'demo123',
    profile: {
      name: 'Sarah Rodriguez',
      title: 'VP of Talent Acquisition',
      company: 'NextGen Financial',
      location: 'New York, NY',
      companySize: 850,
      industry: 'Financial Services',
      bio: 'Leading strategic talent acquisition for a fast-growing fintech company. Focused on acquiring high-performing teams to accelerate our market expansion.',
      priorities: ['Team-based hiring', 'Rapid scaling', 'Market expansion', 'Technical expertise'],
      liftoutHistory: [
        'Successfully acquired 3 intact teams in 2023',
        'Average integration time: 2.1 weeks',
        'Team retention rate: 96% after 12 months'
      ]
    },
    company: {
      id: 'company_demo_001',
      name: 'NextGen Financial',
      description: 'Leading fintech company revolutionizing digital banking and investment platforms.',
      size: 850,
      founded: 2019,
      funding: '$125M Series B',
      locations: ['New York', 'Austin', 'London'],
      activeLiftouts: 3,
      completedLiftouts: 8,
      averageIntegrationTime: '2.1 weeks',
      teamRetentionRate: 96
    }
  }
} as const;

// Demo data for realistic application experience
export const DEMO_DATA = {
  // Teams available for liftout (visible to company users)
  teams: [
    {
      id: 'team_001',
      name: 'QuantRisk Analytics Team',
      company: 'Goldman Sachs',
      size: 5,
      yearsWorking: 4.2,
      lead: 'Michael Zhang',
      specialization: 'Quantitative Risk Analysis',
      description: 'Elite quant team specializing in derivatives pricing and risk modeling for institutional trading.',
      cohesionScore: 98,
      successRate: 94,
      clientSatisfaction: 97,
      compensation: '$180k-$280k + equity',
      availability: 'Open to strategic opportunities',
      achievements: [
        'Reduced VaR calculation time by 60%',
        'Built real-time risk monitoring for $50B portfolio',
        'Published 8 papers in top finance journals'
      ],
      skills: ['Quantitative Finance', 'Python', 'C++', 'Risk Modeling', 'Derivatives'],
      openToLiftout: true,
      responseTime: '< 24 hours'
    },
    {
      id: 'team_002', 
      name: 'Healthcare AI Research Team',
      company: 'Stanford Medicine',
      size: 6,
      yearsWorking: 3.8,
      lead: 'Dr. Jennifer Kim',
      specialization: 'Medical Imaging AI',
      description: 'Research team developing cutting-edge AI solutions for medical diagnosis and treatment planning.',
      cohesionScore: 92,
      successRate: 89,
      clientSatisfaction: 98,
      compensation: '$200k-$350k + research opportunities',
      availability: 'Selective opportunities',
      achievements: [
        'FDA approval for melanoma detection AI (94% accuracy)',
        'Published in Nature Medicine and NEJM',
        '$12M NIH grant for cancer research'
      ],
      skills: ['Computer Vision', 'Deep Learning', 'Medical Imaging', 'Research', 'FDA Compliance'],
      openToLiftout: true,
      responseTime: '2-3 days'
    },
    {
      id: 'team_003',
      name: 'Strategic M&A Advisory Team', 
      company: 'McKinsey & Company',
      size: 4,
      yearsWorking: 5.1,
      lead: 'David Park',
      specialization: 'Technology M&A',
      description: 'Senior consultants specializing in technology sector mergers, acquisitions, and strategic partnerships.',
      cohesionScore: 96,
      successRate: 91,
      clientSatisfaction: 95,
      compensation: '$250k-$400k + performance bonuses',
      availability: 'Confidential inquiries only',
      achievements: [
        'Advised on $8.5B in completed transactions',
        'Led due diligence for 15+ tech acquisitions',
        '100% client retention over 3 years'
      ],
      skills: ['Strategic Planning', 'Financial Modeling', 'Due Diligence', 'Negotiation', 'Market Analysis'],
      openToLiftout: false,
      responseTime: 'By invitation'
    }
  ],

  // Liftout opportunities (visible to team users)
  opportunities: [
    {
      id: 'opp_001',
      title: 'Lead FinTech Analytics Division',
      company: 'NextGen Financial',
      type: 'Strategic Expansion',
      description: 'Build and lead our new quantitative analytics division as we expand into institutional trading.',
      teamSize: '4-6 people',
      compensation: '$220k-$320k + equity package',
      location: 'New York, NY (Hybrid)',
      timeline: 'Start within 3 months',
      requirements: [
        '3+ years working as cohesive team',
        'Quantitative finance expertise',
        'Proven track record in derivatives/risk',
        'Leadership experience'
      ],
      whatWeOffer: [
        'Equity participation in $125M Series B company',
        'Full team autonomy and decision-making authority', 
        'Access to $50B+ in trading volume data',
        'Competitive team-based compensation packages'
      ],
      integrationPlan: 'Dedicated floor space, existing infrastructure, 90-day integration timeline',
      confidential: false,
      urgent: true,
      responseTime: '< 48 hours',
      hiringManager: 'Sarah Rodriguez'
    },
    {
      id: 'opp_002',
      title: 'Healthcare AI Innovation Lab',
      company: 'MedTech Innovations',
      type: 'R&D Leadership',
      description: 'Establish and lead our AI research division focused on next-generation medical diagnostic tools.',
      teamSize: '5-8 people',
      compensation: '$280k-$450k + research budget',
      location: 'Boston, MA + Remote flexibility',
      timeline: 'Flexible start date',
      requirements: [
        'PhD or equivalent research experience',
        'FDA regulatory experience preferred',
        'Published research in medical AI',
        'Team with proven collaboration'
      ],
      whatWeOffer: [
        '$5M annual research budget',
        'Partnership with top medical institutions',
        'Patent sharing and IP ownership',
        'Conference and publication support'
      ],
      integrationPlan: 'Purpose-built lab facility, research partnerships with Harvard Medical/MIT',
      confidential: false,
      urgent: false,
      responseTime: '3-5 days',
      hiringManager: 'Dr. Lisa Chen'
    },
    {
      id: 'opp_003',
      title: 'European Market Expansion Team',
      company: 'Confidential Fortune 500',
      type: 'Market Entry',
      description: 'Lead our expansion into European markets with full P&L responsibility and team autonomy.',
      teamSize: '3-5 people',
      compensation: 'Competitive + significant equity upside',
      location: 'London, UK (Primary) + European cities',
      timeline: 'Q1 2024 target',
      requirements: [
        'European market experience',
        'Regulatory knowledge (GDPR, MiFID)',
        'Team with international experience',
        'Fluency in English + European language'
      ],
      whatWeOffer: [
        'Full European division leadership',
        '$100M market entry budget',
        'Autonomous decision-making authority',
        'Rapid career progression opportunities'
      ],
      integrationPlan: 'London headquarters setup, dedicated European infrastructure',
      confidential: true,
      urgent: true,
      responseTime: 'By invitation only',
      hiringManager: 'Confidential'
    }
  ],

  // Recent conversations/messages  
  conversations: [
    {
      id: 'conv_001',
      participants: ['Alex Chen', 'Sarah Rodriguez'],
      subject: 'TechFlow Team - Strategic Opportunity Discussion',
      lastMessage: 'Your team\'s background in fintech analytics aligns perfectly with our expansion plans.',
      timestamp: '2 hours ago',
      status: 'active',
      type: 'liftout_inquiry'
    },
    {
      id: 'conv_002',
      participants: ['Michael Zhang', 'NextGen Financial'],
      subject: 'QuantRisk Analytics - Integration Planning',
      lastMessage: 'We\'d love to discuss the integration timeline and team autonomy structure.',
      timestamp: '1 day ago', 
      status: 'pending',
      type: 'due_diligence'
    }
  ],

  // Analytics data
  analytics: {
    individual: {
      profileViews: 847,
      inquiries: 23,
      activeDiscussions: 5,
      liftoutOffers: 3,
      responseRate: 94
    },
    company: {
      teamViews: 156,
      opportunityViews: 89,
      expressions: 12,
      activeNegotiations: 4,
      successRate: 78
    }
  }
};

// Helper functions for demo data
export const getDemoAccount = (type: 'individual' | 'company') => {
  return DEMO_ACCOUNTS[type];
};

export const isDemoAccount = (email: string) => {
  return email === DEMO_ACCOUNTS.individual.email || email === DEMO_ACCOUNTS.company.email;
};

export const getDemoDataForUser = (email: string) => {
  if (email === DEMO_ACCOUNTS.individual.email) {
    return {
      userType: 'individual' as const,
      profile: DEMO_ACCOUNTS.individual.profile,
      team: DEMO_ACCOUNTS.individual.team,
      opportunities: DEMO_DATA.opportunities,
      conversations: DEMO_DATA.conversations,
      analytics: DEMO_DATA.analytics.individual
    };
  }
  
  if (email === DEMO_ACCOUNTS.company.email) {
    return {
      userType: 'company' as const,
      profile: DEMO_ACCOUNTS.company.profile,
      company: DEMO_ACCOUNTS.company.company,
      teams: DEMO_DATA.teams,
      conversations: DEMO_DATA.conversations,
      analytics: DEMO_DATA.analytics.company
    };
  }
  
  return null;
};
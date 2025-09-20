import { 
  userService, 
  teamService, 
  opportunityService, 
  firestoreService 
} from '@/lib/firestore';
import { COLLECTIONS } from '@/types/firebase';
import type { User, Team, Opportunity } from '@/types/firebase';

// Demo users
const demoUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    email: 'demo@example.com',
    name: 'Alex Johnson',
    type: 'individual',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    industry: 'Investment Banking & Finance',
    companyName: '',
    position: 'Senior Analyst',
    verified: true,
    status: 'active',
    preferences: {
      notifications: true,
      marketing: true,
      confidentialMode: false,
    },
  },
  {
    email: 'company@example.com',
    name: 'Sarah Chen',
    type: 'company',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    industry: 'Technology & Software Development',
    companyName: 'TechCorp Solutions',
    position: 'Head of Talent Acquisition',
    verified: true,
    status: 'active',
    preferences: {
      notifications: true,
      marketing: true,
      confidentialMode: false,
    },
  },
  {
    email: 'team.lead@example.com',
    name: 'Michael Rodriguez',
    type: 'individual',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    industry: 'Management Consulting',
    companyName: '',
    position: 'Senior Manager',
    verified: true,
    status: 'active',
    preferences: {
      notifications: true,
      marketing: false,
      confidentialMode: true,
    },
  },
];

// Demo teams
const demoTeams: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'leaderId' | 'memberIds'>[] = [
  {
    name: 'Strategic Analytics Core',
    description: 'Elite quantitative finance team with proven track record in algorithmic trading and risk management. Specialized in high-frequency trading systems and portfolio optimization.',
    industry: 'Investment Banking & Finance',
    size: 8,
    location: 'New York, NY',
    skills: ['Quantitative Finance', 'Python', 'Machine Learning', 'Risk Management', 'Algorithmic Trading'],
    experience: {
      yearsWorkedTogether: 4,
      previousLiftouts: 2,
      successfulProjects: 15,
      totalRevenue: 125000000,
    },
    availability: {
      status: 'selective',
      timeframe: 'Q2 2024',
      preferredNoticeTime: 12,
    },
    compensation: {
      currentRange: {
        min: 150000,
        max: 300000,
        currency: 'USD',
      },
      expectations: {
        min: 180000,
        max: 350000,
        currency: 'USD',
      },
      type: 'total_package',
    },
    visibility: 'selective',
    verificationStatus: 'verified',
    profileViews: 247,
    expressionsOfInterest: 18,
    tags: ['High Performance', 'Proven Track Record', 'Immediate Impact'],
  },
  {
    name: 'Healthcare AI Specialists',
    description: 'Cutting-edge medical AI team focused on diagnostic imaging and clinical decision support systems. Proven expertise in FDA-compliant healthcare solutions.',
    industry: 'Healthcare/Medical Teams',
    size: 6,
    location: 'Boston, MA',
    skills: ['Medical AI', 'Computer Vision', 'Deep Learning', 'Healthcare Compliance', 'Clinical Research'],
    experience: {
      yearsWorkedTogether: 3,
      previousLiftouts: 1,
      successfulProjects: 8,
      totalRevenue: 45000000,
    },
    availability: {
      status: 'available',
      timeframe: 'Immediate',
      preferredNoticeTime: 8,
    },
    compensation: {
      currentRange: {
        min: 140000,
        max: 280000,
        currency: 'USD',
      },
      expectations: {
        min: 200000,
        max: 400000,
        currency: 'USD',
      },
      type: 'total_package',
    },
    visibility: 'public',
    verificationStatus: 'verified',
    profileViews: 189,
    expressionsOfInterest: 24,
    tags: ['AI Innovation', 'Healthcare Expertise', 'Growth Ready'],
  },
  {
    name: 'European M&A Advisory',
    description: 'Senior investment banking team specializing in cross-border M&A transactions in the European market. Established relationships with key institutional clients.',
    industry: 'Investment Banking & Finance',
    size: 5,
    location: 'London, UK',
    skills: ['M&A Advisory', 'Valuation', 'Due Diligence', 'Client Relations', 'Cross-border Transactions'],
    experience: {
      yearsWorkedTogether: 6,
      previousLiftouts: 3,
      successfulProjects: 22,
      totalRevenue: 180000000,
    },
    availability: {
      status: 'selective',
      timeframe: 'Q3 2024',
      preferredNoticeTime: 16,
    },
    compensation: {
      currentRange: {
        min: 200000,
        max: 500000,
        currency: 'USD',
      },
      expectations: {
        min: 250000,
        max: 600000,
        currency: 'USD',
      },
      type: 'total_package',
    },
    visibility: 'confidential',
    verificationStatus: 'verified',
    profileViews: 156,
    expressionsOfInterest: 12,
    tags: ['Senior Level', 'Client Relationships', 'International Experience'],
  },
];

// Demo opportunities
const demoOpportunities: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>[] = [
  {
    title: 'Strategic FinTech Analytics Team - Goldman Sachs Alternative',
    description: 'Elite investment firm seeking experienced quantitative analytics team to lead our new algorithmic trading division. Immediate equity partnership opportunity for the right team.',
    companyName: 'Meridian Capital Partners',
    industry: 'Investment Banking & Finance',
    location: 'New York, NY',
    type: 'capability_building',
    teamSize: {
      min: 6,
      max: 10,
    },
    skills: ['Quantitative Finance', 'Algorithmic Trading', 'Risk Management', 'Python', 'Machine Learning'],
    experience: {
      minYears: 5,
      preferredYears: 8,
    },
    compensation: {
      min: 180000,
      max: 350000,
      currency: 'USD',
      type: 'total_package',
      benefits: ['Equity Partnership', 'Performance Bonuses', 'Full Benefits', 'Relocation Assistance'],
    },
    timeline: {
      urgency: 'within_month',
    },
    requirements: {
      mustHave: ['Proven P&L responsibility', 'Regulatory compliance experience', 'Team leadership'],
      niceToHave: ['Previous liftout experience', 'Client portfolio', 'Series 7/63 licenses'],
      culturalFit: ['Entrepreneurial mindset', 'Collaborative approach', 'Results-driven'],
    },
    confidential: false,
    status: 'active',
    applicantCount: 8,
    viewCount: 156,
    tags: ['High Compensation', 'Equity Opportunity', 'Leadership Role'],
  },
  {
    title: 'Healthcare AI Innovation Lab - Stealth Mode Startup',
    description: 'Well-funded healthcare technology startup seeking foundational AI team to build next-generation diagnostic platform. Significant equity stake and technical leadership opportunities.',
    companyName: 'Confidential Healthcare Tech',
    industry: 'Healthcare/Medical Teams',
    location: 'Boston, MA',
    type: 'market_entry',
    teamSize: {
      min: 4,
      max: 8,
    },
    skills: ['Medical AI', 'Computer Vision', 'Deep Learning', 'Healthcare Compliance', 'Product Development'],
    experience: {
      minYears: 3,
      preferredYears: 5,
    },
    compensation: {
      min: 200000,
      max: 400000,
      currency: 'USD',
      type: 'total_package',
      benefits: ['Significant Equity', 'Technical Leadership', 'Research Budget', 'Conference Attendance'],
    },
    timeline: {
      urgency: 'immediate',
    },
    requirements: {
      mustHave: ['FDA regulatory experience', 'Clinical trial involvement', 'Published research'],
      niceToHave: ['Startup experience', 'Product management skills', 'IP creation'],
      culturalFit: ['Innovation-focused', 'Fast-paced environment', 'Mission-driven'],
    },
    confidential: true,
    status: 'active',
    applicantCount: 12,
    viewCount: 203,
    tags: ['Equity Heavy', 'Technical Leadership', 'Innovation Focus'],
  },
  {
    title: 'European Expansion Team - Fortune 500 Financial Services',
    description: 'Established financial services company seeking experienced European M&A team to lead market expansion. Opportunity to build and lead new European division.',
    companyName: 'Global Financial Partners',
    industry: 'Investment Banking & Finance',
    location: 'London, UK',
    type: 'expansion',
    teamSize: {
      min: 5,
      max: 8,
    },
    skills: ['M&A Advisory', 'European Markets', 'Client Relations', 'Cross-border Transactions', 'Regulatory Knowledge'],
    experience: {
      minYears: 7,
      preferredYears: 10,
    },
    compensation: {
      min: 250000,
      max: 600000,
      currency: 'USD',
      type: 'total_package',
      benefits: ['Division Leadership', 'Carried Interest', 'International Benefits', 'Relocation Package'],
    },
    timeline: {
      urgency: 'within_quarter',
    },
    requirements: {
      mustHave: ['European market expertise', 'Established client relationships', 'Regulatory knowledge'],
      niceToHave: ['Multi-lingual capabilities', 'Previous expansion experience', 'Industry recognition'],
      culturalFit: ['Strategic thinking', 'Relationship building', 'Global perspective'],
    },
    confidential: false,
    status: 'active',
    applicantCount: 6,
    viewCount: 89,
    tags: ['Leadership Opportunity', 'International Expansion', 'High Autonomy'],
  },
];

export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Create demo users
    console.log('Creating demo users...');
    const userIds: { [key: string]: string } = {};
    
    for (const userData of demoUsers) {
      const existingUser = await userService.getUserByEmail(userData.email);
      if (!existingUser) {
        const userId = await userService.createUser(userData);
        userIds[userData.email] = userId;
        console.log(`Created user: ${userData.name} (${userData.email})`);
      } else {
        userIds[userData.email] = existingUser.id;
        console.log(`User already exists: ${userData.name} (${userData.email})`);
      }
    }

    // Create demo teams
    console.log('Creating demo teams...');
    const teamIds: string[] = [];
    
    for (let i = 0; i < demoTeams.length; i++) {
      const teamData = demoTeams[i];
      const leaderId = userIds[demoUsers[i].email]; // Assign team lead
      
      const teamWithLeader = {
        ...teamData,
        leaderId,
        memberIds: [leaderId], // Initially just the leader
      };
      
      const teamId = await teamService.createTeam(teamWithLeader);
      teamIds.push(teamId);
      console.log(`Created team: ${teamData.name}`);
    }

    // Create demo opportunities
    console.log('Creating demo opportunities...');
    const companyUserId = userIds['company@example.com'];
    
    for (const opportunityData of demoOpportunities) {
      const opportunityWithCompany = {
        ...opportunityData,
        companyId: companyUserId,
      };
      
      const opportunityId = await opportunityService.createOpportunity(opportunityWithCompany);
      console.log(`Created opportunity: ${opportunityData.title}`);
    }

    console.log('Database seeding completed successfully!');
    
    return {
      success: true,
      message: 'Database seeded with demo data',
      data: {
        users: Object.keys(userIds).length,
        teams: teamIds.length,
        opportunities: demoOpportunities.length,
      },
    };
    
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run the seed function if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  seedDatabase().then(result => {
    console.log('Seed result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
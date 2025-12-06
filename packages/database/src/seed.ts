import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils';

const prisma = new PrismaClient();

/**
 * DEMO DATA BEST PRACTICES
 * ========================
 *
 * This seed file creates demo/test accounts following industry best practices:
 *
 * 1. Demo Email Domain: All demo accounts use @demo.liftout.com
 *    - Easily identifiable as demo accounts
 *    - Can be filtered in queries/analytics
 *    - Won't conflict with real user signups
 *
 * 2. isDemo Flag: All demo users, teams, and companies have isDemo: true
 *    - Allows filtering in analytics dashboards
 *    - Can be hidden from production reports
 *    - Easy to identify in admin panels
 *
 * 3. Legacy Support: Old @example.com emails are kept for backwards compatibility
 *    - demo@example.com still works
 *    - company@example.com still works
 *
 * 4. Consistent Password: All demo accounts use 'password'
 *    - Easy to remember for demos
 *    - Documented in output
 *
 * To exclude demo data from queries:
 *   WHERE is_demo = false
 *   WHERE email NOT LIKE '%@demo.liftout.com'
 */

async function main() {
  console.log('🌱 Starting database seed...');
  console.log('');
  console.log('📋 Demo Account Convention:');
  console.log('   Email domain: @demo.liftout.com');
  console.log('   isDemo flag: true');
  console.log('   Password: password');
  console.log('');

  // Create skills
  const skills = await Promise.all([
    // Technical Skills
    prisma.skill.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: { name: 'JavaScript', category: 'Programming', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: { name: 'TypeScript', category: 'Programming', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'React' },
      update: {},
      create: { name: 'React', category: 'Frontend', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: { name: 'Node.js', category: 'Backend', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Python' },
      update: {},
      create: { name: 'Python', category: 'Programming', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'SQL' },
      update: {},
      create: { name: 'SQL', category: 'Database', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'PostgreSQL' },
      update: {},
      create: { name: 'PostgreSQL', category: 'Database', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'AWS' },
      update: {},
      create: { name: 'AWS', category: 'Cloud', industry: 'Technology' }
    }),
    // Design Skills
    prisma.skill.upsert({
      where: { name: 'UI/UX Design' },
      update: {},
      create: { name: 'UI/UX Design', category: 'Design', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Figma' },
      update: {},
      create: { name: 'Figma', category: 'Design Tools', industry: 'Technology' }
    }),
    // Business Skills
    prisma.skill.upsert({
      where: { name: 'Product Management' },
      update: {},
      create: { name: 'Product Management', category: 'Business', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Data Analysis' },
      update: {},
      create: { name: 'Data Analysis', category: 'Analytics', industry: 'Technology' }
    }),
    // Financial Skills
    prisma.skill.upsert({
      where: { name: 'Financial Modeling' },
      update: {},
      create: { name: 'Financial Modeling', category: 'Finance', industry: 'Financial Services' }
    }),
    prisma.skill.upsert({
      where: { name: 'Risk Management' },
      update: {},
      create: { name: 'Risk Management', category: 'Finance', industry: 'Financial Services' }
    }),
    prisma.skill.upsert({
      where: { name: 'Trading' },
      update: {},
      create: { name: 'Trading', category: 'Finance', industry: 'Financial Services' }
    }),
    // Data Science Skills
    prisma.skill.upsert({
      where: { name: 'Machine Learning' },
      update: {},
      create: { name: 'Machine Learning', category: 'Data Science', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'NLP' },
      update: {},
      create: { name: 'NLP', category: 'Data Science', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Deep Learning' },
      update: {},
      create: { name: 'Deep Learning', category: 'Data Science', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'MLOps' },
      update: {},
      create: { name: 'MLOps', category: 'Data Science', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'PyTorch' },
      update: {},
      create: { name: 'PyTorch', category: 'Data Science', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'TensorFlow' },
      update: {},
      create: { name: 'TensorFlow', category: 'Data Science', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Kubernetes' },
      update: {},
      create: { name: 'Kubernetes', category: 'Infrastructure', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Tableau' },
      update: {},
      create: { name: 'Tableau', category: 'Analytics', industry: 'Technology' }
    }),
    prisma.skill.upsert({
      where: { name: 'Business Intelligence' },
      update: {},
      create: { name: 'Business Intelligence', category: 'Analytics', industry: 'Technology' }
    }),
  ]);

  console.log(`✅ Created ${skills.length} skills`);

  // ==========================================================================
  // ADMIN USERS (NOT DEMO - Real platform admins)
  // ==========================================================================

  const adminPassword = await hashPassword('admin123!');
  await prisma.user.upsert({
    where: { email: 'admin@liftout.com' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'admin@liftout.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      userType: 'admin',
      emailVerified: true,
      profileCompleted: true,
      isDemo: false, // Real admin account
    }
  });

  const superAdminPassword = await hashPassword('liftoutadmin2025');
  await prisma.user.upsert({
    where: { email: 'enrizhulati@gmail.com' },
    update: {
      passwordHash: superAdminPassword,
      userType: 'admin',
      emailVerified: true,
      profileCompleted: true,
      twoFactorEnabled: false,
      isDemo: false, // Real admin account
    },
    create: {
      email: 'enrizhulati@gmail.com',
      passwordHash: superAdminPassword,
      firstName: 'Enriz',
      lastName: 'Hulati',
      userType: 'admin',
      emailVerified: true,
      profileCompleted: true,
      twoFactorEnabled: false,
      isDemo: false, // Real admin account
    }
  });

  console.log('✅ Created admin users (isDemo: false)');

  // ==========================================================================
  // DEMO TEAM MEMBERS - TechFlow Data Science Team
  // ==========================================================================

  const demoPassword = await hashPassword('password');

  // Demo team members with complete profiles
  // Using @demo.liftout.com for new accounts, keeping @example.com for backwards compatibility
  const demoTeamMembers = [
    {
      // Primary demo email + legacy alias
      email: 'alex.chen@demo.liftout.com',
      legacyEmail: 'demo@example.com',
      firstName: 'Alex',
      lastName: 'Chen',
      isLead: true,
      role: 'VP of Data Science',
      seniorityLevel: 'lead' as const,
      profile: {
        title: 'VP of Data Science & Team Lead',
        location: 'San Francisco, CA',
        bio: 'Passionate technologist with 10+ years leading high-performing data science and engineering teams. Built analytics platforms that drove $50M+ in business value. Stanford CS grad, ex-Google, ex-Stripe. I believe the best teams are built on trust, not just talent.',
        yearsExperience: 10,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        linkedinUrl: 'https://linkedin.com/in/alexchen-datascience',
        githubUrl: 'https://github.com/alexchen-ds',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'VP of Data Science',
        skillsSummary: 'Machine Learning, Python, SQL, Team Leadership, Financial Modeling, Strategic Planning',
        education: 'MS Computer Science, Stanford University',
        certifications: 'AWS Solutions Architect, Google Cloud ML Engineer',
      },
      keySkills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling'],
      contribution: 'Leads technical strategy and team development. Sets vision for analytics roadmap.',
    },
    {
      email: 'sarah.martinez@demo.liftout.com',
      legacyEmail: 'sarah.martinez@example.com',
      firstName: 'Sarah',
      lastName: 'Martinez',
      isLead: false,
      role: 'Principal Data Scientist',
      seniorityLevel: 'senior' as const,
      profile: {
        title: 'Principal Data Scientist',
        location: 'San Francisco, CA',
        bio: 'Data scientist with deep expertise in NLP and predictive modeling. Stanford PhD in Statistics. Published 12 papers in top ML conferences. Passionate about making AI accessible and ethical. Turned down $380K Anthropic offer to stay with this team.',
        yearsExperience: 7,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        linkedinUrl: 'https://linkedin.com/in/sarahmartinez-nlp',
        githubUrl: 'https://github.com/smartinez-nlp',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'Principal Data Scientist',
        skillsSummary: 'NLP, Deep Learning, PyTorch, Research, Statistical Analysis, Python',
        education: 'PhD Statistics, Stanford University; BS Mathematics, MIT',
        certifications: 'TensorFlow Developer Certificate',
      },
      keySkills: ['NLP', 'Deep Learning', 'PyTorch', 'Python', 'Statistical Analysis'],
      contribution: 'Leads NLP and unstructured data initiatives. Research lead for new model development.',
    },
    {
      email: 'marcus.johnson@demo.liftout.com',
      legacyEmail: 'marcus.johnson@example.com',
      firstName: 'Marcus',
      lastName: 'Johnson',
      isLead: false,
      role: 'Principal ML Engineer',
      seniorityLevel: 'senior' as const,
      profile: {
        title: 'Principal Machine Learning Engineer',
        location: 'Oakland, CA',
        bio: 'Full-stack ML engineer focused on taking models from research to production at scale. Built MLOps platforms handling 10M+ predictions/day. Kubernetes enthusiast, infrastructure geek. Expecting first child in 6 months - timeline matters for my move.',
        yearsExperience: 6,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
        linkedinUrl: 'https://linkedin.com/in/marcusjohnson-mlops',
        githubUrl: 'https://github.com/mjohnson-ml',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'Principal ML Engineer',
        skillsSummary: 'MLOps, Kubernetes, AWS, TensorFlow, Data Engineering, CI/CD',
        education: 'MS Computer Engineering, UC Berkeley; BS CS, Howard University',
        certifications: 'Kubernetes Administrator (CKA), AWS ML Specialty',
      },
      keySkills: ['MLOps', 'Kubernetes', 'AWS', 'TensorFlow', 'Data Engineering'],
      contribution: 'Owns ML infrastructure and deployment pipelines. Built our real-time serving platform.',
    },
    {
      email: 'priya.patel@demo.liftout.com',
      legacyEmail: 'priya.patel@example.com',
      firstName: 'Priya',
      lastName: 'Patel',
      isLead: false,
      role: 'Lead Analytics Manager',
      seniorityLevel: 'mid' as const,
      profile: {
        title: 'Lead Analytics Manager',
        location: 'San Jose, CA',
        bio: 'Data analyst passionate about translating complex data into actionable business insights. Rose from intern to team lead in 3 years. Known for making executives actually understand our metrics. Looking for my first management role at a company that values data-driven decisions.',
        yearsExperience: 4,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        linkedinUrl: 'https://linkedin.com/in/priyapatel-analytics',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'Lead Analytics Manager',
        skillsSummary: 'SQL, Tableau, Python, Business Intelligence, Data Visualization, Stakeholder Communication',
        education: 'BS Business Analytics, USC; Minor in Data Science',
        certifications: 'Tableau Desktop Specialist, Google Analytics',
      },
      keySkills: ['SQL', 'Tableau', 'Python', 'Business Intelligence', 'Data Visualization'],
      contribution: 'Drives analytics strategy and stakeholder reporting. Voice of the customer for data products.',
    },
  ];

  const createdMembers: { id: string; email: string; isLead: boolean; role: string; seniorityLevel: string; keySkills: string[]; contribution: string }[] = [];

  // Create each team member with both demo and legacy emails
  for (const member of demoTeamMembers) {
    // Create/update primary demo account
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {
        passwordHash: demoPassword,
        firstName: member.firstName,
        lastName: member.lastName,
        isDemo: true,
      },
      create: {
        email: member.email,
        passwordHash: demoPassword,
        firstName: member.firstName,
        lastName: member.lastName,
        userType: 'individual',
        emailVerified: true,
        profileCompleted: true,
        isDemo: true, // Mark as demo account
      }
    });

    // Create/update legacy email alias (for backwards compatibility)
    await prisma.user.upsert({
      where: { email: member.legacyEmail },
      update: {
        passwordHash: demoPassword,
        firstName: member.firstName,
        lastName: member.lastName,
        isDemo: true,
      },
      create: {
        email: member.legacyEmail,
        passwordHash: demoPassword,
        firstName: member.firstName,
        lastName: member.lastName,
        userType: 'individual',
        emailVerified: true,
        profileCompleted: true,
        isDemo: true, // Mark as demo account
      }
    });

    // Upsert the profile with complete information
    await prisma.individualProfile.upsert({
      where: { userId: user.id },
      update: {
        title: member.profile.title,
        location: member.profile.location,
        bio: member.profile.bio,
        yearsExperience: member.profile.yearsExperience,
        profilePhotoUrl: member.profile.profilePhotoUrl,
        linkedinUrl: member.profile.linkedinUrl,
        githubUrl: member.profile.githubUrl || null,
        currentEmployer: member.profile.currentEmployer,
        currentTitle: member.profile.currentTitle,
        skillsSummary: member.profile.skillsSummary,
        availabilityStatus: 'open_to_opportunities',
        remotePreference: 'hybrid',
      },
      create: {
        userId: user.id,
        title: member.profile.title,
        location: member.profile.location,
        bio: member.profile.bio,
        yearsExperience: member.profile.yearsExperience,
        profilePhotoUrl: member.profile.profilePhotoUrl,
        linkedinUrl: member.profile.linkedinUrl,
        githubUrl: member.profile.githubUrl || null,
        currentEmployer: member.profile.currentEmployer,
        currentTitle: member.profile.currentTitle,
        skillsSummary: member.profile.skillsSummary,
        availabilityStatus: 'open_to_opportunities',
        remotePreference: 'hybrid',
      }
    });

    createdMembers.push({
      id: user.id,
      email: user.email,
      isLead: member.isLead,
      role: member.role,
      seniorityLevel: member.seniorityLevel,
      keySkills: member.keySkills,
      contribution: member.contribution,
    });

    console.log(`✅ Created demo team member: ${member.email} (legacy: ${member.legacyEmail})`);
  }

  // Get demo user (team lead)
  const demoUser = createdMembers.find(m => m.email === 'alex.chen@demo.liftout.com')!;

  // ==========================================================================
  // DEMO COMPANY USERS - NextGen Financial
  // ==========================================================================

  // Sarah Rodriguez - Company Admin (Owner)
  const sarahRodriguez = await prisma.user.upsert({
    where: { email: 'sarah.rodriguez@demo.liftout.com' },
    update: {
      passwordHash: demoPassword,
      isDemo: true,
    },
    create: {
      email: 'sarah.rodriguez@demo.liftout.com',
      passwordHash: demoPassword,
      firstName: 'Sarah',
      lastName: 'Rodriguez',
      userType: 'company',
      emailVerified: true,
      profileCompleted: true,
      isDemo: true,
    }
  });

  // Legacy company@example.com for backwards compatibility
  const demoCompanyUser = await prisma.user.upsert({
    where: { email: 'company@example.com' },
    update: {
      passwordHash: demoPassword,
      isDemo: true,
    },
    create: {
      email: 'company@example.com',
      passwordHash: demoPassword,
      firstName: 'Sarah',
      lastName: 'Rodriguez',
      userType: 'company',
      emailVerified: true,
      profileCompleted: true,
      isDemo: true,
    }
  });

  // James Liu - Company Member (Invited by Sarah)
  const jamesLiu = await prisma.user.upsert({
    where: { email: 'james.liu@demo.liftout.com' },
    update: {
      passwordHash: demoPassword,
      isDemo: true,
    },
    create: {
      email: 'james.liu@demo.liftout.com',
      passwordHash: demoPassword,
      firstName: 'James',
      lastName: 'Liu',
      userType: 'company',
      emailVerified: true,
      profileCompleted: true,
      isDemo: true,
    }
  });

  console.log('✅ Created demo company users:');
  console.log('   - sarah.rodriguez@demo.liftout.com (Admin)');
  console.log('   - james.liu@demo.liftout.com (Member)');
  console.log('   - company@example.com (Legacy alias)');

  // ==========================================================================
  // DEMO COMPANY - NextGen Financial
  // ==========================================================================

  const existingCompany = await prisma.company.findUnique({
    where: { slug: 'nextgen-financial' }
  });

  // Also check for legacy slug
  const legacyCompany = await prisma.company.findUnique({
    where: { slug: 'demo-company' }
  });

  // Delete legacy company if exists (to replace with NextGen)
  if (legacyCompany && !existingCompany) {
    await prisma.companyUser.deleteMany({
      where: { companyId: legacyCompany.id }
    });
    await prisma.company.delete({
      where: { id: legacyCompany.id }
    });
    console.log('✅ Cleaned up legacy demo company');
  }

  if (!existingCompany) {
    await prisma.company.create({
      data: {
        name: 'NextGen Financial',
        slug: 'nextgen-financial',
        description: 'NextGen Financial is a Series B fintech building the future of financial analytics. We\'re transforming how financial institutions leverage data for decision-making. Backed by Andreessen Horowitz and Sequoia, we\'re scaling rapidly across banking, insurance, and wealth management. We\'ve successfully hired 3 intact teams through liftout strategies in the past 18 months.',
        industry: 'Financial Services',
        companySize: 'large',
        foundedYear: 2019,
        websiteUrl: 'https://nextgenfinancial.com',
        logoUrl: 'https://ui-avatars.com/api/?name=NextGen+Financial&background=4F46E5&color=fff&size=128',
        headquartersLocation: 'New York, NY',
        locations: JSON.stringify(['New York, NY', 'Austin, TX', 'London, UK']),
        companyCulture: 'Innovative, fast-paced, and data-driven. We value collaboration, intellectual curiosity, and impact. Remote-friendly with quarterly all-hands in NYC. Our values: Data-Driven Decisions, Customer Obsession, Move Fast Stay Focused, Transparent by Default, Own the Outcome.',
        employeeCount: 850,
        fundingStage: 'Series B',
        totalFunding: BigInt(125000000), // $125M
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        isDemo: true, // Mark as demo company
        users: {
          create: [
            {
              userId: sarahRodriguez.id,
              role: 'admin',
              isPrimaryContact: true,
              title: 'VP of Talent Acquisition',
            },
            {
              userId: jamesLiu.id,
              role: 'member',
              isPrimaryContact: false,
              title: 'Senior Talent Manager',
              invitedBy: sarahRodriguez.id,
            },
            {
              userId: demoCompanyUser.id,
              role: 'admin',
              isPrimaryContact: false,
              title: 'VP of Talent Acquisition',
            }
          ]
        }
      }
    });
    console.log('✅ Created NextGen Financial demo company (isDemo: true)');
  } else {
    console.log('✅ NextGen Financial demo company already exists');
  }

  // ==========================================================================
  // DEMO TEAM - TechFlow Data Science Team
  // ==========================================================================

  const existingTeam = await prisma.team.findFirst({
    where: { slug: 'techflow-data-science' }
  });

  let demoTeam;
  if (!existingTeam) {
    demoTeam = await prisma.team.create({
      data: {
        name: 'TechFlow Data Science Team',
        slug: 'techflow-data-science',
        description: 'Elite data science team with 3.5 years working together at TechFlow Analytics. We specialize in fintech analytics, ML platform development, and turning messy data into business value. Shipped 12 major products together, including a real-time fraud detection system processing 10M transactions/day. Looking for our next challenge where we can build from the ground up.',
        industry: 'Financial Services',
        specialization: 'Data Science & Machine Learning',
        size: 4,
        location: 'San Francisco, CA',
        remoteStatus: 'hybrid',
        availabilityStatus: 'available',
        yearsWorkingTogether: 3.5,
        teamCulture: 'Collaborative, data-driven, and focused on continuous learning. We do weekly paper reading sessions, monthly hackathons, and believe in blameless postmortems. Psychological safety is our superpower.',
        workingStyle: 'Agile with 2-week sprints. Daily async standups, weekly syncs, biweekly retrospectives. We document everything and believe in working smart, not long.',
        communicationStyle: 'Direct and transparent. We use Slack for async, Notion for docs, and protect deep work time in the mornings.',
        notableAchievements: 'Built fraud detection system saving $15M/year. Reduced ML model deployment time from 2 weeks to 2 hours. 12 shipped products, 0 major incidents in production.',
        visibility: 'public',
        salaryExpectationMin: 200000,
        salaryExpectationMax: 400000,
        relocationWillingness: true,
        createdBy: demoUser.id,
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        isDemo: true, // Mark as demo team
      }
    });
    console.log('✅ Created TechFlow demo team (isDemo: true)');
  } else {
    demoTeam = existingTeam;
    console.log('✅ TechFlow demo team already exists');
  }

  // Link team members to the demo team
  for (const member of createdMembers) {
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: demoTeam.id,
        userId: member.id
      }
    });

    if (!existingMembership) {
      await prisma.teamMember.create({
        data: {
          teamId: demoTeam.id,
          userId: member.id,
          role: member.role,
          seniorityLevel: member.seniorityLevel as 'entry' | 'mid' | 'senior' | 'lead' | 'principal',
          isLead: member.isLead,
          isAdmin: member.isLead,
          keySkills: JSON.stringify(member.keySkills),
          contribution: member.contribution,
          status: 'active',
          joinDate: new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000), // 3.5 years ago
        }
      });
      console.log(`✅ Linked ${member.email} to demo team`);
    }
  }

  // ==========================================================================
  // SUMMARY
  // ==========================================================================

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🎉 Database seeded successfully!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 DEMO DATA MARKERS:');
  console.log('   • Email domain: @demo.liftout.com');
  console.log('   • isDemo flag: true on all demo users/teams/companies');
  console.log('   • Filter in queries: WHERE is_demo = false');
  console.log('');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('👥 DEMO TEAM USERS (TechFlow Data Science):');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('   Alex Chen (Team Lead):');
  console.log('     → alex.chen@demo.liftout.com / password');
  console.log('     → demo@example.com / password (legacy)');
  console.log('');
  console.log('   Sarah Martinez (Data Scientist):');
  console.log('     → sarah.martinez@demo.liftout.com / password');
  console.log('     → sarah.martinez@example.com / password (legacy)');
  console.log('');
  console.log('   Marcus Johnson (ML Engineer):');
  console.log('     → marcus.johnson@demo.liftout.com / password');
  console.log('     → marcus.johnson@example.com / password (legacy)');
  console.log('');
  console.log('   Priya Patel (Analytics Manager):');
  console.log('     → priya.patel@demo.liftout.com / password');
  console.log('     → priya.patel@example.com / password (legacy)');
  console.log('');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('🏢 DEMO COMPANY USERS (NextGen Financial):');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('   Sarah Rodriguez (Company Admin):');
  console.log('     → sarah.rodriguez@demo.liftout.com / password');
  console.log('     → company@example.com / password (legacy)');
  console.log('');
  console.log('   James Liu (Company Member):');
  console.log('     → james.liu@demo.liftout.com / password');
  console.log('');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('🔐 PLATFORM ADMINS (NOT demo accounts):');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('   admin@liftout.com / admin123!');
  console.log('   enrizhulati@gmail.com / liftoutadmin2025');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

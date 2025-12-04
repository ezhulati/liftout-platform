import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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
    })
  ]);

  console.log(`✅ Created ${skills.length} skills`);

  // Create admin user
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
      profileCompleted: true
    }
  });

  // Create super admin user (Enriz)
  const superAdminPassword = await hashPassword('liftoutadmin2025');
  await prisma.user.upsert({
    where: { email: 'enrizhulati@gmail.com' },
    update: {
      passwordHash: superAdminPassword,
      userType: 'admin',
      emailVerified: true,
      profileCompleted: true,
      twoFactorEnabled: false,
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
    }
  });

  console.log('✅ Created admin users');

  // Create demo password
  const demoPassword = await hashPassword('password');

  // Demo team members with photos
  const demoTeamMembers = [
    {
      email: 'demo@example.com',
      firstName: 'Alex',
      lastName: 'Chen',
      isLead: true,
      role: 'Tech Lead',
      seniorityLevel: 'lead' as const,
      profile: {
        title: 'Senior Data Scientist & Team Lead',
        location: 'San Francisco, CA',
        bio: 'Passionate technologist with 10+ years leading high-performing data science and engineering teams.',
        yearsExperience: 10,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        linkedinUrl: 'https://linkedin.com/in/alexchen',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'VP of Data Science',
        skillsSummary: 'Machine Learning, Python, SQL, Team Leadership, Financial Modeling',
      },
      keySkills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership'],
      contribution: 'Leads technical strategy and team development',
    },
    {
      email: 'sarah.martinez@example.com',
      firstName: 'Sarah',
      lastName: 'Martinez',
      isLead: false,
      role: 'Senior Data Scientist',
      seniorityLevel: 'senior' as const,
      profile: {
        title: 'Senior Data Scientist',
        location: 'San Francisco, CA',
        bio: 'Data scientist with deep expertise in NLP and predictive modeling. Stanford PhD in Statistics.',
        yearsExperience: 7,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        linkedinUrl: 'https://linkedin.com/in/sarahmartinez',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'Senior Data Scientist',
        skillsSummary: 'NLP, Deep Learning, PyTorch, Research, Statistical Analysis',
      },
      keySkills: ['NLP', 'Deep Learning', 'PyTorch', 'Python'],
      contribution: 'Leads NLP and unstructured data initiatives',
    },
    {
      email: 'marcus.johnson@example.com',
      firstName: 'Marcus',
      lastName: 'Johnson',
      isLead: false,
      role: 'ML Engineer',
      seniorityLevel: 'senior' as const,
      profile: {
        title: 'Machine Learning Engineer',
        location: 'Oakland, CA',
        bio: 'Full-stack ML engineer focused on taking models from research to production.',
        yearsExperience: 6,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
        linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'ML Engineer',
        skillsSummary: 'MLOps, Kubernetes, AWS, TensorFlow, Data Engineering',
      },
      keySkills: ['MLOps', 'Kubernetes', 'AWS', 'TensorFlow'],
      contribution: 'Owns ML infrastructure and deployment pipelines',
    },
    {
      email: 'priya.patel@example.com',
      firstName: 'Priya',
      lastName: 'Patel',
      isLead: false,
      role: 'Data Analyst',
      seniorityLevel: 'mid' as const,
      profile: {
        title: 'Senior Data Analyst',
        location: 'San Jose, CA',
        bio: 'Data analyst passionate about translating complex data into actionable business insights.',
        yearsExperience: 4,
        profilePhotoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        linkedinUrl: 'https://linkedin.com/in/priyapatel',
        currentEmployer: 'TechFlow Analytics',
        currentTitle: 'Senior Data Analyst',
        skillsSummary: 'SQL, Tableau, Python, Business Intelligence, Data Visualization',
      },
      keySkills: ['SQL', 'Tableau', 'Python', 'Business Intelligence'],
      contribution: 'Drives analytics strategy and stakeholder reporting',
    },
  ];

  const createdMembers: { id: string; email: string; isLead: boolean; role: string; seniorityLevel: string; keySkills: string[]; contribution: string }[] = [];

  // Create each team member
  for (const member of demoTeamMembers) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {
        passwordHash: demoPassword,
        firstName: member.firstName,
        lastName: member.lastName,
      },
      create: {
        email: member.email,
        passwordHash: demoPassword,
        firstName: member.firstName,
        lastName: member.lastName,
        userType: 'individual',
        emailVerified: true,
        profileCompleted: true,
      }
    });

    // Upsert the profile
    await prisma.individualProfile.upsert({
      where: { userId: user.id },
      update: {
        title: member.profile.title,
        location: member.profile.location,
        bio: member.profile.bio,
        yearsExperience: member.profile.yearsExperience,
        profilePhotoUrl: member.profile.profilePhotoUrl,
        linkedinUrl: member.profile.linkedinUrl,
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

    console.log(`✅ Created team member: ${user.email}`);
  }

  // Get demo user (team lead)
  const demoUser = createdMembers.find(m => m.email === 'demo@example.com')!;

  // Create demo company user
  const demoCompanyUser = await prisma.user.upsert({
    where: { email: 'company@example.com' },
    update: { passwordHash: demoPassword },
    create: {
      email: 'company@example.com',
      passwordHash: demoPassword,
      firstName: 'Company',
      lastName: 'Demo',
      userType: 'company',
      emailVerified: true,
      profileCompleted: true
    }
  });

  console.log('✅ Created demo company user (company@example.com / password)');

  // Create demo company
  const existingCompany = await prisma.company.findUnique({
    where: { slug: 'demo-company' }
  });

  if (!existingCompany) {
    await prisma.company.create({
      data: {
        name: 'Demo Company',
        slug: 'demo-company',
        description: 'Demo company for testing the platform.',
        industry: 'Technology',
        companySize: 'large',
        foundedYear: 2010,
        websiteUrl: 'https://demo-company.com',
        headquartersLocation: 'New York, NY',
        companyCulture: 'Innovative and collaborative.',
        employeeCount: 500,
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        users: {
          create: {
            userId: demoCompanyUser.id,
            role: 'admin',
            isPrimaryContact: true,
            title: 'Head of Talent Acquisition'
          }
        }
      }
    });
    console.log('✅ Created demo company');
  }

  // Create demo team
  const existingTeam = await prisma.team.findFirst({
    where: { slug: 'techflow-data-science' }
  });

  let demoTeam;
  if (!existingTeam) {
    demoTeam = await prisma.team.create({
      data: {
        name: 'TechFlow Data Science Team',
        slug: 'techflow-data-science',
        description: 'Elite data science team with 3.5 years working together, specializing in fintech analytics and machine learning.',
        industry: 'Financial Services',
        specialization: 'Data Science & Machine Learning',
        size: 4,
        location: 'San Francisco, CA',
        remoteStatus: 'hybrid',
        availabilityStatus: 'available',
        yearsWorkingTogether: 3.5,
        teamCulture: 'Collaborative, data-driven, and focused on continuous learning.',
        workingStyle: 'Agile with 2-week sprints. Daily standups, weekly retrospectives.',
        visibility: 'public',
        salaryExpectationMin: 180000,
        salaryExpectationMax: 280000,
        relocationWillingness: true,
        createdBy: demoUser.id,
        verificationStatus: 'verified',
        verifiedAt: new Date(),
      }
    });
    console.log('✅ Created demo team');
  } else {
    demoTeam = existingTeam;
    console.log('✅ Demo team already exists');
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
          joinDate: new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000),
        }
      });
      console.log(`✅ Linked ${member.email} to demo team`);
    }
  }

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Team User: demo@example.com / password');
  console.log('  Company User: company@example.com / password');
  console.log('  Admin: admin@liftout.com / admin123!');
  console.log('  Super Admin: enrizhulati@gmail.com / liftoutadmin2025');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

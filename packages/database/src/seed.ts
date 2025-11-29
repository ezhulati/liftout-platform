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
  const adminUser = await prisma.user.upsert({
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
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'enrizhulati@gmail.com' },
    update: {
      passwordHash: superAdminPassword,
      userType: 'admin',
      emailVerified: true,
      profileCompleted: true,
      twoFactorEnabled: false, // Allow initial login without 2FA
    },
    create: {
      email: 'enrizhulati@gmail.com',
      passwordHash: superAdminPassword,
      firstName: 'Enriz',
      lastName: 'Hulati',
      userType: 'admin',
      emailVerified: true,
      profileCompleted: true,
      twoFactorEnabled: false, // Will be set up on first admin login
    }
  });

  console.log('✅ Created admin users');

  // Create sample individual users
  const password = await hashPassword('password123!');
  const demoPassword = await hashPassword('password');

  // Create documented demo users (demo@example.com / password)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { passwordHash: demoPassword },
    create: {
      email: 'demo@example.com',
      passwordHash: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      userType: 'individual',
      emailVerified: true,
      profileCompleted: true,
      profile: {
        create: {
          title: 'Team Lead',
          location: 'San Francisco, CA',
          bio: 'Demo team lead user for testing the platform.',
          yearsExperience: 10,
          availabilityStatus: 'open_to_opportunities',
          salaryExpectationMin: 180000,
          salaryExpectationMax: 250000,
          remotePreference: 'hybrid',
          skillsSummary: 'Leadership, Full-Stack Development, Team Management'
        }
      }
    }
  });

  console.log('✅ Created demo team user (demo@example.com / password)');
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      passwordHash: password,
      firstName: 'John',
      lastName: 'Doe',
      userType: 'individual',
      emailVerified: true,
      profileCompleted: true,
      profile: {
        create: {
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          bio: 'Experienced full-stack developer with 8 years in the industry.',
          yearsExperience: 8,
          availabilityStatus: 'open_to_opportunities',
          salaryExpectationMin: 150000,
          salaryExpectationMax: 200000,
          remotePreference: 'hybrid',
          skillsSummary: 'JavaScript, TypeScript, React, Node.js, PostgreSQL'
        }
      }
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      passwordHash: password,
      firstName: 'Jane',
      lastName: 'Smith',
      userType: 'individual',
      emailVerified: true,
      profileCompleted: true,
      profile: {
        create: {
          title: 'Product Designer',
          location: 'San Francisco, CA',
          bio: 'Creative product designer with a passion for user experience.',
          yearsExperience: 6,
          availabilityStatus: 'open_to_opportunities',
          salaryExpectationMin: 120000,
          salaryExpectationMax: 160000,
          remotePreference: 'hybrid',
          skillsSummary: 'UI/UX Design, Figma, User Research, Prototyping'
        }
      }
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'mike.johnson@example.com' },
    update: {},
    create: {
      email: 'mike.johnson@example.com',
      passwordHash: password,
      firstName: 'Mike',
      lastName: 'Johnson',
      userType: 'individual',
      emailVerified: true,
      profileCompleted: true,
      profile: {
        create: {
          title: 'DevOps Engineer',
          location: 'San Francisco, CA',
          bio: 'Infrastructure and deployment specialist.',
          yearsExperience: 7,
          availabilityStatus: 'open_to_opportunities',
          salaryExpectationMin: 140000,
          salaryExpectationMax: 180000,
          remotePreference: 'remote',
          skillsSummary: 'AWS, Docker, Kubernetes, Terraform, Python'
        }
      }
    }
  });

  // Add skills to users
  await prisma.userSkill.createMany({
    data: [
      { userId: user1.id, skillId: skills[0].id, proficiencyLevel: 'expert', yearsExperience: 8 }, // JavaScript
      { userId: user1.id, skillId: skills[1].id, proficiencyLevel: 'expert', yearsExperience: 5 }, // TypeScript
      { userId: user1.id, skillId: skills[2].id, proficiencyLevel: 'expert', yearsExperience: 6 }, // React
      { userId: user1.id, skillId: skills[3].id, proficiencyLevel: 'advanced', yearsExperience: 7 }, // Node.js
      
      { userId: user2.id, skillId: skills[8].id, proficiencyLevel: 'expert', yearsExperience: 6 }, // UI/UX Design
      { userId: user2.id, skillId: skills[9].id, proficiencyLevel: 'expert', yearsExperience: 4 }, // Figma
      
      { userId: user3.id, skillId: skills[7].id, proficiencyLevel: 'expert', yearsExperience: 7 }, // AWS
      { userId: user3.id, skillId: skills[4].id, proficiencyLevel: 'advanced', yearsExperience: 5 }, // Python
    ],
    skipDuplicates: true
  });

  console.log('✅ Created sample individual users');

  // Create or refresh a sample team (idempotent across runs)
  const teamSlug = 'full-stack-dev-team';
  const team = await prisma.team.upsert({
    where: { slug: teamSlug },
    update: {
      description: 'Experienced full-stack development team specializing in modern web applications.',
      industry: 'Technology',
      specialization: 'Web Development',
      size: 3,
      location: 'San Francisco, CA',
      remoteStatus: 'hybrid',
      availabilityStatus: 'available',
      yearsWorkingTogether: 2.5,
      teamCulture: 'Collaborative, agile, and innovation-focused.',
      workingStyle: 'Agile methodology with regular standups and sprint planning.',
      notableAchievements: 'Built and launched 3 successful SaaS products.',
      salaryExpectationMin: 450000,
      salaryExpectationMax: 600000,
    },
    create: {
      name: 'Full-Stack Development Team',
      slug: teamSlug,
      description: 'Experienced full-stack development team specializing in modern web applications.',
      industry: 'Technology',
      specialization: 'Web Development',
      size: 3,
      location: 'San Francisco, CA',
      remoteStatus: 'hybrid',
      availabilityStatus: 'available',
      yearsWorkingTogether: 2.5,
      teamCulture: 'Collaborative, agile, and innovation-focused.',
      workingStyle: 'Agile methodology with regular standups and sprint planning.',
      notableAchievements: 'Built and launched 3 successful SaaS products.',
      salaryExpectationMin: 450000,
      salaryExpectationMax: 600000,
      createdBy: user1.id
    }
  });

  // Ensure team memberships exist
  await prisma.teamMember.createMany({
    data: [
      {
        teamId: team.id,
        userId: user1.id,
        role: 'Tech Lead',
        seniorityLevel: 'senior',
        isAdmin: true,
        isLead: true,
        status: 'active',
        joinedAt: new Date()
      },
      {
        teamId: team.id,
        userId: user2.id,
        role: 'Product Designer',
        seniorityLevel: 'senior',
        isAdmin: false,
        isLead: false,
        status: 'active',
        joinedAt: new Date()
      },
      {
        teamId: team.id,
        userId: user3.id,
        role: 'DevOps Engineer',
        seniorityLevel: 'senior',
        isAdmin: false,
        isLead: false,
        status: 'active',
        joinedAt: new Date()
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Created sample team');

  // Create documented company demo user (company@example.com / password)
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

  // Create demo company for the demo company user
  const demoCompany = await prisma.company.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
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

  console.log('✅ Created demo company user (company@example.com / password)');

  // Create company user
  const companyUser = await prisma.user.upsert({
    where: { email: 'recruiter@techcorp.com' },
    update: {},
    create: {
      email: 'recruiter@techcorp.com',
      passwordHash: password,
      firstName: 'Sarah',
      lastName: 'Wilson',
      userType: 'company',
      emailVerified: true,
      profileCompleted: true
    }
  });

  // Create sample company
  const company = await prisma.company.upsert({
    where: { slug: 'techcorp-inc' },
    update: {
      description: 'Leading technology company building the future of software.',
      industry: 'Technology',
      companySize: 'medium',
      foundedYear: 2015,
      websiteUrl: 'https://techcorp.com',
      headquartersLocation: 'San Francisco, CA',
      companyCulture: 'Innovation-driven with work-life balance.',
      employeeCount: 250,
      verificationStatus: 'verified',
      verifiedAt: new Date()
    },
    create: {
      name: 'TechCorp Inc.',
      slug: 'techcorp-inc',
      description: 'Leading technology company building the future of software.',
      industry: 'Technology',
      companySize: 'medium',
      foundedYear: 2015,
      websiteUrl: 'https://techcorp.com',
      headquartersLocation: 'San Francisco, CA',
      companyCulture: 'Innovation-driven with work-life balance.',
      employeeCount: 250,
      verificationStatus: 'verified',
      verifiedAt: new Date()
    }
  });

  await prisma.companyUser.createMany({
    data: [
      {
        companyId: company.id,
        userId: companyUser.id,
        role: 'recruiter',
        isPrimaryContact: true,
        title: 'Senior Technical Recruiter'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Created sample company');

  // Create sample opportunity
  let opportunity = await prisma.opportunity.findFirst({
    where: {
      title: 'Senior Full-Stack Development Team',
      companyId: company.id
    }
  });

  if (!opportunity) {
    opportunity = await prisma.opportunity.create({
      data: {
        title: 'Senior Full-Stack Development Team',
        description: 'We are looking for an experienced full-stack development team to help build our next-generation SaaS platform. The ideal team will have strong experience in React, Node.js, and cloud infrastructure.',
        companyId: company.id,
        teamSizeMin: 3,
        teamSizeMax: 5,
        requiredSkills: [
          { skillId: skills[0].id, name: 'JavaScript', requiredLevel: 'expert' },
          { skillId: skills[1].id, name: 'TypeScript', requiredLevel: 'advanced' },
          { skillId: skills[2].id, name: 'React', requiredLevel: 'expert' }
        ],
        preferredSkills: [
          { skillId: skills[3].id, name: 'Node.js', requiredLevel: 'advanced' },
          { skillId: skills[7].id, name: 'AWS', requiredLevel: 'intermediate' }
        ],
        industry: 'Technology',
        department: 'Engineering',
        location: 'San Francisco, CA',
        remotePolicy: 'hybrid',
        compensationMin: 400000,
        compensationMax: 600000,
        equityOffered: true,
        equityRange: '0.1% - 0.5%',
        benefits: ['Health Insurance', 'Dental', '401k', 'Unlimited PTO'],
        urgency: 'high',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        contractType: 'full_time',
        createdBy: companyUser.id,
        status: 'active'
      }
    });
  } else {
    opportunity = await prisma.opportunity.update({
      where: { id: opportunity.id },
      data: {
        status: 'active',
        compensationMin: 400000,
        compensationMax: 600000,
        remotePolicy: 'hybrid',
        industry: 'Technology',
        location: 'San Francisco, CA',
        urgency: 'high'
      }
    });
  }

  console.log('✅ Created sample opportunity');

  // Create sample application
  const existingApplication = await prisma.teamApplication.findFirst({
    where: {
      teamId: team.id,
      opportunityId: opportunity.id
    }
  });

  if (!existingApplication) {
    await prisma.teamApplication.create({
      data: {
        teamId: team.id,
        opportunityId: opportunity.id,
        coverLetter: 'We are excited to apply for this opportunity. Our team has extensive experience building modern web applications and we believe we would be a great fit.',
        proposedCompensation: 550000,
        availabilityDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'submitted',
        appliedBy: user1.id
      }
    });
  }

  console.log('✅ Created sample application');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

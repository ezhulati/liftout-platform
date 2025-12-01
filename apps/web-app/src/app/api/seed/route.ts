import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SeniorityLevel, UrgencyLevel, RemotePreference, OpportunityStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Secret key to protect this endpoint
const SEED_SECRET = process.env.SEED_SECRET || 'liftout-seed-2024';

export async function POST(request: NextRequest) {
  try {
    // Check for secret key in header or query param
    const authHeader = request.headers.get('x-seed-secret');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    if (authHeader !== SEED_SECRET && querySecret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - provide x-seed-secret header or ?secret= query param' },
        { status: 401 }
      );
    }

    const results: string[] = [];

    // Hash password for demo users
    const demoPassword = await bcrypt.hash('password', 12);

    // Demo team member data with full profiles and headshots
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
          bio: 'Passionate technologist with 10+ years leading high-performing data science and engineering teams. Specialized in fintech analytics, machine learning, and building scalable systems that deliver measurable business value. Led my current team through a successful liftout in 2022, and we\'ve been thriving ever since.',
          yearsExperience: 10,
          profilePhotoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          linkedinUrl: 'https://linkedin.com/in/alexchen',
          githubUrl: 'https://github.com/alexchen',
          currentEmployer: 'TechFlow Analytics',
          currentTitle: 'VP of Data Science',
          skillsSummary: 'Machine Learning, Python, SQL, Team Leadership, Financial Modeling, Data Architecture',
          achievements: 'Led team that reduced fraud detection false positives by 35%. Built predictive models generating $2.1M annual savings. Mentored 12+ junior data scientists.',
        },
        keySkills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling'],
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
          bio: 'Data scientist with deep expertise in NLP and predictive modeling. Stanford PhD in Statistics with 7 years of industry experience. Love working on complex problems that have real-world impact, especially in healthcare and finance.',
          yearsExperience: 7,
          profilePhotoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          linkedinUrl: 'https://linkedin.com/in/sarahmartinez',
          githubUrl: 'https://github.com/smartinez',
          currentEmployer: 'TechFlow Analytics',
          currentTitle: 'Senior Data Scientist',
          skillsSummary: 'NLP, Deep Learning, PyTorch, Research, Statistical Analysis',
          achievements: 'Published 5 papers in top ML conferences. Developed sentiment analysis system processing 1M+ daily transactions.',
        },
        keySkills: ['NLP', 'Deep Learning', 'PyTorch', 'Python', 'Statistical Analysis'],
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
          bio: 'Full-stack ML engineer focused on taking models from research to production. 6 years experience building and deploying ML systems at scale. Expert in MLOps, cloud infrastructure, and real-time prediction systems.',
          yearsExperience: 6,
          profilePhotoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
          linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
          githubUrl: 'https://github.com/mjohnson',
          currentEmployer: 'TechFlow Analytics',
          currentTitle: 'ML Engineer',
          skillsSummary: 'MLOps, Kubernetes, AWS, TensorFlow, Data Engineering',
          achievements: 'Built ML pipeline processing 10M+ predictions/day. Reduced model deployment time from 2 weeks to 2 hours.',
        },
        keySkills: ['MLOps', 'Kubernetes', 'AWS', 'TensorFlow', 'Data Engineering'],
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
          bio: 'Data analyst passionate about translating complex data into actionable business insights. 4 years experience in fintech with expertise in visualization, reporting, and stakeholder communication. Bridge between technical team and business leadership.',
          yearsExperience: 4,
          profilePhotoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
          linkedinUrl: 'https://linkedin.com/in/priyapatel',
          currentEmployer: 'TechFlow Analytics',
          currentTitle: 'Senior Data Analyst',
          skillsSummary: 'SQL, Tableau, Python, Business Intelligence, Data Visualization',
          achievements: 'Created executive dashboard used by C-suite. Identified $500K cost savings through data analysis.',
        },
        keySkills: ['SQL', 'Tableau', 'Python', 'Business Intelligence', 'Data Visualization'],
        contribution: 'Drives analytics strategy and stakeholder reporting',
      },
    ];

    const createdMembers: { id: string; email: string; isLead: boolean; role: string; seniorityLevel: string; keySkills: string[]; contribution: string }[] = [];

    // Create each team member as a user with full profile
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
          githubUrl: member.profile.githubUrl,
          currentEmployer: member.profile.currentEmployer,
          currentTitle: member.profile.currentTitle,
          skillsSummary: member.profile.skillsSummary,
          achievements: member.profile.achievements,
          availabilityStatus: 'open_to_opportunities',
          salaryExpectationMin: 180000,
          salaryExpectationMax: 280000,
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
          githubUrl: member.profile.githubUrl,
          currentEmployer: member.profile.currentEmployer,
          currentTitle: member.profile.currentTitle,
          skillsSummary: member.profile.skillsSummary,
          achievements: member.profile.achievements,
          availabilityStatus: 'open_to_opportunities',
          salaryExpectationMin: 180000,
          salaryExpectationMax: 280000,
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

      results.push(`Created/updated team member: ${user.email}`);
    }

    // Get the demo user (team lead) for team creation
    const demoUser = createdMembers.find(m => m.email === 'demo@example.com')!;
    results.push(`Demo user ready: ${demoUser.email}`);

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
    results.push(`Created/updated company user: ${demoCompanyUser.email}`);

    // Check if demo company exists, create if not
    const existingCompany = await prisma.company.findUnique({
      where: { slug: 'demo-company' }
    });

    if (!existingCompany) {
      const demoCompany = await prisma.company.create({
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
      results.push(`Created demo company: ${demoCompany.name}`);
    } else {
      // Make sure company user is linked
      const existingMembership = await prisma.companyUser.findFirst({
        where: {
          userId: demoCompanyUser.id,
          companyId: existingCompany.id
        }
      });

      if (!existingMembership) {
        await prisma.companyUser.create({
          data: {
            userId: demoCompanyUser.id,
            companyId: existingCompany.id,
            role: 'admin',
            isPrimaryContact: true,
            title: 'Head of Talent Acquisition'
          }
        });
        results.push(`Linked company user to existing demo company`);
      } else {
        results.push(`Demo company already exists and user is linked`);
      }
    }

    // Create demo team and link all members
    const existingDemoTeam = await prisma.team.findFirst({
      where: { slug: 'techflow-data-science' }
    });

    let demoTeam;
    if (!existingDemoTeam) {
      demoTeam = await prisma.team.create({
        data: {
          name: 'TechFlow Data Science Team',
          slug: 'techflow-data-science',
          description: 'Elite data science team with 3.5 years working together, specializing in fintech analytics and machine learning. We\'ve successfully completed a liftout in 2022 and are open to new strategic opportunities with the right organization.',
          industry: 'Financial Services',
          specialization: 'Data Science & Machine Learning',
          size: 4,
          location: 'San Francisco, CA',
          remoteStatus: 'hybrid',
          availabilityStatus: 'available',
          yearsWorkingTogether: 3.5,
          teamCulture: 'Collaborative, data-driven, and focused on continuous learning. We believe in strong ownership and celebrating wins together.',
          workingStyle: 'Agile with 2-week sprints. Daily standups, weekly retrospectives. We value async communication and deep work time.',
          communicationStyle: 'Direct and transparent. We use Slack for daily comms, Notion for docs, and have weekly all-hands.',
          notableAchievements: 'Reduced fraud detection false positives by 35%. Built predictive models generating $2.1M annual savings. 98% client satisfaction rate.',
          portfolioUrl: 'https://techflow-analytics.com/portfolio',
          performanceMetrics: JSON.stringify({
            cohesionScore: 94,
            successfulProjects: 23,
            clientSatisfaction: 96,
            avgProjectDeliveryTime: '2.1 weeks under deadline',
          }),
          clientTestimonials: JSON.stringify([
            { client: 'Major US Bank', quote: 'The TechFlow team delivered beyond expectations and integrated seamlessly with our internal teams.' },
            { client: 'Fintech Startup', quote: 'Their ML expertise transformed our risk assessment capabilities.' }
          ]),
          visibility: 'public',
          salaryExpectationMin: 180000,
          salaryExpectationMax: 280000,
          equityExpectation: '0.5% - 1.5% per member',
          benefitsRequirements: JSON.stringify(['Health insurance', '401k match', 'Remote flexibility', 'Learning budget']),
          relocationWillingness: true,
          createdBy: demoUser.id,
          verificationStatus: 'verified',
          verifiedAt: new Date(),
        }
      });
      results.push(`Created demo team: ${demoTeam.name}`);
    } else {
      demoTeam = existingDemoTeam;
      results.push(`Demo team already exists: ${demoTeam.name}`);
    }

    // Link all team members to the demo team
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
        results.push(`Linked ${member.email} to demo team`);
      } else {
        results.push(`${member.email} already linked to demo team`);
      }
    }

    // Get the demo company for opportunities
    const demoCompany = await prisma.company.findUnique({
      where: { slug: 'demo-company' }
    });

    if (demoCompany) {
      // Seed demo opportunities
      const demoOpportunities = [
        {
          companyId: demoCompany.id,
          createdBy: demoCompanyUser.id,
          title: 'Senior Engineering Team - FinTech Platform',
          description: 'We\'re looking to acquire an experienced engineering team to lead our next-generation payment processing platform. The ideal team has experience building scalable financial systems and working with regulatory compliance.',
          teamSizeMin: 4,
          teamSizeMax: 8,
          requiredSkills: JSON.stringify(['Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Financial Systems']),
          preferredSkills: JSON.stringify(['Kubernetes', 'Redis', 'GraphQL']),
          industry: 'Financial Services',
          department: 'Engineering',
          seniorityLevel: SeniorityLevel.senior,
          location: 'San Francisco, CA',
          remotePolicy: RemotePreference.hybrid,
          compensationMin: 180000,
          compensationMax: 280000,
          equityOffered: true,
          equityRange: '0.5% - 1.5%',
          benefits: JSON.stringify(['Health Insurance', '401k Match', 'Unlimited PTO', 'Learning Budget']),
          urgency: UrgencyLevel.high,
          contractType: 'full_time',
          status: OpportunityStatus.active,
          visibility: 'public'
        },
        {
          companyId: demoCompany.id,
          createdBy: demoCompanyUser.id,
          title: 'Product & Design Team - B2B SaaS',
          description: 'Seeking an intact product and design team to drive our enterprise SaaS roadmap. Looking for a team that has shipped multiple successful B2B products and understands enterprise customer needs.',
          teamSizeMin: 3,
          teamSizeMax: 5,
          requiredSkills: JSON.stringify(['Product Management', 'UX Design', 'User Research', 'Figma']),
          preferredSkills: JSON.stringify(['Data Analytics', 'A/B Testing', 'Enterprise Sales']),
          industry: 'Technology',
          department: 'Product',
          seniorityLevel: SeniorityLevel.lead,
          location: 'New York, NY',
          remotePolicy: RemotePreference.remote,
          compensationMin: 160000,
          compensationMax: 240000,
          equityOffered: true,
          equityRange: '0.25% - 0.75%',
          benefits: JSON.stringify(['Health Insurance', '401k Match', 'Remote Work Stipend']),
          urgency: UrgencyLevel.standard,
          contractType: 'full_time',
          status: OpportunityStatus.active,
          visibility: 'public'
        },
        {
          companyId: demoCompany.id,
          createdBy: demoCompanyUser.id,
          title: 'Data Science & ML Team - Healthcare AI',
          description: 'We\'re building the future of healthcare diagnostics with AI. Looking for a data science team with experience in medical imaging, NLP for clinical notes, and FDA-regulated software development.',
          teamSizeMin: 5,
          teamSizeMax: 10,
          requiredSkills: JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'Medical Imaging', 'HIPAA Compliance']),
          preferredSkills: JSON.stringify(['Computer Vision', 'NLP', 'FDA 510(k)']),
          industry: 'Healthcare',
          department: 'Data Science',
          seniorityLevel: SeniorityLevel.senior,
          location: 'Boston, MA',
          remotePolicy: RemotePreference.hybrid,
          compensationMin: 200000,
          compensationMax: 350000,
          equityOffered: true,
          equityRange: '1% - 2%',
          benefits: JSON.stringify(['Health Insurance', '401k Match', 'Unlimited PTO', 'Conference Budget']),
          urgency: UrgencyLevel.urgent,
          contractType: 'full_time',
          status: OpportunityStatus.active,
          visibility: 'public'
        },
        {
          companyId: demoCompany.id,
          createdBy: demoCompanyUser.id,
          title: 'DevOps & Platform Team',
          description: 'Join us to build and scale our cloud infrastructure. We need a team experienced in Kubernetes, multi-cloud deployments, and building developer platforms that improve engineering velocity.',
          teamSizeMin: 3,
          teamSizeMax: 6,
          requiredSkills: JSON.stringify(['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Observability']),
          preferredSkills: JSON.stringify(['GCP', 'Azure', 'Service Mesh']),
          industry: 'Technology',
          department: 'Infrastructure',
          seniorityLevel: SeniorityLevel.senior,
          location: 'Austin, TX',
          remotePolicy: RemotePreference.remote,
          compensationMin: 170000,
          compensationMax: 260000,
          equityOffered: true,
          equityRange: '0.3% - 0.8%',
          benefits: JSON.stringify(['Health Insurance', '401k Match', 'Home Office Setup']),
          urgency: UrgencyLevel.standard,
          contractType: 'full_time',
          status: OpportunityStatus.active,
          visibility: 'public'
        },
        {
          companyId: demoCompany.id,
          createdBy: demoCompanyUser.id,
          title: 'Mobile Development Team - Consumer App',
          description: 'We\'re launching a new consumer mobile app and need an experienced team to build native iOS and Android experiences. Looking for a team with a track record of apps with 1M+ downloads.',
          teamSizeMin: 4,
          teamSizeMax: 7,
          requiredSkills: JSON.stringify(['React Native', 'iOS', 'Android', 'Mobile CI/CD']),
          preferredSkills: JSON.stringify(['Swift', 'Kotlin', 'Firebase']),
          industry: 'Consumer Tech',
          department: 'Mobile',
          seniorityLevel: SeniorityLevel.mid,
          location: 'Seattle, WA',
          remotePolicy: RemotePreference.hybrid,
          compensationMin: 150000,
          compensationMax: 220000,
          equityOffered: false,
          benefits: JSON.stringify(['Health Insurance', '401k Match', 'Gym Membership']),
          urgency: UrgencyLevel.high,
          contractType: 'full_time',
          status: OpportunityStatus.active,
          visibility: 'public'
        }
      ];

      for (const opp of demoOpportunities) {
        // Check if opportunity already exists by title and company
        const existing = await prisma.opportunity.findFirst({
          where: {
            companyId: demoCompany.id,
            title: opp.title
          }
        });

        if (!existing) {
          await prisma.opportunity.create({ data: opp });
        } else {
          // Update existing opportunity to ensure it has active status
          await prisma.opportunity.update({
            where: { id: existing.id },
            data: {
              status: OpportunityStatus.active,
              visibility: 'public',
              description: opp.description,
              requiredSkills: opp.requiredSkills,
              preferredSkills: opp.preferredSkills,
              benefits: opp.benefits,
              compensationMin: opp.compensationMin,
              compensationMax: opp.compensationMax,
            }
          });
        }
      }
      results.push(`Created/updated ${demoOpportunities.length} demo opportunities`);

      // Create demo applications from the demo team to opportunities
      const opportunities = await prisma.opportunity.findMany({
        where: { companyId: demoCompany.id },
        orderBy: { createdAt: 'asc' }
      });

      if (opportunities.length >= 3 && demoTeam) {
        const demoApplications = [
          {
            teamId: demoTeam.id,
            opportunityId: opportunities[0].id, // FinTech Platform
            coverLetter: 'Our team has 3.5 years of experience building financial systems together. We specialize in scalable payment processing and have deep expertise in regulatory compliance. We would be excited to bring our proven track record to your next-generation platform.',
            teamFitExplanation: 'Our team culture of collaboration and data-driven decision making aligns perfectly with your engineering values. We have successfully delivered 23+ projects together.',
            questionsForCompany: 'What is the current state of the payment platform? What are the main technical challenges you\'re facing?',
            status: ApplicationStatus.interviewing,
            appliedBy: demoUser.id,
            appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            reviewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            interviewScheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            interviewFormat: 'video',
            interviewDuration: 60,
            interviewMeetingLink: 'https://meet.google.com/abc-defg-hij',
            interviewNotes: 'Technical deep-dive with engineering leadership',
          },
          {
            teamId: demoTeam.id,
            opportunityId: opportunities[2].id, // Healthcare AI
            coverLetter: 'While our primary expertise is in fintech, our machine learning and data science capabilities are directly applicable to healthcare AI. We have experience with HIPAA compliance from our work with financial data privacy regulations.',
            teamFitExplanation: 'Our team has strong ML fundamentals and has worked with sensitive data requiring strict compliance. We\'re eager to apply our skills to healthcare.',
            questionsForCompany: 'What is the timeline for FDA approval? How does the team interact with clinical stakeholders?',
            status: ApplicationStatus.submitted,
            appliedBy: demoUser.id,
            appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
          {
            teamId: demoTeam.id,
            opportunityId: opportunities[3].id, // DevOps & Platform
            coverLetter: 'Our team has extensive experience with cloud infrastructure and has built ML pipelines processing 10M+ predictions daily. We understand the importance of developer experience and platform engineering.',
            teamFitExplanation: 'Our ML infrastructure expertise complements platform engineering well. We\'ve built robust CI/CD pipelines and observability systems.',
            questionsForCompany: 'What is the current cloud provider setup? What are the main pain points in developer productivity?',
            status: ApplicationStatus.reviewing,
            appliedBy: demoUser.id,
            appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            recruiterNotes: 'Strong ML background but reviewing DevOps specific experience',
          },
        ];

        for (const app of demoApplications) {
          // Check if application already exists
          const existing = await prisma.teamApplication.findFirst({
            where: {
              teamId: app.teamId,
              opportunityId: app.opportunityId
            }
          });

          if (!existing) {
            await prisma.teamApplication.create({ data: app });
            results.push(`Created application for opportunity: ${opportunities.find(o => o.id === app.opportunityId)?.title}`);
          } else {
            // Update existing application
            await prisma.teamApplication.update({
              where: { id: existing.id },
              data: {
                status: app.status,
                coverLetter: app.coverLetter,
                teamFitExplanation: app.teamFitExplanation,
                interviewScheduledAt: app.interviewScheduledAt,
                interviewFormat: app.interviewFormat,
                interviewDuration: app.interviewDuration,
                interviewMeetingLink: app.interviewMeetingLink,
                interviewNotes: app.interviewNotes,
                recruiterNotes: app.recruiterNotes,
              }
            });
            results.push(`Updated application for opportunity: ${opportunities.find(o => o.id === app.opportunityId)?.title}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      results
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with secret to seed demo data',
    usage: 'POST /api/seed?secret=liftout-seed-2024 OR with x-seed-secret header',
    credentials: {
      team: { email: 'demo@example.com', password: 'password' },
      company: { email: 'company@example.com', password: 'password' }
    }
  });
}
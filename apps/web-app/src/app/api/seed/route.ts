import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SeniorityLevel, UrgencyLevel, RemotePreference, OpportunityStatus } from '@prisma/client';
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

    // Create demo team user
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
    results.push(`Created/updated demo user: ${demoUser.email}`);

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
        }
      }
      results.push(`Created/updated ${demoOpportunities.length} demo opportunities`);
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
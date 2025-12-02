import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Demo company data for demo IDs
const DEMO_COMPANIES: Record<string, any> = {
  'company-demo-1': {
    id: 'company-demo-1',
    name: 'NextGen Financial',
    description: 'NextGen Financial is a leading financial services company at the forefront of innovation. We leverage cutting-edge technology and data analytics to provide superior investment solutions and financial products to our clients worldwide.',
    industry: 'Financial Services',
    companySize: 'enterprise',
    foundedYear: 2008,
    websiteUrl: 'https://nextgenfinancial.example.com',
    headquartersLocation: 'New York, NY',
    employeeCount: 5000,
    fundingStage: 'Public',
    verificationStatus: 'verified',
    companyCulture: 'We foster a culture of innovation, collaboration, and excellence. Our teams are empowered to take ownership and drive meaningful impact.',
    values: ['Innovation', 'Integrity', 'Client Focus', 'Excellence', 'Collaboration'],
    benefits: ['Competitive salary', '401k matching', 'Health insurance', 'Equity participation', 'Flexible PTO', 'Remote work options'],
    techStack: ['Python', 'React', 'AWS', 'Kubernetes', 'PostgreSQL'],
    opportunities: [
      {
        id: 'opp-demo-1',
        title: 'Lead FinTech Analytics Division',
        status: 'active',
      },
    ],
  },
  'company-demo-2': {
    id: 'company-demo-2',
    name: 'MedTech Innovations',
    description: 'MedTech Innovations is pioneering the future of healthcare through artificial intelligence and advanced technology. Our mission is to improve patient outcomes and transform healthcare delivery.',
    industry: 'Healthcare Technology',
    companySize: 'mid_market',
    foundedYear: 2015,
    websiteUrl: 'https://medtechinnovations.example.com',
    headquartersLocation: 'Boston, MA',
    employeeCount: 800,
    fundingStage: 'Series C',
    verificationStatus: 'verified',
    companyCulture: 'We are driven by our mission to improve lives through technology. We value diverse perspectives and believe in empowering our teams to innovate.',
    values: ['Patient First', 'Innovation', 'Scientific Rigor', 'Empathy', 'Teamwork'],
    benefits: ['Competitive compensation', 'Stock options', 'Comprehensive healthcare', 'Unlimited PTO', 'Learning budget', 'Remote-first'],
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'AWS', 'HIPAA-compliant infrastructure'],
    opportunities: [
      {
        id: 'opp-demo-2',
        title: 'Healthcare AI Team Lead',
        status: 'active',
      },
    ],
  },
  'company-demo-3': {
    id: 'company-demo-3',
    name: 'CloudScale Systems',
    description: 'CloudScale Systems is a fast-growing cloud infrastructure company backed by top-tier VCs. We build next-generation platform solutions that power modern applications at scale.',
    industry: 'Technology',
    companySize: 'mid_market',
    foundedYear: 2019,
    websiteUrl: 'https://cloudscalesystems.example.com',
    headquartersLocation: 'San Francisco, CA',
    employeeCount: 350,
    fundingStage: 'Series B',
    verificationStatus: 'pending',
    companyCulture: 'We move fast and build things that matter. Our engineering-first culture values technical excellence, ownership, and continuous learning.',
    values: ['Technical Excellence', 'Ownership', 'Speed', 'Transparency', 'Customer Success'],
    benefits: ['Top-tier compensation', 'Significant equity', 'Premium health coverage', 'Catered meals', '401k', 'Home office budget'],
    techStack: ['Go', 'Rust', 'Kubernetes', 'AWS', 'GCP', 'Terraform'],
    opportunities: [
      {
        id: 'opp-demo-3',
        title: 'Enterprise Platform Engineering',
        status: 'active',
      },
    ],
  },
  // Demo EOI companies
  'techcorp-demo': {
    id: 'techcorp-demo',
    name: 'TechCorp Industries',
    description: 'TechCorp Industries is a Fortune 500 technology conglomerate focused on enterprise software solutions. We partner with leading companies worldwide to drive digital transformation.',
    industry: 'Technology',
    companySize: 'enterprise',
    foundedYear: 1995,
    websiteUrl: 'https://techcorp.example.com',
    headquartersLocation: 'Seattle, WA',
    employeeCount: 25000,
    fundingStage: 'Public',
    verificationStatus: 'verified',
    companyCulture: 'We believe in the power of technology to transform businesses. Our collaborative culture encourages bold thinking and customer-centric innovation.',
    values: ['Customer Obsession', 'Innovation', 'Accountability', 'Inclusion', 'Long-term Thinking'],
    benefits: ['Industry-leading compensation', 'Stock grants', 'Comprehensive benefits', 'Sabbatical program', 'Education reimbursement'],
    techStack: ['Java', 'Python', 'React', 'Azure', 'Kubernetes'],
    opportunities: [],
  },
  'healthstart-demo': {
    id: 'healthstart-demo',
    name: 'HealthStart Inc',
    description: 'HealthStart Inc is an emerging healthtech startup on a mission to democratize access to quality healthcare through innovative technology solutions.',
    industry: 'Healthcare Technology',
    companySize: 'startup',
    foundedYear: 2021,
    websiteUrl: 'https://healthstart.example.com',
    headquartersLocation: 'Austin, TX',
    employeeCount: 75,
    fundingStage: 'Series A',
    verificationStatus: 'verified',
    companyCulture: 'We are a scrappy, mission-driven team passionate about making healthcare accessible to everyone. We move fast, learn constantly, and support each other.',
    values: ['Impact', 'Agility', 'Empathy', 'Transparency', 'Growth'],
    benefits: ['Competitive salary', 'Equity package', 'Health insurance', 'Flexible hours', 'Remote-friendly'],
    techStack: ['TypeScript', 'React Native', 'Node.js', 'AWS', 'PostgreSQL'],
    opportunities: [],
  },
};

// GET /api/companies/[id] - Get public company profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check for demo company IDs
  if (id.startsWith('company-demo-') || id === 'techcorp-demo' || id === 'healthstart-demo') {
    const demoCompany = DEMO_COMPANIES[id];
    if (demoCompany) {
      return NextResponse.json({ company: demoCompany });
    }
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: {
        id,
        deletedAt: null, // Exclude soft-deleted companies
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        industry: true,
        companySize: true,
        foundedYear: true,
        websiteUrl: true,
        logoUrl: true,
        coverImageUrl: true,
        headquartersLocation: true,
        locations: true,
        companyCulture: true,
        values: true,
        benefits: true,
        techStack: true,
        verificationStatus: true,
        employeeCount: true,
        fundingStage: true,
        glassdoorRating: true,
        createdAt: true,
        opportunities: {
          where: { status: 'active' },
          select: {
            id: true,
            title: true,
            status: true,
            industry: true,
            location: true,
          },
          take: 5,
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

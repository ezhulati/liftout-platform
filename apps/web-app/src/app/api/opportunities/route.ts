import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for demo (in production, use database)
let opportunities: any[] = [
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
    industry: 'Financial Services',
    createdBy: '2', // company demo user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    applications: []
  }
];

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const industry = searchParams.get('industry');
  const location = searchParams.get('location');
  const type = searchParams.get('type');
  const urgent = searchParams.get('urgent');
  const confidential = searchParams.get('confidential');
  const minCompensation = searchParams.get('minCompensation');
  const maxCompensation = searchParams.get('maxCompensation');
  const teamSizeMin = searchParams.get('teamSizeMin');
  const teamSizeMax = searchParams.get('teamSizeMax');
  const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
  
  let filteredOpportunities = [...opportunities];
  
  // Filter out confidential opportunities unless user is the creator
  filteredOpportunities = filteredOpportunities.filter(opp => 
    !opp.confidential || opp.createdBy === session.user.id
  );
  
  // Text search across title, company, description
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filteredOpportunities = filteredOpportunities.filter(opp => 
      opp.title.toLowerCase().includes(searchLower) ||
      opp.company.toLowerCase().includes(searchLower) ||
      opp.description.toLowerCase().includes(searchLower) ||
      opp.requirements.some((req: string) => req.toLowerCase().includes(searchLower)) ||
      opp.whatWeOffer.some((offer: string) => offer.toLowerCase().includes(searchLower))
    );
  }
  
  // Industry filter
  if (industry) {
    filteredOpportunities = filteredOpportunities.filter(opp => 
      opp.industry.toLowerCase().includes(industry.toLowerCase())
    );
  }
  
  // Location filter
  if (location) {
    filteredOpportunities = filteredOpportunities.filter(opp =>
      opp.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Type filter
  if (type) {
    filteredOpportunities = filteredOpportunities.filter(opp =>
      opp.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  // Urgent filter
  if (urgent === 'true') {
    filteredOpportunities = filteredOpportunities.filter(opp => opp.urgent);
  }

  // Confidential filter (for company users viewing their own)
  if (confidential === 'true' && session.user.userType === 'company') {
    filteredOpportunities = filteredOpportunities.filter(opp => opp.confidential);
  }

  // Skills filter
  if (skills.length > 0) {
    filteredOpportunities = filteredOpportunities.filter(opp => {
      const oppSkills = opp.requirements.concat(opp.whatWeOffer).join(' ').toLowerCase();
      return skills.some(skill => oppSkills.includes(skill.toLowerCase()));
    });
  }

  return NextResponse.json({ 
    opportunities: filteredOpportunities,
    total: filteredOpportunities.length,
    filters: {
      industries: [...new Set(opportunities.map(opp => opp.industry))].sort(),
      locations: [...new Set(opportunities.map(opp => opp.location))].sort(),
      types: [...new Set(opportunities.map(opp => opp.type))].sort()
    }
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only company users can create opportunities
  if (session.user.userType !== 'company') {
    return NextResponse.json({ 
      error: 'Only company users can create opportunities' 
    }, { status: 403 });
  }

  const body = await request.json();
  const { 
    title, 
    company, 
    type, 
    description, 
    teamSize, 
    compensation, 
    location, 
    timeline,
    requirements,
    whatWeOffer,
    integrationPlan,
    confidential,
    urgent,
    industry
  } = body;
  
  if (!title || !company || !description || !compensation) {
    return NextResponse.json({ 
      error: 'Title, company, description, and compensation are required' 
    }, { status: 400 });
  }

  const newOpportunity = {
    id: `opp_${Date.now()}`,
    title,
    company,
    type: type || 'Strategic Hiring',
    description,
    teamSize: teamSize || '2-5 people',
    compensation,
    location: location || 'Remote',
    timeline: timeline || 'Flexible',
    requirements: requirements || [],
    whatWeOffer: whatWeOffer || [],
    integrationPlan: integrationPlan || 'Standard onboarding process',
    confidential: confidential || false,
    urgent: urgent || false,
    industry: industry || 'Technology',
    createdBy: session.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    applications: []
  };

  opportunities.push(newOpportunity);
  
  return NextResponse.json({ opportunity: newOpportunity }, { status: 201 });
}
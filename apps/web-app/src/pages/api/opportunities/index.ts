import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all opportunities (with optional filtering)
      const { industry, location, type, confidential } = req.query;
      let filteredOpportunities = [...opportunities];
      
      // Filter out confidential opportunities unless user is the creator
      filteredOpportunities = filteredOpportunities.filter(opp => 
        !opp.confidential || opp.createdBy === session.user.id
      );
      
      if (industry) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.industry.toLowerCase().includes(industry.toString().toLowerCase())
        );
      }
      
      if (location) {
        filteredOpportunities = filteredOpportunities.filter(opp =>
          opp.location.toLowerCase().includes(location.toString().toLowerCase())
        );
      }

      if (type) {
        filteredOpportunities = filteredOpportunities.filter(opp =>
          opp.type.toLowerCase().includes(type.toString().toLowerCase())
        );
      }

      return res.status(200).json({ opportunities: filteredOpportunities });

    case 'POST':
      // Create new opportunity (only for company users)
      if (session.user.userType !== 'company') {
        return res.status(403).json({ error: 'Only company users can create opportunities' });
      }

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
      } = req.body;
      
      if (!title || !company || !description || !compensation) {
        return res.status(400).json({ 
          error: 'Title, company, description, and compensation are required' 
        });
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
      
      return res.status(201).json({ opportunity: newOpportunity });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
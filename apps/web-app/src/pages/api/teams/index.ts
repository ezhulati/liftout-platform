import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for demo (in production, use database)
let teams: any[] = [
  {
    id: 'team_demo_001',
    name: 'TechFlow Data Science Team',
    description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions.',
    size: 4,
    yearsWorking: 3.5,
    cohesionScore: 94,
    successfulProjects: 23,
    clientSatisfaction: 96,
    openToLiftout: true,
    createdBy: '1', // demo user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: 'member_1',
        name: 'Alex Chen',
        role: 'Team Lead & Senior Data Scientist',
        experience: 8,
        skills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling']
      },
      {
        id: 'member_2', 
        name: 'Sarah Kim',
        role: 'Senior ML Engineer',
        experience: 6,
        skills: ['Deep Learning', 'Python', 'TensorFlow', 'Model Deployment']
      },
      {
        id: 'member_3',
        name: 'Michael Rodriguez',
        role: 'Data Engineer',
        experience: 5,
        skills: ['SQL', 'Apache Spark', 'Data Pipelines', 'AWS']
      },
      {
        id: 'member_4',
        name: 'Emily Zhang',
        role: 'Business Analyst',
        experience: 4,
        skills: ['Business Intelligence', 'Analytics', 'Tableau', 'SQL']
      }
    ],
    achievements: [
      'Led team that reduced fraud detection false positives by 35%',
      'Built predictive models generating $2.1M annual savings',
      'Mentored 12+ junior data scientists across 3 years'
    ],
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    availability: 'Open to strategic opportunities',
    compensation: {
      range: '$180k-$280k',
      equity: true,
      benefits: 'Full package'
    }
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all teams (with optional filtering)
      const { industry, size, location } = req.query;
      let filteredTeams = [...teams];
      
      if (industry) {
        filteredTeams = filteredTeams.filter(team => 
          team.industry.toLowerCase().includes(industry.toString().toLowerCase())
        );
      }
      
      if (size) {
        const teamSize = parseInt(size.toString());
        filteredTeams = filteredTeams.filter(team => team.size === teamSize);
      }
      
      if (location) {
        filteredTeams = filteredTeams.filter(team =>
          team.location.toLowerCase().includes(location.toString().toLowerCase())
        );
      }

      return res.status(200).json({ teams: filteredTeams });

    case 'POST':
      // Create new team
      const { name, description, members, industry, location, compensation } = req.body;
      
      if (!name || !description || !members || members.length < 2) {
        return res.status(400).json({ error: 'Name, description, and at least 2 members required' });
      }

      const newTeam = {
        id: `team_${Date.now()}`,
        name,
        description,
        size: members.length,
        yearsWorking: 0,
        cohesionScore: 0,
        successfulProjects: 0,
        clientSatisfaction: 0,
        openToLiftout: true,
        createdBy: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members,
        achievements: [],
        industry: industry || 'Technology',
        location: location || 'Remote',
        availability: 'Open to opportunities',
        compensation: compensation || { range: 'Negotiable', equity: false, benefits: 'Standard' }
      };

      teams.push(newTeam);
      
      return res.status(201).json({ team: newTeam });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
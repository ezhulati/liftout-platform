import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for demo
let applications: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get applications for the current user
      const userApplications = applications.filter(app => 
        app.applicantId === session.user.id || 
        app.opportunity.createdBy === session.user.id
      );
      
      return res.status(200).json({ applications: userApplications });

    case 'POST':
      // Create new application (expression of interest)
      const { opportunityId, teamId, coverLetter, availableStartDate } = req.body;
      
      if (!opportunityId || !teamId || !coverLetter) {
        return res.status(400).json({ 
          error: 'Opportunity ID, team ID, and cover letter are required' 
        });
      }

      // In a real app, we'd validate that the opportunity and team exist
      // and that the user has permission to apply on behalf of the team

      const newApplication = {
        id: `app_${Date.now()}`,
        opportunityId,
        teamId,
        applicantId: session.user.id,
        coverLetter,
        availableStartDate: availableStartDate || 'Flexible',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            status: 'submitted',
            date: new Date().toISOString(),
            note: 'Application submitted'
          }
        ],
        // These would be populated from actual opportunity/team data
        opportunity: {
          id: opportunityId,
          title: 'Placeholder Opportunity',
          company: 'Placeholder Company'
        },
        team: {
          id: teamId,
          name: 'Placeholder Team',
          size: 4
        }
      };

      applications.push(newApplication);
      
      return res.status(201).json({ application: newApplication });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// This would be imported from a shared data store in production
let applications: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find application by ID
  const applicationIndex = applications.findIndex(app => app.id === id);
  
  switch (req.method) {
    case 'GET':
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const application = applications[applicationIndex];
      
      // Check if user can view this application (applicant or opportunity owner)
      if (application.applicantId !== session.user.id && 
          application.opportunity.createdBy !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden - You can only view your own applications' });
      }
      
      return res.status(200).json({ application });

    case 'PUT':
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const existingApp = applications[applicationIndex];
      const { status, note } = req.body;
      
      // Only opportunity owner can update status, applicant can update some fields
      if (status && existingApp.opportunity.createdBy !== session.user.id) {
        return res.status(403).json({ 
          error: 'Only the opportunity owner can update application status' 
        });
      }

      if (!status && existingApp.applicantId !== session.user.id) {
        return res.status(403).json({ 
          error: 'You can only edit your own applications' 
        });
      }

      const updates: any = {
        updatedAt: new Date().toISOString()
      };

      if (status) {
        updates.status = status;
        updates.timeline = [
          ...existingApp.timeline,
          {
            status,
            date: new Date().toISOString(),
            note: note || `Status updated to ${status}`
          }
        ];
      } else {
        // Allow applicant to update their application details
        Object.assign(updates, req.body);
      }
      
      // Update application data
      applications[applicationIndex] = {
        ...existingApp,
        ...updates
      };

      return res.status(200).json({ application: applications[applicationIndex] });

    case 'DELETE':
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const appToDelete = applications[applicationIndex];
      
      // Only applicant can delete their own application
      if (appToDelete.applicantId !== session.user.id) {
        return res.status(403).json({ error: 'You can only delete your own applications' });
      }

      applications.splice(applicationIndex, 1);
      
      return res.status(200).json({ message: 'Application deleted successfully' });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
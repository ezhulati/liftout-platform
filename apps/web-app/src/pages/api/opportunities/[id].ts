import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// This would be imported from a shared data store in production
let opportunities: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find opportunity by ID
  const opportunityIndex = opportunities.findIndex(opp => opp.id === id);
  
  switch (req.method) {
    case 'GET':
      if (opportunityIndex === -1) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }

      const opportunity = opportunities[opportunityIndex];
      
      // Check if user can view this opportunity (public or owned by user)
      if (opportunity.confidential && opportunity.createdBy !== session.user.id) {
        return res.status(403).json({ error: 'This is a confidential opportunity' });
      }
      
      return res.status(200).json({ opportunity });

    case 'PUT':
      if (opportunityIndex === -1) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }

      const existingOpp = opportunities[opportunityIndex];
      
      // Check if user owns this opportunity
      if (existingOpp.createdBy !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden - You can only edit your own opportunities' });
      }

      const updates = req.body;
      
      // Update opportunity data
      opportunities[opportunityIndex] = {
        ...existingOpp,
        ...updates,
        updatedAt: new Date().toISOString(),
        // Prevent changing certain fields
        id: existingOpp.id,
        createdBy: existingOpp.createdBy,
        createdAt: existingOpp.createdAt,
        applications: existingOpp.applications // Preserve applications
      };

      return res.status(200).json({ opportunity: opportunities[opportunityIndex] });

    case 'DELETE':
      if (opportunityIndex === -1) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }

      const oppToDelete = opportunities[opportunityIndex];
      
      // Check if user owns this opportunity
      if (oppToDelete.createdBy !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden - You can only delete your own opportunities' });
      }

      opportunities.splice(opportunityIndex, 1);
      
      return res.status(200).json({ message: 'Opportunity deleted successfully' });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
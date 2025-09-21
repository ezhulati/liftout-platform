import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// This would be imported from a shared data store in production
// For now, we'll simulate with a simple in-memory store
let teams: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find team by ID
  const teamIndex = teams.findIndex(team => team.id === id);
  
  switch (req.method) {
    case 'GET':
      if (teamIndex === -1) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      return res.status(200).json({ team: teams[teamIndex] });

    case 'PUT':
      if (teamIndex === -1) {
        return res.status(404).json({ error: 'Team not found' });
      }

      const team = teams[teamIndex];
      
      // Check if user owns this team
      if (team.createdBy !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden - You can only edit your own teams' });
      }

      const updates = req.body;
      
      // Update team data
      teams[teamIndex] = {
        ...team,
        ...updates,
        updatedAt: new Date().toISOString(),
        // Prevent changing certain fields
        id: team.id,
        createdBy: team.createdBy,
        createdAt: team.createdAt
      };

      return res.status(200).json({ team: teams[teamIndex] });

    case 'DELETE':
      if (teamIndex === -1) {
        return res.status(404).json({ error: 'Team not found' });
      }

      const teamToDelete = teams[teamIndex];
      
      // Check if user owns this team
      if (teamToDelete.createdBy !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden - You can only delete your own teams' });
      }

      teams.splice(teamIndex, 1);
      
      return res.status(200).json({ message: 'Team deleted successfully' });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
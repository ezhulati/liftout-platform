import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/search/teams
router.get('/teams', async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Search teams endpoint' });
});

// GET /api/search/opportunities
router.get('/opportunities', async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Search opportunities endpoint' });
});

export default router;
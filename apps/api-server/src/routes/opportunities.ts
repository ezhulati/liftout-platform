import { Router } from 'express';
import { AuthenticatedRequest, requireCompanyUser } from '../middleware/auth';

const router = Router();

// GET /api/opportunities
router.get('/', async (req, res) => {
  res.json({ success: true, message: 'Get opportunities endpoint' });
});

// POST /api/opportunities  
router.post('/', requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Create opportunity endpoint' });
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  res.json({ success: true, message: 'Get opportunity details endpoint' });
});

export default router;
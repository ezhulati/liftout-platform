import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/applications
router.post('/', async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Submit application endpoint' });
});

// GET /api/applications/me
router.get('/me', async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Get my applications endpoint' });
});

export default router;
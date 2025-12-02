import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/subscriptions/me
router.get('/me', async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Get subscription endpoint' });
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', async (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Create subscription endpoint' });
});

export default router;
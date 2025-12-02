import { Router } from 'express';
import { notificationService } from '../services/notificationService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const notifications = await notificationService.getNotificationsForUser(req.user!.id);
        res.json(notifications);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/read', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id, req.user!.id);
        res.json(notification);
    } catch (error) {
        next(error);
    }
});

export default router;

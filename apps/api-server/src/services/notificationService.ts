import { prisma } from '@liftout/database';
import { Notification } from '@prisma/client';

class NotificationService {
    async getNotificationsForUser(userId: string): Promise<Notification[]> {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(notificationId: string, userId: string): Promise<Notification> {
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
}

export const notificationService = new NotificationService();

import { notificationRepository } from "../repositories/notificationRepository";

class NotificationService {
    async fetchNotifications(id: string) {
        try {
            const notifications = await notificationRepository.findNotificationsById(id);
            return notifications;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error(`Failed to fetch notifications: ${err.message}`);
            }
            throw err;
        }
    }
}
export const notificationService = new NotificationService();
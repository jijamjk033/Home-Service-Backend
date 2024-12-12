import { Notification } from "../models/notification";

class NotificationRepository {

    async createNotification(senderId: string, senderModel: string, recipientId: string, recipientModel: string, message: string, type: string) {
        try {
            const notification = new Notification({
                senderId,
                senderModel,
                recipientId,
                recipientModel,
                message,
                type,
            });
            return await notification.save();
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Could not create notification');
        }
    }
}

export const notificationRepository = new NotificationRepository();
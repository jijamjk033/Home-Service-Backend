import { Notification } from "../models/notification";

class NotificationRepository {

    async createNotification(senderId: string, senderModel: string, recipientId: string, recipientModel: string, message: string, type: string, orderId:string) {
        try {
            const notification = new Notification({
                senderId,
                senderModel,
                recipientId,
                recipientModel,
                message,
                type,
                orderId,
            });
            return await notification.save();
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Could not create notification');
        }
    }

    async findNotificationsById(id: string) {
        try {
            const notifications = await Notification.find({ recipientId: id }).sort({ createdAt: -1 }).exec();
            return notifications;
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error finding notifications:', err);
                throw new Error(`Failed to find notifications for ${id}: ${err.message}`);
            }
        }
    }
}

export const notificationRepository = new NotificationRepository();
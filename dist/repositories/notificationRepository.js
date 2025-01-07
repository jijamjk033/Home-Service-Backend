"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRepository = void 0;
const notification_1 = require("../models/notification");
class NotificationRepository {
    createNotification(senderId, senderModel, recipientId, recipientModel, message, type, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = new notification_1.Notification({
                    senderId,
                    senderModel,
                    recipientId,
                    recipientModel,
                    message,
                    type,
                    orderId,
                });
                return yield notification.save();
            }
            catch (error) {
                console.error('Error creating notification:', error);
                throw new Error('Could not create notification');
            }
        });
    }
    findNotificationsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notification_1.Notification.find({ recipientId: id }).sort({ timestamp: -1 }).exec();
                return notifications;
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Error finding notifications:', err);
                    throw new Error(`Failed to find notifications for ${id}: ${err.message}`);
                }
            }
        });
    }
}
exports.notificationRepository = new NotificationRepository();

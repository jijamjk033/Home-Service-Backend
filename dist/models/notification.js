"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    recipientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: 'recipientModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Employee']
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['User', 'Employee']
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['message', 'booking', 'cancellation'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    },
});
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);

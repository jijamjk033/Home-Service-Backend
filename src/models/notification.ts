import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
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

export const Notification = mongoose.model('Notification', notificationSchema);


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
});
exports.Message = mongoose.model('Message', MessageSchema);

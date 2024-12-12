"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    participants: [String],
    lastMessage: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
});
exports.Chat = mongoose.model('Chat', chatSchema);

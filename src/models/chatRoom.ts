const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [String],
    lastMessage: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
});

export const Chat = mongoose.model('Chat', chatSchema);
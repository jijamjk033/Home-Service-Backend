const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', MessageSchema);

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
exports.chatRepository = void 0;
const chatRoom_1 = require("../models/chatRoom");
const message_1 = require("../models/message");
class ChatRepository {
    findChatRoom(userId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield chatRoom_1.Chat.findOne({
                participants: { $all: [userId, employeeId] },
            });
            if (!chat) {
                chat = new chatRoom_1.Chat({
                    participants: [userId, employeeId],
                });
                yield chat.save();
            }
            return chat;
        });
    }
    saveMessage(chatId, sender, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = new message_1.Message({
                chatId,
                sender,
                text,
                timestamp: new Date()
            });
            return yield message.save();
        });
    }
    updateChatLastMessage(chatId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatRoom_1.Chat.findByIdAndUpdate(chatId, {
                lastMessage: text,
                lastUpdated: new Date()
            });
        });
    }
    findMessagesById(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield message_1.Message.find({ chatId }).exec();
                return messages;
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Error finding messages:', err);
                    throw new Error(`Failed to find messages for chatId ${chatId}: ${err.message}`);
                }
            }
        });
    }
}
exports.chatRepository = new ChatRepository();

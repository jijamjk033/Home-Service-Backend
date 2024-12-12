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
exports.chatService = void 0;
const chatRepository_1 = require("../repositories/chatRepository");
class ChatService {
    initiateChat(userId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chat = yield chatRepository_1.chatRepository.findChatRoom(userId, employeeId);
                return { chatId: chat._id };
            }
            catch (err) {
                if (err instanceof Error)
                    throw new Error(`Failed to initiate chat: ${err.message}`);
            }
        });
    }
    messageSent(chatId, sender, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield chatRepository_1.chatRepository.saveMessage(chatId, sender, text);
                yield chatRepository_1.chatRepository.updateChatLastMessage(chatId, text);
                return message;
            }
            catch (err) {
                if (err instanceof Error)
                    throw new Error(`Failed send message: ${err.message}`);
            }
        });
    }
    getChatMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield chatRepository_1.chatRepository.findMessagesById(chatId);
                return messages;
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new Error(`Failed to fetch message: ${err.message}`);
                }
                throw err;
            }
        });
    }
}
exports.chatService = new ChatService();

import { chatRepository } from "../repositories/chatRepository";

class ChatService {

    async initiateChat(userId: string, employeeId: string) {
        try {
            let chat = await chatRepository.findChatRoom(userId, employeeId);
            return { chatId: chat._id };
        } catch (err) {
            if (err instanceof Error)
                throw new Error(`Failed to initiate chat: ${err.message}`);
        }
    }

    async messageSent(chatId: string, sender: string, text: string) {
        try {
            const message = await chatRepository.saveMessage(chatId, sender, text);
            await chatRepository.updateChatLastMessage(chatId, text);
            return message;
        } catch (err) {
            if (err instanceof Error)
                throw new Error(`Failed send message: ${err.message}`);
        }
    }

    async getChatMessages(chatId: string) {
        try {
            const messages = await chatRepository.findMessagesById(chatId);
            return messages;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error(`Failed to fetch message: ${err.message}`);
            }
            throw err;
        }
    }

}

export const chatService = new ChatService();
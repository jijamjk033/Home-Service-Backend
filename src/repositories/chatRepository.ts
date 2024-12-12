import { Chat } from "../models/chatRoom";
import { Message } from "../models/message";

class ChatRepository {

    async findChatRoom(userId: string, employeeId: string) {
        let chat = await Chat.findOne({
            participants: { $all: [userId, employeeId] },
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId, employeeId],
            });
            await chat.save();
        }
        return chat;
    }

    async saveMessage(chatId: string, sender: string, text: string) {
        const message = new Message({
            chatId,
            sender,
            text,
            timestamp: new Date()
        });
        return await message.save();
    }

    async updateChatLastMessage(chatId: string, text: string) {
        return await Chat.findByIdAndUpdate(chatId, {
            lastMessage: text,
            lastUpdated: new Date()
        });
    }

    async findMessagesById(chatId: string) {
        try {
            const messages = await Message.find({ chatId }).exec();
            return messages;
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error finding messages:', err);
                throw new Error(`Failed to find messages for chatId ${chatId}: ${err.message}`);
            }
        }
    }

}

export const chatRepository = new ChatRepository();
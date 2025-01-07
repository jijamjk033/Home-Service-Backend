import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { chatRepository } from '../repositories/chatRepository';
import { notificationRepository } from '../repositories/notificationRepository';

let io: Server

export const setupSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        
        socket.on('notification', async (data) => {
            if (!data || !data.senderId || !data.recipientId || !data.message || !data.type) {
                console.error('Invalid notification data:', data);
                socket.emit('error', 'Invalid notification data');
                return;
            }
            const { senderId, senderModel, recipientId, recipientModel, message, type, orderId } = data;
            try {
                const savedNotification = await notificationRepository.createNotification(
                    senderId, senderModel, recipientId, recipientModel, message, type, orderId
                );
                io.to(recipientId).emit('gotNotification', savedNotification);
                console.log(`Notification sent to recipient: ${recipientId} (Socket ID: ${recipientId})`);
            } catch (error) {
                console.error('Error saving notification:', error);
            }
        });

        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', async (data) => {
            console.log('sendMessage event triggered:', data);
            const { chatId, sender, message } = data;
            if (!chatId || !sender || !message) {
                console.error('Invalid message data:', data);
                socket.emit('error', 'Invalid message data');
                return;
            }
            try {
                const newMessage = await chatRepository.saveMessage(chatId, sender, message);
                await chatRepository.updateChatLastMessage(chatId, message);
                io.to(chatId).emit('newMessage', newMessage);
            } catch (error) {
                if (error instanceof Error)
                    console.error('Error handling sendMessage:', error.message);
                socket.emit('error', 'Message could not be saved');
            }
        });

        socket.on("disconnect", () => {
            console.log('User disconnected:',socket.id )
        });
        
    });
}
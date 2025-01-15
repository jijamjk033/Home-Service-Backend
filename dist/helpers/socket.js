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
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const chatRepository_1 = require("../repositories/chatRepository");
const notificationRepository_1 = require("../repositories/notificationRepository");
let io;
const userSocketMap = new Map();
const setupSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ["GET", "POST"]
        }
    });
    io.on("connect", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("register", (userId) => {
            userSocketMap.set(userId, socket.id);
            console.log(`User registered: ${userId} -> Socket ID: ${socket.id}`);
        });
        socket.on('notification', (data) => __awaiter(void 0, void 0, void 0, function* () {
            if (!data || !data.senderId || !data.recipientId || !data.message || !data.type) {
                console.error('Invalid notification data:', data);
                socket.emit('error', 'Invalid notification data');
                return;
            }
            const { senderId, senderModel, recipientId, recipientModel, message, type, orderId } = data;
            try {
                const savedNotification = yield notificationRepository_1.notificationRepository.createNotification(senderId, senderModel, recipientId, recipientModel, message, type, orderId);
                const recipientSocketId = userSocketMap.get(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('gotNotification', savedNotification);
                    console.log(`Notification sent to recipient: ${recipientId} (Socket ID: ${recipientSocketId})`);
                }
                else {
                    console.log(`Recipient ${recipientId} is not connected`);
                }
            }
            catch (error) {
                console.error('Error saving notification:', error);
            }
        }));
        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
        });
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('sendMessage event triggered:', data);
            const { chatId, sender, message } = data;
            if (!chatId || !sender || !message) {
                console.error('Invalid message data:', data);
                socket.emit('error', 'Invalid message data');
                return;
            }
            try {
                const newMessage = yield chatRepository_1.chatRepository.saveMessage(chatId, sender, message);
                yield chatRepository_1.chatRepository.updateChatLastMessage(chatId, message);
                io.to(chatId).emit('newMessage', newMessage);
            }
            catch (error) {
                if (error instanceof Error)
                    console.error('Error handling sendMessage:', error.message);
                socket.emit('error', 'Message could not be saved');
            }
        }));
        socket.on("disconnect", () => {
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User disconnected: ${userId}`);
                    break;
                }
            }
        });
    });
};
exports.setupSocket = setupSocket;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const setupSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('notification', (data) => {
            console.log('Notification received:', data);
            io.to(data.recipientId).emit('notification', {
                message: data.message,
                senderId: data.senderId,
                orderId: data.orderId,
            });
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};
exports.setupSocket = setupSocket;

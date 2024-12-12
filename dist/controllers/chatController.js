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
exports.chatController = void 0;
const chatService_1 = require("../services/chatService");
const http_status_codes_1 = require("http-status-codes");
class ChatController {
    initiateChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, employeeId } = req.body;
                const result = yield chatService_1.chatService.initiateChat(userId, employeeId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: result,
                    message: 'Chat initiated successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error initiating chat', err,
                });
            }
        });
    }
    messageSend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text, sender } = req.body;
                const chatId = req.params.chatId;
                const result = yield chatService_1.chatService.messageSent(chatId, sender, text);
                console.log(result);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: result,
                    message: 'Message sent successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error sending message', err,
                });
            }
        });
    }
    getChatMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.params.chatId;
                const messages = yield chatService_1.chatService.getChatMessages(chatId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: messages,
                    message: ' Messages fetched successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error fetching Messages', err,
                });
            }
        });
    }
    getUserChatRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const chatData = yield chatService_1.chatService.getChatMessages(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: chatData,
                    message: ' Chat details fetched successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error fetching Chat details', err,
                });
            }
        });
    }
}
exports.chatController = new ChatController();

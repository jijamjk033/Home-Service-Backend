"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post('/initiate', chatController_1.chatController.initiateChat);
router.post('/:chatId/message', chatController_1.chatController.messageSend);
router.get('/:chatId/chatRoomMessages', chatController_1.chatController.getChatMessages);
exports.default = router;

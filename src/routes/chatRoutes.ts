import express from 'express';
import { chatController } from '../controllers/chatController';

const router = express.Router();

router.post('/initiate', chatController.initiateChat);
router.post('/:chatId/message', chatController.messageSend);
router.get('/:chatId/chatRoomMessages', chatController.getChatMessages);

export default router;
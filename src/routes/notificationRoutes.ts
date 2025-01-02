import express from 'express';
import { notificationController } from '../controllers/notificationController';

const router = express.Router();

router.get('/:id/notifications',notificationController.fetchNotifications);

export default router;
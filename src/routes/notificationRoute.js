import express from 'express';

import { createNotification, getNotificationsForUser, markNotificationAsRead } from '@/controllers/notificationController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router();

router.get('/getNoti', authenticateToken.verifyToken, getNotificationsForUser)
router.post('/createNoti', authenticateToken.verifyToken, createNotification)
router.put('/markNotiAsRead/:notiId', authenticateToken.verifyToken, markNotificationAsRead)

export default router;

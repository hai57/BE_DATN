import express from 'express';

import { createSchedule, getSchedule, updateSchedule, deleteSchedule, createScheduleUser, getscheduleUser, updateScheduleUser, deleteScheduleUser } from '@/controllers/scheduleController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router()

router.get('/getSchedule', authenticateToken.verifyToken, getSchedule);
router.post('/createSchedule', authenticateToken.verifyToken, createSchedule);
router.put('/updateSchedule', authenticateToken.verifyToken, updateSchedule)
router.delete('/deleteSchedule', authenticateToken.verifyToken, deleteSchedule)

//schedule user
router.post('/createScheduleUser', authenticateToken.verifyToken, createScheduleUser);
router.get('/getscheduleUser', authenticateToken.verifyToken, getscheduleUser);
router.put('/updateScheduleUser', authenticateToken.verifyToken, updateScheduleUser);
router.delete('/deleteScheduleUser', authenticateToken.verifyToken, deleteScheduleUser);

export default router;

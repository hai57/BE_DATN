import express from 'express';

import { createSchedule, getSchedule, updateSchedule, deleteSchedule, createScheduleUser, getscheduleUser, updateScheduleUser, deleteScheduleUser } from '@/controllers/scheduleController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router()

router.get('/get-schedule', authenticateToken.verifyToken, getSchedule);
router.post('/create-schedule', authenticateToken.verifyToken, createSchedule);
router.put('/update-schedule', authenticateToken.verifyToken, updateSchedule)
router.delete('/delete-schedule', authenticateToken.verifyToken, deleteSchedule)
//schedule user
router.post('/createScheduleUser', authenticateToken.verifyToken, createScheduleUser);
router.get('/getscheduleUser', authenticateToken.verifyToken, getscheduleUser);
router.put('/updateScheduleUser', authenticateToken.verifyToken, updateScheduleUser);
router.delete('/deleteScheduleUser', authenticateToken.verifyToken, deleteScheduleUser);

export default router;

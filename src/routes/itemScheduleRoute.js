import express from 'express';

import { createItemSchedule, getAllItem, updateItemSchedule, deleteItemSchedule, createTypeSchedule, getTypeSchedule, updateTypeSchedule, deleteTypeSchedule } from '@/controllers/itemScheduleController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router();

router.post('/create-item-schedule', authenticateToken.verifyToken, createItemSchedule)
router.get('/get-all-item', authenticateToken.verifyToken, getAllItem)
router.put('/update-item-schedule', authenticateToken.verifyToken, updateItemSchedule)
router.delete('/delete-item-schedule', authenticateToken.verifyToken, deleteItemSchedule)

// type schedule
router.post('/create-type-schedule', authenticateToken.verifyToken, createTypeSchedule)
router.get('/get-type-schedule', authenticateToken.verifyToken, getTypeSchedule)
router.put('/update-type-schedule', authenticateToken.verifyToken, updateTypeSchedule)
router.delete('/delete-type-schedule', authenticateToken.verifyToken, deleteTypeSchedule)

export default router;

import express from 'express';

import { createItemSchedule, getAllItem, updateItemSchedule, deleteItemSchedule, createTypeSchedule, getTypeSchedule, updateTypeSchedule, deleteTypeSchedule } from '@/controllers/itemScheduleController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router();

router.post('/createItemSchedule', authenticateToken.verifyToken, createItemSchedule)
router.get('/getAllItem', authenticateToken.verifyToken, getAllItem)
router.put('/updateItemSchedule', authenticateToken.verifyToken, updateItemSchedule)
router.delete('/deleteItemSchedule', authenticateToken.verifyToken, deleteItemSchedule)

// type schedule
router.post('/createTypeSchedule', authenticateToken.verifyToken, createTypeSchedule)
router.get('/getTypeSchedule', authenticateToken.verifyToken, getTypeSchedule)
router.put('/updateTypeSchedule', authenticateToken.verifyToken, updateTypeSchedule)
router.delete('/deleteTypeSchedule', authenticateToken.verifyToken, deleteTypeSchedule)

export default router;

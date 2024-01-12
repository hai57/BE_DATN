import express from 'express'

import { createCalories, getCalories, updateCalories, deleteCalories } from '@/controllers/caloriesController.js';
import { authenticateToken } from '@/middlewares/index.js'
const router = express.Router()

router.post('/create-calories', authenticateToken.verifyToken, createCalories)
router.get('/get-calories', authenticateToken.verifyToken, getCalories)
router.put('/update-calories', authenticateToken.verifyToken, updateCalories)
router.delete('/delete-calories', authenticateToken.verifyToken, deleteCalories)

export default router;

import express from 'express';

import { createType, getType, updateType, deleteType } from '@/controllers/typeController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router();

router.post('/create-type', authenticateToken.verifyToken, createType);
router.get('/get-type', authenticateToken.verifyToken, getType);
router.put('/update-type', authenticateToken.verifyToken, updateType);
router.delete('/delete-type', authenticateToken.verifyToken, deleteType);


export default router;

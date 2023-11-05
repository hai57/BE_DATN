import express from 'express';

import { createTime, getTime, updateTime, deleteTime } from '@/controllers/timeController.js';

const router = express.Router();

router.post('/createTime', createTime)
router.get('/getTime', getTime)
router.put('/updateTime', updateTime)
router.delete('/deleteTime', deleteTime)

export default router;

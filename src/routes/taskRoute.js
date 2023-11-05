import express from 'express'

import { getAllTasks, createTasks, updateTask, deleteTask, createTypeTask, getTypeTask, updateTypeTask, deleteTypeTask } from '@/controllers/tasksController.js';
import { taskContentMiddleware } from '@/middlewares/index.js';

const router = express.Router()

router.post('/createTask', taskContentMiddleware, createTasks)
router.get('/getAllTasks', getAllTasks)
router.put('/updateTask', taskContentMiddleware, updateTask)
router.post('/deleteTask', deleteTask)


//type task

router.post('/createTypeTask', createTypeTask)
router.get('/getTypeTask', getTypeTask)
router.put('/updateTypeTask', updateTypeTask)
router.delete('/deleteTypeTask', deleteTypeTask)

export default router;

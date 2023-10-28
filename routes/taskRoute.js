const express = require('express')
const router = express.Router()
const {getAllTasks, createTasks,updateTask,deleteTask, createTypeTask, getTypeTask,updateTypeTask,deleteTypeTask } = require('@/controllers/tasksController')
const {taskContentMiddleware} = require('@/middlewares')

router.post('/createTask',taskContentMiddleware, createTasks)
router.get('/getAllTasks', getAllTasks)
router.put('/updateTask',taskContentMiddleware, updateTask)
router.post('/deleteTask', deleteTask)


//type task

router.post('/createTypeTask', createTypeTask)
router.get('/getTypeTask', getTypeTask)
router.put('/updateTypeTask', updateTypeTask)
router.delete('/deleteTypeTask', deleteTypeTask)

module.exports = router;

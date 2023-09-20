const express = require('express')
const router = express.Router()
const {getAllTasks, createTasks, createTypeTask, getTypeTask} = require('../controllers/tasksController')
const {taskContentMiddleware} = require('../middlewares')

router.get('/getAllTasks', getAllTasks)
router.post('/createTask/',taskContentMiddleware, createTasks)
router.post('/createTypeTask', createTypeTask)
router.get('/getTypeTask', getTypeTask)

module.exports = router;

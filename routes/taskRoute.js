const express = require('express')
const router = express.Router()
const {getAllTasks, createTasks, getTask} = require('../controllers/tasksController')
const {authenticateToken,getScheduleId} = require('../middlewares')

router.get('/getAllTasks/:scheduleId',getScheduleId,authenticateToken.verifyToken, getAllTasks)
router.get('/getTask/:scheduleId',getScheduleId,authenticateToken.verifyToken, getTask)
router.post('/createTask/:scheduleId',getScheduleId,authenticateToken.verifyToken, createTasks)

module.exports = router;

const express = require('express')
const router = express.Router()
const {createSchedule,getSchedule,getAllSchedule,createScheduleUser,getscheduleUser} = require('../controllers/scheduleController')
const {authenticateToken} = require('../middlewares')

router.get('/getSchedule/:scheduleId',authenticateToken.verifyToken,getSchedule);
router.get('/getAllSchedule',authenticateToken.verifyToken,getAllSchedule);
router.post('/createSchedule',authenticateToken.verifyToken,createSchedule);
router.post('/createScheduleUser',authenticateToken.verifyToken,createScheduleUser);
router.get('/getscheduleUser',authenticateToken.verifyToken,getscheduleUser);

module.exports = router;

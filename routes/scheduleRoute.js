const express = require('express')
const router = express.Router()
const {createSchedule,getSchedule,updateSchedule,createScheduleUser,getscheduleUser} = require('../controllers/scheduleController')
const {authenticateToken} = require('../middlewares')

router.get('/getSchedule',getSchedule);
router.post('/createSchedule',createSchedule);
router.put('/updateSchedule',updateSchedule)
router.post('/createScheduleUser',authenticateToken.verifyToken,createScheduleUser);
router.get('/getscheduleUser',authenticateToken.verifyToken,getscheduleUser);

module.exports = router;

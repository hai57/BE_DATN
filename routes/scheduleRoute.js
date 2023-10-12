const express = require('express')
const router = express.Router()
const {createSchedule,getSchedule,updateSchedule,deleteSchedule,createScheduleUser,getscheduleUser,updateScheduleUser,deleteScheduleUser} = require('../controllers/scheduleController')
const {authenticateToken} = require('../middlewares')

router.get('/getSchedule',getSchedule);
router.post('/createSchedule',createSchedule);
router.put('/updateSchedule',updateSchedule)
router.delete('/deleteSchedule',deleteSchedule)
//schedule user
router.post('/createScheduleUser',authenticateToken.verifyToken,createScheduleUser);
router.get('/getscheduleUser',authenticateToken.verifyToken,getscheduleUser);
router.put('/updateScheduleUser',authenticateToken.verifyToken,updateScheduleUser);
router.delete('/deleteScheduleUser',authenticateToken.verifyToken,deleteScheduleUser);

module.exports = router;

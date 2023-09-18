const express = require('express')
const router = express.Router()
const {createSchedule,getSchedule,getAllSchedule} = require('../controllers/scheduleController')
const {authenticateToken} = require('../middlewares')

router.get('/getSchedule/:scheduleId',authenticateToken.verifyToken,getSchedule);
router.get('/getAllSchedule',authenticateToken.verifyToken,getAllSchedule);
router.post('/createSchedule',authenticateToken.verifyToken,createSchedule);

module.exports = router;

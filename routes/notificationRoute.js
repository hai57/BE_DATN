const express = require('express')
const router = express.Router()
const {createNotification,getNotificationsForUser,markNotificationAsRead} = require('../controllers/notificationController')
const {authenticateToken} = require('../middlewares')

router.get('/getNoti',authenticateToken.verifyToken,getNotificationsForUser)
router.post('/createNoti',authenticateToken.verifyToken,createNotification)
router.put('/markNotiAsRead/:notiId',authenticateToken.verifyToken,markNotificationAsRead)

module.exports = router;

const express = require('express');
const router = express.Router();
const {createTime,getTime} = require('../controllers/timeController')

router.post('/createTime', createTime)
router.get('/getTime', getTime)

module.exports = router

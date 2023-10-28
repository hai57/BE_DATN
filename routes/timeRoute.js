const express = require('express');
const router = express.Router();
const {createTime,getTime,updateTime,deleteTime} = require('@/controllers/timeController')

router.post('/createTime', createTime)
router.get('/getTime', getTime)
router.put('/updateTime', updateTime)
router.delete('/deleteTime', deleteTime)

module.exports = router

const express = require('express')
const { createRole, getRole } = require('../controllers/roleController')
const router = express.Router()
const {createUser,getUser,login,refreshToken,deleteUser, getAllUser, updateUser } = require("../controllers/userController")
const {authenticateToken } = require("../middlewares")


router.get('/getAllUser', getAllUser)
router.get('/getUser',getUser)
router.post('/createUser', createUser)
router.delete('/deleteUser', deleteUser)
router.put('/updateUser',authenticateToken.verifyToken,updateUser)

//Role route
router.post('/createRole', createRole)
router.get('/getRole', getRole)

router.post('/login', login)
router.put('/refreshToken',authenticateToken.verifyToken, authenticateToken.isAdmin, refreshToken)

module.exports=router;

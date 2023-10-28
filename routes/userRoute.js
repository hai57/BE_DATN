const express = require('express')
const { createRole, getRole,updateRole, deleteRole } = require('@/controllers/roleController')
const router = express.Router()
const {createUser,getUser,login,refreshToken,deleteUser, getAllUser, updateUser } = require("@/controllers/userController")
const {authenticateToken } = require("@/middlewares")


router.get('/getAllUser',authenticateToken.verifyToken,authenticateToken.isAdmin, getAllUser)
router.get('/getUser',getUser)
router.post('/createUser', createUser)
router.delete('/deleteUser',authenticateToken.verifyToken, deleteUser)
router.put('/updateUser',authenticateToken.verifyToken,updateUser)

router.post('/login', login)
router.put('/refreshToken',authenticateToken.verifyToken, authenticateToken.isAdmin, refreshToken)

//Role route
router.post('/createRole', createRole)
router.get('/getRole', getRole)
router.put('/updateRole', updateRole)
router.delete('/deleteRole', deleteRole)

module.exports=router;

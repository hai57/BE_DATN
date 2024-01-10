import express from 'express';

import { createRole, getRole, updateRole, deleteRole } from '@/controllers/roleController.js';
import { createUser, getAllUser, getUser, updateUser, updateUserWithIdForAdmin, deleteUser, getToken, login, register } from '@/controllers/userController.js';
import { authenticateToken, checkTokenValidity } from '@/middlewares/index.js';

const router = express.Router()

router.get('/get-all-user', authenticateToken.verifyToken, getAllUser)
router.get('/get-user', authenticateToken.verifyToken, getUser)

router.post('/register', register)
router.post('/create-user', createUser)
router.delete('/delete-user', authenticateToken.verifyToken, deleteUser)
router.put('/update-user', authenticateToken.verifyToken, updateUser)
router.put('/update-user-with-id', authenticateToken.verifyToken, updateUserWithIdForAdmin)
router.get('/get-token', getToken)
router.get('/checkToken', checkTokenValidity)

router.post('/login', login)
// router.put('/refreshToken', authenticateToken.verifyToken, authenticateToken.isAdmin, refreshToken)

//Role route
router.post('/createRole', createRole)
router.get('/getRole', getRole)
router.put('/updateRole', updateRole)
router.delete('/deleteRole', deleteRole)

export default router;

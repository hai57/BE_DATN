import express from 'express';

import { createRole, getRole, updateRole, deleteRole } from '@/controllers/roleController.js';
import { createUser, getAllUser,getUser, updateUser, deleteUser, getToken, login} from '@/controllers/userController.js';
import { authenticateToken } from '@/middlewares/index.js';

const router = express.Router()

router.get('/getAllUser', authenticateToken.verifyToken, getAllUser)
router.get('/getUser',authenticateToken.verifyToken, getUser)
router.post('/createUser', createUser)
router.delete('/deleteUser', authenticateToken.verifyToken, deleteUser)
router.put('/updateUser', authenticateToken.verifyToken, updateUser)
router.get('/getToken', getToken)

router.post('/login', login)
// router.put('/refreshToken', authenticateToken.verifyToken, authenticateToken.isAdmin, refreshToken)

//Role route
router.post('/createRole', createRole)
router.get('/getRole', getRole)
router.put('/updateRole', updateRole)
router.delete('/deleteRole', deleteRole)

export default router;

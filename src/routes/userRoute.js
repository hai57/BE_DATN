import express from 'express';

import { createRole, getRole, updateRole, deleteRole } from '@/controllers/roleController.js';
import { createStatis, getStatis } from '@/controllers/statisController.js';
import { createUser, getAllUser, getUser, updateUser, updateUserWithIdForAdmin, deleteUser, getToken, login, register, loginAdmin, getCaloriesNeed } from '@/controllers/userController.js';
import { authenticateToken, checkTokenValidity, upload } from '@/middlewares/index.js';
import { uploadFile, getImagesInFolder } from "@/controllers/uploadFileController.js";


const router = express.Router()

router.get('/get-all-user', authenticateToken.verifyToken, getAllUser)
router.get('/get-user', authenticateToken.verifyToken, getUser)
router.get('/get-calories-need', authenticateToken.verifyToken, getCaloriesNeed)
router.post('/register', register)
router.post('/create-user', createUser)
router.delete('/delete-user', authenticateToken.verifyToken, deleteUser)
router.put('/update-user', authenticateToken.verifyToken, updateUser)
router.put('/update-user-with-id', authenticateToken.verifyToken, updateUserWithIdForAdmin)
router.get('/get-token', getToken)
router.get('/checkToken', checkTokenValidity)
router.get('/check-token-admin', authenticateToken.isAdmin, checkTokenValidity)

router.post('/login', login)
router.post('/loginAdmin', loginAdmin)
// router.put('/refreshToken', authenticateToken.verifyToken, authenticateToken.isAdmin, refreshToken)



//Role route
router.post('/createRole', createRole)
router.get('/getRole', getRole)
router.put('/updateRole', updateRole)
router.delete('/deleteRole', deleteRole)

router.post('/create-statis', authenticateToken.verifyToken, createStatis)
router.get('/get-statis', authenticateToken.verifyToken, getStatis)

//upload
router.post('/upload', upload.single('image'), uploadFile)

router.get('/get-images', getImagesInFolder);

export default router;

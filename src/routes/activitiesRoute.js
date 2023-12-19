import express from 'express'

import { getAllActivities, createActivities, updateActivities, deleteActivities, getActivityById, createTypeActivities, getTypeActivities, updateTypeActivities, deleteTypeActivities } from '@/controllers/activitiesController.js';
import { getSubActivities, getSubActivitiesByIdActivity, createSubActivities, updateSubActivities, deleteSubActivities } from '@/controllers/subActivitiesController.js';
import { authenticateToken } from '@/middlewares/index.js'
const router = express.Router()

router.post('/createActivities', authenticateToken.verifyToken, createActivities)
router.get('/getAllActivities', authenticateToken.verifyToken, getAllActivities)
router.put('/updateActivities', authenticateToken.verifyToken, updateActivities)
router.delete('/deleteActivities', authenticateToken.verifyToken, deleteActivities)
router.get('/getActivityById/:activityId', authenticateToken.verifyToken, getActivityById)


//sub activities

router.post('/createSubActivities', authenticateToken.verifyToken, createSubActivities)
router.get('/getSubActivities', authenticateToken.verifyToken, getSubActivities)
router.get('/getSubActivitiesByIdActivity/:activityId', authenticateToken.verifyToken, getSubActivitiesByIdActivity)
router.put('/updateSubActivities', authenticateToken.verifyToken, updateSubActivities)
router.delete('/deleteSubActivities', authenticateToken.verifyToken, deleteSubActivities)

//type Activities

router.post('/createTypeActivities', authenticateToken.verifyToken, createTypeActivities)
router.get('/getTypeActivities', authenticateToken.verifyToken, getTypeActivities)
router.put('/updateTypeActivities', authenticateToken.verifyToken, updateTypeActivities)
router.delete('/deleteTypeActivities', authenticateToken.verifyToken, deleteTypeActivities)

export default router;

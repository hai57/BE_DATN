import express from 'express'

import { getAllActivities, createActivities, updateActivities, updateActivitiesByParamId, deleteActivities, getActivityById, createTypeActivities, getTypeActivities, updateTypeActivities, deleteTypeActivities } from '@/controllers/activitiesController.js';
import { getSubActivities, getSubActivitiesByIdActivity, createSubActivities, updateSubActivities, deleteSubActivities } from '@/controllers/subActivitiesController.js';
import { authenticateToken } from '@/middlewares/index.js'
const router = express.Router()

router.post('/create-activities', authenticateToken.verifyToken, createActivities)
router.get('/get-all-activities', authenticateToken.verifyToken, getAllActivities)
router.put('/update-activities', authenticateToken.verifyToken, updateActivities)
router.put('/update-activities-by-id/:activityId', authenticateToken.verifyToken, updateActivitiesByParamId)
router.delete('/delete-activities', authenticateToken.verifyToken, deleteActivities)
router.get('/get-activity-by-id/:activityId', authenticateToken.verifyToken, getActivityById)


//sub activities

router.post('/create-subactivities', authenticateToken.verifyToken, createSubActivities)
router.get('/get-subactivities', authenticateToken.verifyToken, getSubActivities)
router.get('/get-subactivities-by-id-activity/:activityId', authenticateToken.verifyToken, getSubActivitiesByIdActivity)
router.put('/update-subactivities', authenticateToken.verifyToken, updateSubActivities)
router.delete('/delete-subactivities', authenticateToken.verifyToken, deleteSubActivities)

//type Activities

router.post('/create-type-activities', authenticateToken.verifyToken, createTypeActivities)
router.get('/get-type-activities', authenticateToken.verifyToken, getTypeActivities)
router.put('/update-type-activities', authenticateToken.verifyToken, updateTypeActivities)
router.delete('/delete-type-activities', authenticateToken.verifyToken, deleteTypeActivities)

export default router;

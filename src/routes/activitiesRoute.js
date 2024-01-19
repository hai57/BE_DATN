import express from 'express'

import { getActivities, createActivities, updateActivities, updateActivitiesByParamId, deleteActivities, getActivityById, createTypeActivities, getTypeActivities, updateTypeActivities, deleteTypeActivities } from '@/controllers/activitiesController.js';
import { getSubActivities, createSubActivities, updateSubActivities, deleteSubActivities } from '@/controllers/subActivitiesController.js';
import { authenticateToken } from '@/middlewares/index.js'
const router = express.Router()

router.post('/create-activity', authenticateToken.verifyToken, createActivities)
router.get('/get-activity', authenticateToken.verifyToken, getActivities)
router.put('/update-activity', authenticateToken.verifyToken, updateActivities)
router.put('/update-activity-by-id/:activityId', authenticateToken.verifyToken, updateActivitiesByParamId)
router.delete('/delete-activity', authenticateToken.verifyToken, deleteActivities)
router.get('/get-activity-by-id/:activityId', authenticateToken.verifyToken, getActivityById)


//sub activities

router.post('/create-subactivity', authenticateToken.verifyToken, createSubActivities)
router.get('/get-subactivity', authenticateToken.verifyToken, getSubActivities)
router.put('/update-subactivity', authenticateToken.verifyToken, updateSubActivities)
router.delete('/delete-subactivity', authenticateToken.verifyToken, deleteSubActivities)

//type Activities

router.post('/create-type-activities', authenticateToken.verifyToken, createTypeActivities)
router.get('/get-type-activities', authenticateToken.verifyToken, getTypeActivities)
router.put('/update-type-activities', authenticateToken.verifyToken, updateTypeActivities)
router.delete('/delete-type-activities', authenticateToken.verifyToken, deleteTypeActivities)

export default router;

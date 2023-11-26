import { SubActivities } from '@/models/subActivitiesModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSubActivities = async(req, res) =>{
  try {
    const subActivities = await SubActivities.find()
    res.status(status.OK).json({ message: message.OK, subActivities });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const createSubActivities = async(req, res) => {
  try {
    const newSubActivities = new SubActivities(req.body)
    await newSubActivities.save()
    res.status(status.CREATED).json({ message: message.CREATED, newSubActivities })
  } catch (err) {
    return res.status(status.ERROR).json({ message : message.ERROR.SERVER });
  }
};

const updateSubActivities = async(req, res) => {
  try {
    const checkSubactivitiesId = await SubActivities.findById(req.body.subsactivitiesID).exec()
    if(!checkSubactivitiesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.content) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    checkSubactivitiesId.content = req.body.content;
    checkSubactivitiesId.time = req.body.time;
    checkSubactivitiesId.amount = req.body.amount
    await checkRoleID.save()
    res.status(status.OK).json({ message: message.OK, checkRoleID})
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  }
};

const deleteSubActivities = async(req, res) => {
  try{
    const checkSubactivitiesId = await SubActivities.findById(req.body.subsactivitiesID).exec()
    if(!checkRoleID) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND})
    }
    await checkSubactivitiesId.findByIdAndRemove(checkSubactivitiesId)
    res.status(status.OK).json({ message: message.OK });
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  };
};

export { getSubActivities, createSubActivities, updateSubActivities, deleteSubActivities }

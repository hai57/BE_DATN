import mongoose from 'mongoose';

import { SubActivities } from '@/models/subActivitiesModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSelectedSubActivityFields = (subActivity) => {
  return {
    subActivityId: subActivity._id,
    activityId: subActivity.activity || '',
    subActivityName: subActivity.subActivityName || '',
    amount: subActivity.amount || '',
    unit: subActivity.unit || '',
    iconCode: subActivity.iconCode || ''
  };
};

const getSubActivities = async (req, res) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 10
  try {
    const subActivities = await SubActivities.aggregate([
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activities'
        }
      },
      {
        $addFields: {
          activityName: { $arrayElemAt: ['$activities.activityName', 0] },
          activityId: { $arrayElemAt: ['$activities._id', 0] },
          subActivityId: '$_id'
        }
      },
      {
        $project: {
          _id: 0,
          subActivityId: 1,
          subActivityName: 1,
          amount: 1,
          iconCode: 1,
          unit: 1,
          activityId: 1,
          activityName: 1
        },
      },

    ])
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    if (!subActivities) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    res.status(status.OK).json({ message: message.OK, items: subActivities });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getSubActivitiesByIdActivity = async (req, res) => {
  const activityId = req.params.activityId;
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 10;

  try {
    const subActivities = await SubActivities.find({
      activity: mongoose.Types.ObjectId(activityId)
    })
      .skip(parseInt(offset))
      .limit(parseInt(limit))

    if (!subActivities) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }
    const formattedSubActivities = subActivities.map((subActivity) => ({
      subActivityId: subActivity._id,
      subActivityName: subActivity.subActivityName || '',
      activityId: subActivity.activity || '',
      amount: subActivity.amount || '',
      unit: subActivity.unit || '',
      iconCode: subActivity.iconCode || ''
    }));
    res.status(status.OK).json({ message: message.OK, items: formattedSubActivities });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
}

const createSubActivities = async (req, res) => {
  try {

    // Tạo một thời gian mới
    const newSubActivities = new SubActivities({
      activity: req.body.activityId,
      iconCode: req.body.iconCode,
      subActivityName: req.body.subActivityName,
      amount: req.body.amount,
      unit: req.body.unit
    });
    if (!req.body.activityId || !req.body.subActivityName || !req.body.amount || !req.body.unit) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newSubActivities.save();
    const selectedSubactivity = getSelectedSubActivityFields(newSubActivities)
    return res.status(status.CREATED).json({ message: message.CREATED, subactivity: selectedSubactivity });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateSubActivities = async (req, res) => {
  try {
    const checkSubactivitiesId = await SubActivities.findById(req.body.subActivityId).exec()
    if (!checkSubactivitiesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.subActivityName || !req.body.amount || !req.body.unit) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    checkSubactivitiesId.activity = req.body.activityId
    checkSubactivitiesId.subActivityName = req.body.subActivityName
    checkSubactivitiesId.amount = req.body.amount
    checkSubactivitiesId.unit = req.body.unit
    checkSubactivitiesId.iconCode = req.body.iconCode
    await checkSubactivitiesId.save()
    const selectedSubActivity = getSelectedSubActivityFields(checkSubactivitiesId)
    res.status(status.OK).json({ message: message.UPDATED, subactivity: selectedSubActivity })
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteSubActivities = async (req, res) => {
  try {
    const checkSubActivitiesId = await SubActivities.findById(req.body.subActivitiesId).exec()
    if (!checkSubActivitiesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await SubActivities.findByIdAndRemove(checkSubActivitiesId)
    res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  };
};

export { getSubActivities, getSubActivitiesByIdActivity, createSubActivities, updateSubActivities, deleteSubActivities }

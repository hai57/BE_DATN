import mongoose from 'mongoose';

import { SubActivities } from '@/models/subActivitiesModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSelectedSubActivityFields = (subActivity) => {
  return {
    id: subActivity._id,
    activity: subActivity.activity || '',
    name: subActivity.name || '',
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
          nameActivities: { $arrayElemAt: ['$activities.description', 0] },
          idActivities: { $arrayElemAt: ['$activities._id', 0] },
          id: '$_id'
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          amount: 1,
          iconCode: 1,
          unit: 1,
          nameActivities: 1,
          idActivities: 1
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
      id: subActivity._id,
      name: subActivity.name || '',
      activity: subActivity.activity || '',
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
      activity: req.body.idActivities,
      iconCode: req.body.iconCode,
      name: req.body.name,
      amount: req.body.amount,
      unit: req.body.unit
    });
    if (!req.body.idActivities || !req.body.name || !req.body.amount || !req.body.unit) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newSubActivities.save();
    const selectedSubActivity = getSelectedSubActivityFields(newSubActivities)
    return res.status(status.CREATED).json({ message: message.CREATED, items: selectedSubActivity });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateSubActivities = async (req, res) => {
  try {
    const checkSubactivitiesId = await SubActivities.findById(req.body.subActivitiesID).exec()
    if (!checkSubactivitiesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.name || !req.body.amount || !req.body.unit) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    checkSubactivitiesId.name = req.body.name
    checkSubactivitiesId.amount = req.body.amount
    checkSubactivitiesId.unit = req.body.unit
    checkSubactivitiesId.iconCode = req.body.iconCode
    await checkSubactivitiesId.save()
    const selectedSubActivity = getSelectedSubActivityFields(checkSubactivitiesId)
    res.status(status.OK).json({ message: message.OK, items: selectedSubActivity })
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteSubActivities = async (req, res) => {
  try {
    const checkSubActivitiesId = await SubActivities.findById(req.body.subActivitiesID).exec()
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

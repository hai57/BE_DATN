import { Activities } from '@/models/activitiesModels.js';
import { Type } from '@/models/typeModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSelectedActivityFields = (activity) => {
  return {
    activityId: activity._id,
    type: activity.type || '',
    activityName: activity.activityName || '',
    description: activity.description || '',
    isParent: activity.isParent,
    iconCode: activity.iconCode || ''
  };
};

//type
const createTypeActivities = async (req, res) => {
  try {
    const type = new Type(req.body)
    if (!req.body.name) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    await type.save()
    return res.status(status.CREATED).json({ message: message.CREATED })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const getTypeActivities = async (req, res) => {
  try {
    const type = await Type.find().select('-__v');
    if (type.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    return res.status(status.OK).json({ message: message.OK, type })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateTypeActivities = async (req, res) => {
  try {
    const idType = await Type.findById(req.body.idType).select('-__v');
    if (!idType) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    idType.name = req.body.name;
    await idType.save()
    return res.status(status.OK).json({ message: message.UPDATED, type: idType })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteTypeActivities = async (req, res) => {
  try {
    const idType = await Type.findById(req.body.idType).exec()
    if (!idType) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await idType.findByIdAndRemove(idType)
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

//Activities

const getActivities = async (req, res) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 10
  const typeParam = req.query.type;
  try {
    let activities;

    if (typeParam === "1" || typeParam === "2" || typeParam === "3") {
      activities = await Activities.aggregate([
        {
          $match: {
            type: typeParam
          }
        },
        {
          $lookup: {
            from: 'types',
            localField: 'type',
            foreignField: '_id',
            as: 'typeActivities'
          }
        },
        {
          $addFields: {
            type: { $arrayElemAt: ['$typeActivities._id', 0] },
            typeName: { $arrayElemAt: ['$typeActivities.name', 0] },
            activityId: '$_id'

          }
        },
        {
          $project: {
            _id: 0,
            activityId: 1,
            activityName: 1,
            iconCode: 1,
            isParent: 1,
            description: 1,
            type: 1,
            typeName: 1
          },
        },
        {
          $skip: offset
        },
        {
          $limit: limit
        }
      ])
    } else {
      activities = await Activities.aggregate([
        {
          $lookup: {
            from: 'types',
            localField: 'type',
            foreignField: '_id',
            as: 'typeActivities'
          }
        },
        {
          $addFields: {
            type: { $arrayElemAt: ['$typeActivities._id', 0] },
            typeName: { $arrayElemAt: ['$typeActivities.name', 0] },
            activityId: '$_id'

          }
        },
        {
          $project: {
            _id: 0,
            activityId: 1,
            activityName: 1,
            iconCode: 1,
            isParent: 1,
            description: 1,
            type: 1,
            typeName: 1
          },
        },
        {
          $skip: offset
        },
        {
          $limit: limit
        }
      ])
    }
    return res.status(status.OK).json({ message: message.OK, items: activities });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getActivityById = async (req, res) => {
  const activityId = req.params.activityId;

  try {
    const activity = await Activities.findById(activityId).select('-__v');

    if (!activity) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }
    const selectedActivity = getSelectedActivityFields(activity)
    res.status(status.OK).json({ message: message.OK, activity: selectedActivity });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const createActivities = async (req, res) => {
  try {
    const newActivities = new Activities(
      {
        activityName: req.body.activityName,
        type: req.body.type,
        description: req.body.description,
        isParent: req.body.isParent,
        iconCode: req.body.iconCode
      }
    );
    if (!req.body.activityName || !req.body.description || !req.body.type) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newActivities.save();
    const selectActivity = getSelectedActivityFields(newActivities)
    res.status(status.CREATED).json({ message: message.CREATED, activity: selectActivity });
  } catch (err) {
    console.log(err)
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateActivities = async (req, res) => {
  try {
    const activity = await Activities.findById(req.body.activityId)
    if (!activity) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.activityName || !req.body.description || !req.body.type) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    activity.type = req.body.type;
    activity.activityName = req.body.activityName;
    activity.description = req.body.description;
    activity.iconCode = req.body.iconCode;
    await activity.save()
    const selectedActivity = getSelectedActivityFields(activity)
    return res.status(status.OK).json({ message: message.UPDATED, activity: selectedActivity })
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateActivitiesByParamId = async (req, res) => {
  try {
    const activity = await Activities.findById(req.params.activityId)
    if (!activity) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.activityName || !req.body.description) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    activity.type = req.body.type;
    activity.activityName = req.body.activityName;
    activity.description = req.body.description;
    activity.iconCode = req.body.iconCode;
    await activity.save()
    const selectedActivity = getSelectedActivityFields(activity)
    return res.status(status.OK).json({ message: message.UPDATED, activity: selectedActivity })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteActivities = async (req, res) => {
  try {
    const activityId = req.body.activityId
    const activity = await Activities.findById(activityId).exec()
    if (!activity) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Activities.findByIdAndRemove(activityId);
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createActivities, getActivities, updateActivities, updateActivitiesByParamId, deleteActivities, getActivityById, createTypeActivities, getTypeActivities, updateTypeActivities, deleteTypeActivities }

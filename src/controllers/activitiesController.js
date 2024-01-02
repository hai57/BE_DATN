import { Activities } from '@/models/activitiesModels.js';
import { Type } from '@/models/typeActivityModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSelectedActivityFields = (activity) => {
  return {
    id: activity._id,
    typeActivities: activity.typeActivities || '',
    name: activity.name || '',
    description: activity.description || '',
    isParent: activity.isParent || '',
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
    return res.status(status.OK).json({ message: message.OK, idType })
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

const getAllActivities = async (req, res) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 10
  try {
    const activities = await Activities.aggregate([
      {
        $lookup: {
          from: 'types',
          localField: 'typeActivities',
          foreignField: '_id',
          as: 'typeActivities'
        }
      },
      {
        $addFields: {
          Type: { $arrayElemAt: ['$typeActivities.name', 0] },
          id: '$_id'

        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          iconCode: 1,
          isParent: 1,
          desciption: 1,
          Type: 1
        },
      },

    ]).skip(parseInt(offset))
      .limit(parseInt(limit));

    if (!activities) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    res.status(status.OK).json({ message: message.OK, items: activities });
  } catch (err) {
    console.log(err)
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
    const newActivities = new Activities(req.body);
    if (!req.body.name || !req.body.description || !req.body.isParent || !req.body.iconCode) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newActivities.save();
    const activity = getSelectedActivityFields(newActivities)
    res.status(status.CREATED).json({ message: message.CREATED, activity: activity });
  } catch (err) {
    console.log(err)
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateActivities = async (req, res) => {
  try {
    const activities = await Activities.findById(req.body.idActivities)
    if (!activities) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.name || !req.body.description || !req.body.isParent || !req.body.iconCode) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    activities.typeActivities = req.body.typeActivities;
    activities.name = req.body.name;
    activities.description = req.body.description;
    activities.iconCode = req.body.iconCode;
    await activities.save()
    const activity = getSelectedActivityFields(activities)
    return res.status(status.OK).json({ message: message.OK, activity: activity })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteActivities = async (req, res) => {
  try {
    const activitiesId = req.body.idActivities
    const activity = await Activities.findById(activitiesId).exec()
    if (!activity) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Activities.findByIdAndRemove(activitiesId);
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createActivities, getAllActivities, updateActivities, deleteActivities, getActivityById, createTypeActivities, getTypeActivities, updateTypeActivities, deleteTypeActivities }

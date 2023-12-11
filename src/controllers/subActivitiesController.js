import { SubActivities } from '@/models/subActivitiesModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSubActivities = async(req, res) =>{
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
          nameActivities : { $arrayElemAt: ['$activities.description', 0] },
          idActivities : { $arrayElemAt: ['$activities._id', 0] },
        }
      },
      {
        $project: {
          name: 1,
          amount: 1,
          nameActivities: 1,
          idActivities: 1
        },
      },

    ])
    .skip(parseInt(offset))
    .limit(parseInt(limit));

    if(!subActivities) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    res.status(status.OK).json({ message: message.OK, subActivities });
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const createSubActivities = async (req, res) => {
  try {

    // Tạo một thời gian mới
    const newSubActivities = new SubActivities({
      activity: req.body.idActivities,
      name: req.body.nameSubActivities,
      amount: req.body.amount
    });

    await newSubActivities.save();
    return res.status(status.CREATED).json(newSubActivities);
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateSubActivities = async(req, res) => {
  try {
    const checkSubactivitiesId = await SubActivities.findById(req.body.subActivitiesID).exec()
    if(!checkSubactivitiesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.amount) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    checkSubactivitiesId.name = req.body.nameSubActivities
    checkSubactivitiesId.amount = req.body.amount
    await checkSubactivitiesId.save()
    res.status(status.OK).json({ message: message.OK, checkSubactivitiesId})
  } catch(err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  }
};

const deleteSubActivities = async(req, res) => {
  try{
    const checkSubActivitiesId = await SubActivities.findById(req.body.subActivitiesID).exec()
    if(!checkSubActivitiesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND})
    }
    await SubActivities.findByIdAndRemove(checkSubActivitiesId)
    res.status(status.OK).json({ message: message.OK });
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  };
};

export { getSubActivities, createSubActivities, updateSubActivities, deleteSubActivities }

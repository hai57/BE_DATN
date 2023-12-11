import { Activities } from '@/models/activitiesModels.js';
import { Type } from '@/models/typeActivityModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

//type
const createTypeActivities = async(req, res) => {
  try{
    const type = new Type(req.body)
    if (!req.body.name) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    await type.save()
    return res.status(status.CREATED).json({ message: message.CREATED })
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const getTypeActivities = async(req, res) => {
  try{
    const type = await Type.find()
    if(type.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    return res.status(status.OK).json({ message: message.OK, type })
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  }
};

const updateTypeActivities = async(req, res) => {
  try{
    const idType = await Type.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    idType.name = req.body.name;
    await idType.save()
    return res.status(status.OK).json({ message: message.OK, idType})
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteTypeActivities = async(req, res) => {
  try {
    const idType = await Type.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await idType.findByIdAndRemove(idType)
    return res.status(status.OK).json({ message: message.OK });
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

//Activities

const getAllActivities = async (req, res)=> {
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
          nameType : { $arrayElemAt: ['$typeActivities.nameType', 0] },
        }
      },
      {
        $project: {
          name: 1,
          isParent: 1,
          time: 1,
          nameType: 1
        },
      },

    ])
    .skip(parseInt(offset))
    .limit(parseInt(limit));

    if(!activities ) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    res.status(status.OK).json({ message: message.OK, activities });
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const createActivities = async(req,res) => {
  try {
    //fix cung truoc thang type
    const defaultType = "650a77bcaed54943b3b370ba"
    const newActivities = new Activities(req.body);
    if(!req.body.name ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    newActivities.typeActivities = defaultType
    await newActivities.save();
    res.status(status.CREATED).json({ message: message.CREATED, newActivities });
  } catch (err) {
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateActivities = async(req, res) => {
  try{
    const activities = await Activities.findById(req.body.idActivities)
    const type = await Type.findById("650a77bcaed54943b3b370ba")
    if(!activities) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    activities.type = type;
    activities.name = req.body.name;
    activities.isParent = req.body.isParent;
    activities.time = req.body.time;
    await activities.save()
    return res.status(status.OK).json({ message: message.OK, activities })
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteActivities = async(req,res) => {
  try {
    const activitiesId = req.body.idActivities
    const activity = await Activities.findById(activitiesId).exec()
    if(!activity) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Activities.findByIdAndRemove(activitiesId);
    return res.status(status.OK).json({ message: message.OK });
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createActivities, getAllActivities, updateActivities, deleteActivities, createTypeActivities, getTypeActivities, updateTypeActivities, deleteTypeActivities }

import mongoose from 'mongoose';

import { SubActivities } from '@/models/subActivitiesModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSelectedSubActivityFields = (subActivity) => {
  return {
    subActivityId: subActivity._id,
    subActivityName: subActivity.subActivityName || '',
    amount: subActivity.amount || '',
    unit: subActivity.unit || '',
    type: subActivity.type || '',
    iconCode: subActivity.iconCode || ''
  };
};

const getSubActivities = async (req, res) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 10
  const typeParam = req.query.type;
  try {
    let subActivities;

    if (typeParam === "1" || typeParam === "2" || typeParam === "3") {
      subActivities = await SubActivities.aggregate([
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
            as: 'types'
          }
        },
        {
          $addFields: {
            typeName: { $arrayElemAt: ['$types.name', 0] },
            type: { $arrayElemAt: ['$types._id', 0] },
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
      subActivities = await SubActivities.aggregate([
        {
          $lookup: {
            from: 'types',
            localField: 'type',
            foreignField: '_id',
            as: 'types'
          }
        },
        {
          $addFields: {
            typeName: { $arrayElemAt: ['$types.name', 0] },
            type: { $arrayElemAt: ['$types._id', 0] },
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
    res.status(status.OK).json({ message: message.OK, items: subActivities });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};


// const getSubActivitiesByIdType = async (req, res) => {
//   const type = req.params.type;
//   const offset = req.query.offset || 0;
//   const limit = req.query.limit || 10;

//   try {
//     const subActivities = await SubActivities.find({
//       type: mongoose.Types.String(type)
//     })
//       .skip(parseInt(offset))
//       .limit(parseInt(limit))

//     if (!subActivities) {
//       return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
//     }
//     const formattedSubActivities = subActivities.map((subActivity) => ({
//       subActivityId: subActivity._id,
//       subActivityName: subActivity.subActivityName || '',
//       amount: subActivity.amount || '',
//       unit: subActivity.unit || '',
//       iconCode: subActivity.iconCode || '',
//       type: subActivity.type || ''
//     }));
//     res.status(status.OK).json({ message: message.OK, items: formattedSubActivities });
//   } catch (err) {
//     console.log(err)
//     return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
//   }
// }
// const getSubActivitiesByIdType = async (req, res) => {
//   const offset = req.query.offset || 0
//   const limit = req.query.limit || 10
//   const type = req.params.type;

//   try {
//     const subActivities = await SubActivities.aggregate([
//       {
//         $match: {
//           type: type
//         }
//       },
//       {
//         $lookup: {
//           from: 'types',
//           localField: 'type',
//           foreignField: '_id',
//           as: 'types'
//         }
//       },
//       {
//         $addFields: {
//           typeName: { $arrayElemAt: ['$types.name', 0] },
//           type: { $arrayElemAt: ['$types._id', 0] },
//           subActivityId: '$_id'
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           subActivityId: 1,
//           subActivityName: 1,
//           amount: 1,
//           iconCode: 1,
//           unit: 1,
//           type: 1,
//           typeName: 1
//         },
//       },

//     ])
//       .skip(parseInt(offset))
//       .limit(parseInt(limit));

//     if (!subActivities) {
//       return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
//     }

//     res.status(status.OK).json({ message: message.OK, items: subActivities });
//   } catch (err) {
//     console.log(err)
//     return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
//   }
// };

const createSubActivities = async (req, res) => {
  try {

    // Tạo một thời gian mới
    const newSubActivities = new SubActivities({
      iconCode: req.body.iconCode,
      subActivityName: req.body.subActivityName,
      amount: req.body.amount,
      unit: req.body.unit
    });
    if (!req.body.subActivityName || !req.body.amount || !req.body.unit) {
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
    checkSubactivitiesId.subActivityName = req.body.subActivityName
    checkSubactivitiesId.amount = req.body.amount
    checkSubactivitiesId.unit = req.body.unit
    checkSubactivitiesId.type = req.body.type
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

export { getSubActivities, createSubActivities, updateSubActivities, deleteSubActivities }

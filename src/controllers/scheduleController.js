import mongoose from 'mongoose';

import { Schedule } from '@/models/scheduleModels.js';
import { ScheduleUser } from '@/models/scheduleUserModels.js';
import { User } from '@/models/userModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';
import { SubActivities } from '@/models/subActivitiesModels.js';

const getSelectedScheduleFields = (schedule) => {
  return {
    id: schedule._id,
    userCreate: schedule.userCreate,
    nameSchedule: schedule.nameSchedule,
    type: schedule.type,
    createAt: schedule.createAt,
    timeLine: schedule.timeLine,
  };
};

const createSchedule = async (req, res) => {
  try {
    const newschedule = new Schedule({
      userCreate: req.userId,
      nameSchedule: req.body.name,
      type: req.body.type,
      createAt: Date.now(),
      timeLine: req.body.timeLine
      // daySchedule: req.body.daySchedule.map(day => {
      //   console.log(day.itemSchedule)

      //   return {
      //     order: req.body.type === 'week' ? order++ : 1,
      //     itemSchedule: day.itemSchedule
      //   };
      // })
    });
    if (!req.body.name) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    await newschedule.save();
    const selectSchedule = getSelectedScheduleFields(newschedule)
    res.status(status.OK).json({ message: message.OK, selectSchedule });
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

// const getSchedule = async (req, res) => {
//   const offset = req.params.offset || 0;
//   const limit = req.params.limit || 10;

//   try {
//     // const schedule = await Schedule.aggregate([
//     //   {
//     //     $lookup: {
//     //       from: 'users',
//     //       localField: 'userCreate',
//     //       foreignField: '_id',
//     //       as: 'userCreate'
//     //     }
//     //   },
//     //   {
//     //     $unwind: {
//     //       path: '$timeLine',
//     //       preserveNullAndEmptyArrays: true
//     //     }
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: 'activities',
//     //       localField: 'timeLine.activity',
//     //       foreignField: '_id',
//     //       as: 'activity'
//     //     }
//     //   },
//     //   {
//     //     $unwind: {
//     //       path: '$activity',
//     //       preserveNullAndEmptyArrays: true
//     //     }
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: 'subActivities',
//     //       localField: 'timeLine.subActivities',
//     //       foreignField: '_id',
//     //       as: 'subActivities'
//     //     }
//     //   },
//     //   {
//     //     $unwind: {
//     //       path: '$subActivities',
//     //       preserveNullAndEmptyArrays: true
//     //     }
//     //   },
//     //   {
//     //     $group: {
//     //       _id: '$_id',
//     //       nameSchedule: { $first: '$nameSchedule' },
//     //       createAt: { $first: '$createAt' },
//     //       type: { $first: '$type' },
//     //       userCreate: { $first: '$userCreate.name' }, // Chỉ lấy trường 'name' từ 'userCreate'
//     //       timeLine: {
//     //         $push: {
//     //           startTime: '$timeLine.startTime',
//     //           endTime: '$timeLine.endTime',
//     //           activity: {
//     //             $mergeObjects: [
//     //               { _id: '$activity._id' },
//     //               { name: '$activity.name' }
//     //             ]
//     //           },
//     //           subActivities: {
//     //             $map: {
//     //               input: '$subActivities',
//     //               as: 'subAct',
//     //               in: {
//     //                 _id: '$$subAct._id',
//     //                 name: '$$subAct.name',
//     //                 amount: '$$subAct.amount', // Thêm các trường khác nếu cần
//     //                 unit: '$$subAct.unit'     // Thêm các trường khác nếu cần
//     //               }
//     //             }
//     //           }
//     //         }
//     //       }
//     //     }
//     //   },
//     //   {
//     //     $addFields: {
//     //       subActivitiesCheck: { $ifNull: ['$subActivities', 'SubActivities is null'] }
//     //     }
//     //   },
//     //   {
//     //     $project: {
//     //       _id: 1,
//     //       nameSchedule: 1,
//     //       createAt: 1,
//     //       type: 1,
//     //       userCreate: 1,
//     //       // timeLine: {
//     //       //   $map: {
//     //       //     input: '$timeLine',
//     //       //     as: 'tl',
//     //       //     in: {
//     //       //       startTime: '$$tl.startTime',
//     //       //       endTime: '$$tl.endTime',
//     //       //       activity: '$$tl.activity',
//     //       //       subActivities: '$$tl.subActivities'
//     //       //     }
//     //       //   }
//     //       // }
//     //       timeLine: 1
//     //     }
//     //   }
//     // ]).skip(parseInt(offset)).limit(parseInt(limit));
//     const schedule = await Schedule.find()
//       .populate('userCreate', 'name')
//       .populate('timeLine.activity', 'name')
//       .populate('timeLine.subActivities', 'name')
//       .skip(parseInt(offset))
//       .limit(parseInt(limit));

//     if (!schedule || schedule.length === 0) {
//       return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
//     }

//     res.status(status.OK).json({ message: message.OK, schedule });
//   } catch (err) {
//     console.error(err);
//     return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
//   }
// };
const getSchedule = async (req, res) => {
  const offset = req.params.offset ? parseInt(req.params.offset) : 0;
  const limit = req.params.limit ? parseInt(req.params.limit) : 10;

  try {
    const schedule = await Schedule.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userCreate',
          foreignField: '_id',
          as: 'userCreate'
        }
      },
      {
        $unwind: {
          path: '$timeLine',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'timeLine.activity',
          foreignField: '_id',
          as: 'activity'
        }
      },
      {
        $unwind: {
          path: '$activity',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'subActivities',
          localField: 'timeLine.subActivities',
          foreignField: '_id',
          as: 'subActivities'
        }
      },
      {
        $unwind: {
          path: '$subActivities',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$timeLine.subActivities',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            nameSchedule: '$nameSchedule',
            createAt: '$createAt',
            type: '$type',
            userCreate: '$userCreate.name',
            timeLine: {
              startTime: '$timeLine.startTime',
              endTime: '$timeLine.endTime',
              activity: {
                _id: '$activity._id',
                name: '$activity.name'
              }
            }
          },
          subActivities: {
            $push: {
              id: '$timeLine.subActivities'
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id._id',
          nameSchedule: { $first: '$_id.nameSchedule' },
          createAt: { $first: '$_id.createAt' },
          type: { $first: '$_id.type' },
          userCreate: { $first: '$_id.userCreate' },
          timeLine: {
            $push: {
              startTime: '$_id.timeLine.startTime',
              endTime: '$_id.timeLine.endTime',
              activity: {
                _id: '$_id.timeLine.activity._id',
                name: '$_id.timeLine.activity.name'
              },
              subActivities: '$subActivities'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          nameSchedule: 1,
          createAt: 1,
          type: 1,
          userCreate: 1,
          timeLine: 1
        }
      },
      {
        $skip: offset
      },
      {
        $limit: limit
      }
    ]);
    console.log('SubActivities:', schedule[0].timeLine[0].subActivities);
    if (!schedule || schedule.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }

    res.status(status.OK).json({ message: message.OK, schedule });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};
const updateSchedule = async (req, res) => {
  try {
    const scheduleId = req.body.scheduleId;
    const schedule = await Schedule.findById(scheduleId).exec();
    if (!schedule) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    } else if (!req.body.name || !req.body.type || !req.body.daySchedule) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    const type = await TypeSchedule.findById(req.body.type);

    schedule.user = req.userId;
    schedule.nameSchedule = req.body.name;
    schedule.typeSchedule = req.body.type;
    schedule.daySchedule = req.body.daySchedule.map(day => {
      return {
        order: day.order,
        itemSchedule: day.itemSchedule
      };
    });

    await schedule.save();
    res.status(status.OK).json({ message: message.OK, schedule });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const scheduleId = req.body.scheduleId
    const schedule = await Schedule.findById(scheduleId).exec()
    if (!schedule) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Schedule.findByIdAndRemove(scheduleId)
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

//ScheduleUser

const createScheduleUser = async (req, res) => {
  try {
    const currentDate = new Date();
    const newScheduleUser = new ScheduleUser({
      user: req.userId,
      schedule: req.body.scheduleId,
      time: req.body.timeId,
      date: currentDate
    })
    if (!req.userId) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if (!req.body.scheduleId) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if (!req.body.time) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newScheduleUser.save();
    res.status(status.CREATED).json(newScheduleUser);
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const getscheduleUser = async (req, res) => {
  try {
    const scheduleUser = await ScheduleUser.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
        $match: { schedule: new mongoose.Types.ObjectId(req.body.schedule) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'schedules',
          localField: 'schedule',
          foreignField: '_id',
          as: 'scheduleDetails'
        }
      },
      {
        $lookup: {
          from: 'times',
          localField: 'time',
          foreignField: '_id',
          as: 'timeDetails'
        }
      },
      {
        $addFields: [
          {
            gmail: { $arrayElemAt: ['$userDetails.gmail', 0] },
            scheduleID: { $arrayElemAt: ['$scheduleDetails._id', 0] },
            timeID: { $arrayElemAt: ['$timeDetails._id', 0] },
            hour: { $arrayElemAt: ['$timeDetails.hour', 0] },
            minutes: { $arrayElemAt: ['$timeDetails.minutes', 0] }
          }
        ]
      },
      {
        $project: {
          date: 1,
          times: 1,
          gmail: 1,
          scheduleID: 1,
          timeID: 1,
          hour: 1,
          minutes: 1,
        },
      },
    ])
    if (!scheduleUser || scheduleUser.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }
    res.status(status.OK).json({ message: message.OK, scheduleUser })
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateScheduleUser = async (req, res) => {
  try {
    const scheduleUserId = await ScheduleUser.findById(req.body.scheduleUserId).exec();
    const existingUser = await User.findById(req.userId).exec();
    const existingTime = await Time.findById(req.body.timeId).exec();
    if (!existingUser) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!scheduleUserId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    } else if (!existingTime) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }

    scheduleUserId.timeId = req.body.timeId;
    scheduleUserId.date = req.body.date;
    await scheduleUserId.save();
    res.status(status.OK).json({ message: message.OK, scheduleUserId })
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteScheduleUser = async (req, res) => {
  try {
    const scheduleUserId = req.body.scheduleUserId
    const scheduleUser = await ScheduleUser.findById(scheduleUserId).exec()
    if (!scheduleUser) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await ScheduleUser.findByIdAndRemove(scheduleUserId)
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createSchedule, getSchedule, updateSchedule, deleteSchedule, createScheduleUser, getscheduleUser, updateScheduleUser, deleteScheduleUser }

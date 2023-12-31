import mongoose from 'mongoose';

import { Schedule } from '@/models/scheduleModels.js';
import { ScheduleUser } from '@/models/scheduleUserModels.js';
import { User } from '@/models/userModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createSchedule = async (req, res) => {
  try {
    // Kiểm tra xem req.body.timeLine có tồn tại không
    if (!req.body.timeLine || !Array.isArray(req.body.timeLine)) {
      return res.status(status.BAD_REQUEST).json({ message: "Invalid timeLine data" });
    }

    const newschedule = new Schedule({
      userCreate: req.userId,
      nameSchedule: req.body.nameSchedule || "",
      type: req.body.type || "",
      timeLine: req.body.timeLine
    });

    if (!req.body.nameSchedule || !req.body.type) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    await newschedule.save();
    res.status(status.OK).json({ message: message.OK, schedule: newschedule });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

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
          from: 'times',
          localField: 'timeLine.startTime',
          foreignField: '_id',
          as: 'startTime'
        }
      },
      {
        $unwind: {
          path: '$startTime',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'subactivities',
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
        $group: {
          _id: {
            _id: '$_id',
            nameSchedule: '$nameSchedule',
            createAt: '$createAt',
            type: '$type',
            userCreate: '$userCreate.name',
            idTimeLine: '$timeLine._id',
            startTimeid: '$startTime._id',
            startTimeHour: '$startTime.hour',
            startTimeMinutes: '$startTime.minutes',
            endTimeHour: '$endTime.hour',
            endTimeMinutes: '$endTime.minutes',
            activityId: '$activity._id',
            activityName: '$activity.name',
          },
          subActivities: {
            $push: {
              _id: '$subActivities._id',
              name: '$subActivities.name'
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
              idTimeLine: '$_id.idTimeLine',
              startTime:
              {
                startTimeid: '$_id.startTimeid',
                startTimeHour: '$_id.startTimeHour',
                startTimeMinutes: '$_id.startTimeMinutes'
              },
              endTime: {
                endTimeHourid: '$_id.endTimeHourid',
                endTimeHour: '$_id.endTimeHour',
                endTimeMinutes: '$_id.endTimeMinutes'
              },
              activity: {
                _id: '$_id.activityId',
                name: '$_id.activityName'
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
          createAt: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createAt"
            }
          },
          type: 1,
          userCreate: 1,
          timeLine: 1
        }
      },
    ]).skip(parseInt(offset))
      .limit(parseInt(limit));
    console.log(schedule[2].timeLine[0])
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
    } else if (!req.body.name || !req.body.type || !req.body.timeLine) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    schedule.user = req.userId;
    schedule.nameSchedule = req.body.name;
    schedule.type = req.body.type;
    schedule.timeLine = req.body.timeLine

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

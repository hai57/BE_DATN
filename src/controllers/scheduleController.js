import mongoose from 'mongoose';

import { Schedule } from '@/models/scheduleModels.js';
import { ScheduleUser } from '@/models/scheduleUserModels.js';
import { User } from '@/models/userModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getSelectedSCheduleFields = (schedule) => {
  return {
    id: schedule._id,
    nameSchedule: schedule.nameSchedule || "",
    userCreate: schedule.userCreate || "",
    type: schedule.type || "",
    timeLine: schedule.timeLine.map((timeLineItem) => {
      return {
        id: timeLineItem._id,
        itemActivity: timeLineItem.itemActivity.map((activityItem) => {
          return {
            id: activityItem._id,
            activity: activityItem.activity || "",
            is_parent: activityItem.is_parent || false,
            startTime: activityItem.startTime || 0,
            endTime: activityItem.endTime || 0,
            itemSubActivity: activityItem.itemSubActivity.map((subActivityItem) => {
              return {
                id: subActivityItem._id,
                subActivities: subActivityItem.subActivities || ""
              };
            })
          };
        })
      };
    })
  };
};

const createSchedule = async (req, res) => {
  try {
    if (
      !req.body.nameSchedule ||
      !req.body.type ||
      !req.body.timeLine ||
      !Array.isArray(req.body.timeLine) ||
      !req.body.timeLine.every(timeLineItem =>
        timeLineItem &&
        Array.isArray(timeLineItem.itemActivity) &&
        timeLineItem.itemActivity.every(activityItem =>
          activityItem &&
          activityItem.activity &&
          activityItem.startTime &&
          activityItem.endTime &&
          activityItem.is_parent != undefined
        )
      )
    ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
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
    const selectedSchedule = getSelectedSCheduleFields(newschedule)
    res.status(status.OK).json({ message: message.OK, schedule: selectedSchedule });
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
        $unwind: {
          path: '$timeLine.itemActivity',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'timeLine.itemActivity.activity',
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
          localField: 'timeLine.itemActivity.startTime',
          foreignField: 'idTimes',
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
          from: 'times',
          localField: 'timeLine.itemActivity.endTime',
          foreignField: 'idTimes',
          as: 'endTime'
        }
      },
      {
        $unwind: {
          path: '$endTime',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $lookup: {
          from: 'subactivities',
          localField: 'timeLine.itemActivity.itemSubActivity.subActivities',
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
            startTimeHour: '$startTime.hour',
            startTimeMinutes: '$startTime.minutes',
            endTimeHour: '$endTime.hour',
            endTimeMinutes: '$endTime.minutes',
            activityId: '$activity._id',
            activityName: '$activity.name',
          },
          subActivities: {
            $push: {
              id: '$subActivities._id',
              name: '$subActivities.name'
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id._id',
          nameSchedule: { $first: '$_id.nameSchedule' },
          type: { $first: '$_id.type' },
          userCreate: { $first: '$_id.userCreate' },
          timeLine: {
            $push: {
              idTimeLine: '$_id.idTimeLine',
              startTime:
              {
                hour: '$_id.startTimeHour',
                minutes: '$_id.startTimeMinutes'
              },
              endTime: {
                hour: '$_id.endTimeHour',
                minutes: '$_id.endTimeMinutes'
              },
              activity: {
                id: '$_id.activityId',
                name: '$_id.activityName'
              },
              subActivities: '$subActivities'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          nameSchedule: 1,
          type: 1,
          userCreate: 1,
          timeLine: 1
        }
      },
    ]).skip(parseInt(offset))
      .limit(parseInt(limit));
    console.log(schedule[0].timeLine[0])
    if (!schedule || schedule.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }

    res.status(status.OK).json({ message: message.OK, items: schedule });
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
    } else if (!req.body.nameSchedule || !req.body.type || !req.body.timeLine) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD, missingFields });
    }

    schedule.user = req.userId;
    schedule.nameSchedule = req.body.nameSchedule;
    schedule.type = req.body.type;
    schedule.timeLine = req.body.timeLine

    await schedule.save();
    const selectedSchedule = getSelectedSCheduleFields(schedule)
    res.status(status.OK).json({ message: message.OK, schedule: selectedSchedule });
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
    res.status(status.OK).json({ message: message.OK, items: scheduleUser })
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

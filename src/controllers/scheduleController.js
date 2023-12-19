import mongoose from 'mongoose';

import { Schedule } from '@/models/scheduleModels.js';
import { ScheduleUser } from '@/models/scheduleUserModels.js';
import { User } from '@/models/userModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';
import { TypeSchedule } from '@/models/typeSchedule.js';

const createSchedule = async (req, res) => {
  try {

    const type = await TypeSchedule.findById(req.body.type);

    let order = 0;

    const newschedule = new Schedule({
      user: req.userId,
      nameSchedule: req.body.name,
      typeSchedule: req.body.type,
      daySchedule: req.body.daySchedule.map(day => {
        return {
          order: type.name === 'week' ? order++ : 1,
          itemSchedule: day.itemSchedule
        };
      })
    });
    if (!req.body.name) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    await newschedule.save();
    res.status(status.OK).json({ message: message.OK, newschedule });
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.aggregate([
      // {
      //   $lookup: {
      //     from: 'items',
      //     localField: 'daySchedule.itemSchedule',
      //     foreignField: '_id',
      //     as: 'items'
      //   }
      // },
      // {
      //   $lookup: {
      //     from: 'typeSchedule',
      //     localField: 'typeSchedule',
      //     foreignField: '_id',
      //     as: 'typeSchedule'
      //   }
      // },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ['$user.name', 0] },
        }
      },
      {
        $project: {
          nameSchedule: 1,
          userName: 1,
          typeSchedule: 1,
          items: 1
        }
      }
    ]);

    if (!schedule || schedule.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    res.status(status.OK).json({ message: message.OK, schedule });
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
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

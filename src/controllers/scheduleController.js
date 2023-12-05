import mongoose from 'mongoose';

import { Schedule } from '@/models/scheduleModels.js';
import { ScheduleUser } from '@/models/scheduleUserModels.js';
import { Time } from '@/models/timeModels.js';
import { User } from '@/models/userModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createSchedule = async (req, res) => {
  try {
    const newschedule = new Schedule(req.body);
    if (!req.body.time) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.activity ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.nameSchedule ) {
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
      {
        $lookup: {
          from: 'times',
          localField: 'time',
          foreignField: '_id',
          as: 'times'
        }
      },
      {
         $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activities',
        },
      },
      {
        $addFields: {
          nameType: { $arrayElemAt: ['$activities.name', 0] },
          hour: { $addFields: ['$times.hour',0] },
          minutes: { $addFields: ['$times.minutes', 0] }
        }
      },
      {
        $project: {
          nameSchedule: 1,
          nameType: 1,
          hour: 1,
          minutes: 1
        }
      }
    ])
    if(!schedule || schedule.length === 0 ) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    res.status(status.OK).json({ message: message.OK, schedule });
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateSchedule = async(req, res) => {
  try {
    const scheduleId = req.body.scheduleId;
    const schedule = await Schedule.findById(scheduleId).exec();
    const timeId = req.body.time;
    const existingTime = await Time.findById(timeId).exec();
    if(!schedule) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.time || !req.body.activity || !req.body.nameSchedule) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if (!existingTime) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }
    schedule.time = timeId;
    schedule.activity = req.body.activity;
    schedule.nameSchedule = req.body.nameSchedule;
    await schedule.save();
    res.status(status.OK).json({ message: message.OK, schedule})
  } catch(err){
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  }
};

const deleteSchedule = async(req, res) => {
  try {
    const scheduleId = await Schedule.findById(req.body.scheduleId).exec()
    if(!scheduleId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await scheduleId.findByIdAndRemove(scheduleId)
    return res.status(status.OK).json({ message: message.OK });
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

//ScheduleUser

const createScheduleUser = async(req, res)=> {
  try{
    const currentDate = new Date();
    const newScheduleUser = new ScheduleUser({
      user : req.userId,
      schedule: req.body.scheduleId,
      time: req.body.timeId,
      date: currentDate
    })
    if (!req.userId) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.scheduleId ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.time ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newScheduleUser.save();
    res.status(status.CREATED).json(newScheduleUser);
  } catch(err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const getscheduleUser = async(req, res) => {
  try{
    const scheduleUser = await ScheduleUser.aggregate([
      {
          $match: { user: new mongoose.Types.ObjectId(req.userId) },
          $match: { schedule: new mongoose.Types.ObjectId(req.body.schedule)}
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
            scheduleID: { $arrayElemAt: ['$scheduleDetails._id',0] },
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
  } catch(err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateScheduleUser = async(req, res) => {
  try {
    const scheduleUserId = await ScheduleUser.findById(req.body.scheduleUserId).exec();
    const existingUser = await User.findById(req.userId).exec();
    const existingTime = await Time.findById(req.body.timeId).exec();
    if(!existingUser) {
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
  } catch(err){
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteScheduleUser = async(req, res) => {
  try {
    const scheduleUserId = await Schedule.findById(req.body.scheduleUserId).exec()
    if(!scheduleUserId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await scheduleUserId.deleteOne()
    return res.status(status.NO_CONTENT).send()
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export  { createSchedule, getSchedule,updateSchedule, deleteSchedule ,createScheduleUser, getscheduleUser, updateScheduleUser,deleteScheduleUser }

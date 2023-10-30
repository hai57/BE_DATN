import mongoose from 'mongoose';

import { Schedule } from '../models/scheduleModels.js';
import { ScheduleUser } from '../models/scheduleUserModels.js';
import { Time } from '../models/timeModels.js';
import { User } from '../models/userModels.js';
import { status } from '../constant/status.js';

const createSchedule = async (req, res) => {
  try {
    const newschedule = new Schedule(req.body);
    if (!req.body.time) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing time field.' });
    } else if(!req.body.task ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing task field.' });
    } else if(!req.body.nameSchedule ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing nameSchedule field.' });
    }

    await newschedule.save();
    res.status(status.OK).json(newschedule);
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({message: 'Error create schedule'})
  }
};

const getSchedule = async (req,res) => {
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
          from: 'tasks',
          localField: 'task',
          foreignField: '_id',
          as: 'tasks',
        },
      },
      {
        $project: {
          nameSchedule: 1,
         'tasks.nameTask':1,
          times: {
            hour: '$times.hour',
            minutes: '$times.minutes'
          }
        }
      }
    ])
    if(schedule.length === 0 || !schedule[0].times.length ||!schedule[0].tasks.length) {
      return res.status(status.NOT_FOUND).json({message: 'Không tìm thấy dữ liệu lịch trình.'})
    }
    res.status(status.OK).json(schedule);
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({message: 'Error get Schedule'})
  }
};

const updateSchedule = async(req,res) => {
  try {
    const scheduleId = req.body.scheduleId;
    const schedule = await Schedule.findById(scheduleId).exec();
    const timeId = req.body.time;
    const existingTime = await Time.findById(timeId).exec();
    if(!schedule) {
      return res.status(status.NOT_FOUND).json({message:'Schedule not found'})
    } else if (!req.body.time || !req.body.task || !req.body.nameSchedule) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing required fields' });
    } else if (!existingTime) {
      return res.status(status.BAD_REQUEST).json({ message: 'Time does not exist' });
    }
    schedule.time = timeId;
    schedule.task = req.body.task;
    schedule.nameSchedule = req.body.nameSchedule;
    await schedule.save();
    res.status(status.OK).json({message: 'Update success', schedule})
  } catch(err){
    console.error(err)
    return res.status(status.ERROR).json({message: 'Server error at update schedule'})
  }
};

const deleteSchedule = async(req,res) => {
  try {
    const scheduleId = await Schedule.findById(req.body.scheduleId).exec()
    if(!scheduleId) {
      return res.status(status.NOT_FOUND).json({message:'Schedule not found'})
    }
    await scheduleId.deleteOne()
    return res.status(204).send()
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at delete schedule'})
  }
};

//ScheduleUser

const createScheduleUser = async(req,res)=> {
  try{
    const currentDate = new Date();
    const newScheduleUser = new ScheduleUser({
      user : req.userId,
      schedule: req.body.scheduleId,
      time: req.body.timeId,
      date: currentDate
    })
    if (!req.userId) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing user field.' });
    } else if(!req.body.scheduleId ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing schedule field.' });
    } else if(!req.body.time ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing time field.' });
    }
    await newScheduleUser.save();
    res.status(status.CREATED).json(newScheduleUser);
  } catch(err) {
    console.error(err)
    return res.status(status.ERROR).json({message: 'Error create schedule user'})
  }
};

const getscheduleUser = async(req,res) => {
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
        $project: {
          date: 1,
          times: 1,
          'userDetails.gmail': 1,
          'scheduleDetails._id': 1,
          'timeDetails._id': 1,
          'timeDetails.hour': 1,
          'timeDetails.minutes': 1,
        },
      },
    ])
    if (!scheduleUser || scheduleUser.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: 'Schedule user not found' });
    }
    res.status(status.OK).json(scheduleUser)
  } catch(err) {
    console.error(err)
    return res.status(status.ERROR).json({message: 'Error get schedule user'})
  }
};

const updateScheduleUser = async(req,res) => {
  try {
    const scheduleUserId = await ScheduleUser.findById(req.body.scheduleUserId).exec();
    const existingUser = await User.findById(req.userId).exec();
    const existingTime = await Time.findById(req.body.timeId).exec();
    if(!existingUser) {
      return res.status(status.NOT_FOUND).json({message:'User not found'})
    } else if (!scheduleUserId) {
      return res.status(status.BAD_REQUEST).json({ message: 'Schedule user does not exist' });
    } else if (!existingTime) {
      return res.status(status.BAD_REQUEST).json({ message: 'Time does not exist' });
    }

    scheduleUserId.timeId = req.body.timeId;
    scheduleUserId.date = req.body.date;
    await scheduleUserId.save();
    res.status(status.OK).json({message: 'Update success', scheduleUserId})
  } catch(err){
    console.error(err)
    return res.status(status.ERROR).json({message: 'Server error at update schedule user'})
  }
};

const deleteScheduleUser = async(req,res) => {
  try {
    const scheduleUserId = await Schedule.findById(req.body.scheduleUserId).exec()
    if(!scheduleUserId) {
      return res.status(status.NOT_FOUND).json({message:'schedule user not found'})
    }
    await scheduleUserId.deleteOne()
    return res.status(204).send()
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at delete schedule user'})
  }
};

export  { createSchedule, getSchedule,updateSchedule, deleteSchedule ,createScheduleUser, getscheduleUser, updateScheduleUser,deleteScheduleUser }

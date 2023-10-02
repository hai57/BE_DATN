
const {Schedule} = require('../models/scheduleModels')
const {ScheduleUser} = require('../models/scheduleUserModels')
const mongoose = require('mongoose')

const createSchedule = async (req, res) => {
  try {
    const newschedule = new Schedule(req.body);
    await newschedule.save();
    res.status(200).json(newschedule);
  } catch (err) {
    console.error(err)
    return res.status(500).json({message: 'Error create schedule'})
  }
}
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
         day : 1,
         content: 1,
         meal: 1,
         exercise: 1,
         'tasks.nameTask':1,
         'times.hour':1,
         'times.minutes':1,
        }
      }
    ])
    res.status(200).json(schedule);
  } catch (err) {
    return res.status(500).json({message: 'Error get Schedule'})
  }
}
const updateSchedule = async(req,res) => {
  try {
    const scheduleId = req.body.scheduleId;
    console.log(scheduleId)
    const schedule = await Schedule.findById(scheduleId).exec();
    if(!schedule) {
      return res.status(404).json({message:'Schedule not found'})
    }
    schedule.time = req.body.time;
    schedule.task = req.body.task;
    schedule.nameSchedule = req.body.nameSchedule;
    await schedule.save();
    res.status(200).json({message: 'Update success'})
  } catch(err){
    console.error(err)
    return res.status(500).json({message: 'Server error at update user'})
  }
};


//ScheduleUser

const createScheduleUser = async(req,res)=> {
  try{
    const currentDate = new Date();
    const userId = req.userId;
    const scheduleId = req.body.schedule;
    const newScheduleUser = new ScheduleUser({
      user : userId,
      schedule: scheduleId,
      time: req.body.timeId,
      date: currentDate
    })

    await newScheduleUser.save();
    res.status(201).json(newScheduleUser);
  } catch(err) {
    console.error(err)
    return res.status(500).json({message: 'Error create schedule user'})
  }
}
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
      return res.status(404).json({ message: 'Schedule user not found' });
    }
    res.status(200).json(scheduleUser)
  } catch(err) {
    console.error(err)
    return res.status(500).json({message: 'Error get schedule user'})
  }
}

module.exports = {createSchedule, getSchedule,updateSchedule ,createScheduleUser, getscheduleUser}

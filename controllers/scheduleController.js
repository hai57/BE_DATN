
const {Schedule} = require('../models/scheduleModels')
const {ScheduleUser} = require('../models/scheduleUserModels')
const mongoose = require('mongoose')

const createSchedule = async (req, res) => {
  try {
    const newschedule = new Schedule({
      user: req.userId,
      day: req.body.day,
      content: req.body.content,
      meal: req.body.meal,
      exercises: req.body.exercises
    });
    await newschedule.save();
    res.status(200).json(newschedule);
  } catch (err) {
    return res.status(500).json({message: 'Error create schedule'})
  }
}
const getAllSchedule = async (req,res) => {
  try {
    const schedule = await Schedule.aggregate([
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
          from: 'tasks',
          localField: '_id',
          foreignField: 'schedule',
          as: 'tasks',
        },
      },
      {
        $project: {
         day : 1,
         content: 1,
         meal: 1,
         exercise: 1,
         'userDetails.gmail':1,
         'tasks.nameTask':1,
        }
      }
    ])
    res.status(200).json(schedule);
  } catch (err) {
    return res.status(500).json({message: 'Error get all schedule'})
  }
}
const getSchedule = async (req,res) => {
  try {
    const schedule = await Schedule.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.scheduleId) },
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
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
          from: 'tasks',
          localField: '_id',
          foreignField: 'schedule',
          as: 'tasks',
        },
      },
      {
        $project: {
         day : 1,
         content: 1,
         meal: 1,
         exercise: 1,
         'userDetails.gmail':1,
         'tasks.nameTask':1,
        }
      }
    ])
    res.status(200).json(schedule);
  } catch (err) {
    return res.status(500).json({message: 'Error get Schedule'})
  }
}
//ScheduleUser

const createScheduleUser = async(req,res)=> {
  try{
    const currentDate = new Date();
    const scheduleUser = new ScheduleUser({
      user : req.userId,
      schedule: req.body.schedule,
      date : currentDate,
      times : req.body.times,
    })
    await scheduleUser.save()
    res.status(200).json(scheduleUser)
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
        $project: {
          date: 1,
          times: 1,
          'userDetails.gmail': 1,
          'scheduleDetails._id': 1,
        },
      },
    ])
    res.status(200).json(scheduleUser)
  } catch(err) {
    console.error(err)
    return res.status(500).json({message: 'Error get schedule user'})
  }
}


module.exports = {createSchedule, getSchedule,getAllSchedule,createScheduleUser, getscheduleUser}

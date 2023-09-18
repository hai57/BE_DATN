
const {Schedule} = require('../models/scheduleModels')
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
  } catch (error) {
    return res.status(500).json({ msg: error.message });
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
  } catch (error) {
    return res.status(500).json({ msg: error.message });
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
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
module.exports = {createSchedule, getSchedule,getAllSchedule}

const mongoose = require('mongoose');
const {Tasks} = require('../models/tasksModels')

const getAllTasks = async (req, res)=> {
  try {
    const tasks = await Tasks.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
        $match: { schedule: new mongoose.Types.ObjectId(req.schedule._id) }
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
          nameTask: 1,
          time: 1,
          'userDetails.gmail': 1, // bao gom gmail trong userDetails
          'scheduleDetails.content': 1
        },
      },

    ]);

    res.status(200).json(tasks);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
const getTask = async(req,res) => {
  try{
    const task = await Tasks.aggregate([
      {
        $match: { task: new mongoose.Types.ObjectId(req.body.taskId) },
        $match: { user: new mongoose.Types.ObjectId(req.userId) },
        $match: { schedule: new mongoose.Types.ObjectId(req.schedule._id) }
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
          nameTask: 1,
          time: 1,
          'userDetails.gmail': 1, // bao gom gmail trong userDetails
          'scheduleDetails.content': 1
        },
      },
    ])
    res.status(200).json(task);
  } catch(err) {
      console.error(err)
      return res.status(500).json({ msg: err.message });
  }
}
const createTasks = async(req,res) => {
  try {
    const newTask = new Tasks({
      user: req.userId,
      schedule: req.schedule._id,
      nameTask: req.body.nameTask,
      time: req.body.time,
    });

    await newTask.save();
    console.log("created")
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
}

module.exports = {getAllTasks, createTasks,getTask}

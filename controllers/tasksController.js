const {Tasks} = require('../models/tasksModels')
const {TypeTask} = require('../models/typeTaskModels')

const createTypeTask = async(req,res) => {
  try{
    const typeTask = new TypeTask(req.body)
    await typeTask.save()
    return res.status(200).json({message: ' Success'})
  } catch(err){
    return res.status(500).json({message: 'Error creating type task'})
  }
};
const getTypeTask = async(req,res) => {
  try{
    const typeTask = await TypeTask.find()
    return res.status(200).json(typeTask)
  } catch(err){
    return res.status(500).json({message: 'Error creating type task'})
  }
};
const getAllTasks = async (req, res)=> {
  try {
    const tasks = await Tasks.aggregate([
      {
        $lookup: {
          from: 'types',
          localField: 'typeTask',
          foreignField: '_id',
          as: 'typeTaskDetails'
        }
      },
      {
        $project: {
          nameTask: 1,
          taskContent: 1,
          'typeTaskDetails.nameType': 1,
        },
      },

    ]);

    res.status(200).json(tasks);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
const createTasks = async(req,res) => {
  try {
    const newTask = new Tasks(req.body);

    await newTask.save();
    console.log("created")
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
}

module.exports = {getAllTasks, createTasks,createTypeTask, getTypeTask}

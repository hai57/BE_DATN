const {Tasks} = require('@/models/tasksModels')
const {TypeTask} = require('@/models/typeTaskModels')

//type task
const createTypeTask = async(req,res) => {
  try{
    const typeTask = new TypeTask(req.body)
    if (!req.body.nameType) {
      return res.status(400).json({ message: 'Thiếu trường nameType.' });
    }

    await typeTask.save()
    return res.status(201).json({message: ' Success'})
  } catch(err){
    return res.status(500).json({message: 'Error creating type task'})
  }
};
const getTypeTask = async(req,res) => {
  try{
    const typeTask = await TypeTask.find()
    if(typeTask.length === 0) {
      return res.status(404).json({message: 'Không tìm thấy dữ liệu '})
    }
    return res.status(200).json(typeTask)
  } catch(err){
    console.error(err);
    return res.status(500).json({message: 'Error creating type task'})
  }
};
const updateTypeTask = async(req,res) => {
  try{
    const idType = await TypeTask.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(404).json({message: 'Type task not found'})
    }
    idType.nameType = req.body.nameType;
    await idType.save()
    return res.status(200).json({message: 'update success', idType})
  } catch(err) {
    console.error(err);
    return res.status(500).json({message: 'Error at update type task'})
  }
};
const deleteTypeTask = async(req,res) => {
  try {
    const idType = await TypeTask.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(404).json({message:'Type task not found'})
    }
    await idType.deleteOne()
    return res.status(204).send()
  } catch(err){
    console.error(err);
    return res.status(500).json({message: 'Error at delete Type task'})
  }
}

//Task

const getAllTasks = async (req, res)=> {
  try {
    const tasks = await Tasks.aggregate([
      {
        $lookup: {
          from: 'types',
          localField: 'typeTask',
          foreignField: '_id',
          as: 'typeTask'
        }
      },
      {
        $project: {
          nameTask: 1,
          taskContent: 1,
          'typeTask.nameType': 1,
        },
      },

    ]);
    if(tasks.length === 0 || !tasks[0].typeTask.length) {
      return res.status(404).json({message: 'Không tìm thấy dữ liệu '})
    }

    res.status(200).json(tasks);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
const createTasks = async(req,res) => {
  try {
    const newTask = new Tasks(req.body);
    const typeTask = await TypeTask.findById(req.body.typeTask);
    if (!typeTask) {
      return res.status(404).json({ message: "Type task not found" });
    } else if (!req.body.nameTask) {
      return res.status(400).json({ message: 'Missing nameTask field.' });
    } else if(!req.body.taskContent ) {
      return res.status(400).json({ message: 'Missing taskContent field.' });
    }
    await newTask.save();
    console.log("created")
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
}
const updateTask = async(req,res) => {
  try{
    const idTask = await Tasks.findById(req.body.idTask).exec()
    if(!idTask) {
      return res.status(404).json({message: 'Task not found'})
    }
    idTask.typeTask = req.body.typeTask;
    idTask.nameTask = req.body.nameTask;
    idTask.taskContent = req.body.taskContent;
    await idTask.save()
    return res.status(200).json({message: 'update success', idTask})
  } catch(err) {
    console.error(err);
    return res.status(500).json({message: 'Error at update task'})
  }
};
const deleteTask = async(req,res) => {
  try {
    const idTask = await TypeTask.findById(req.body.idTask).exec()
    if(!idTask) {
      return res.status(404).json({message:'Task not found'})
    }
    await idTask.deleteOne()
    return res.status(204).send()
  } catch(err){
    console.error(err);
    return res.status(500).json({message: 'Error at delete task'})
  }
}


module.exports = {createTasks,getAllTasks,updateTask,deleteTask, createTypeTask, getTypeTask,updateTypeTask,deleteTypeTask}

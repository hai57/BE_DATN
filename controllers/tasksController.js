import { Tasks } from '../models/tasksModels.js';
import { TypeTask } from '../models/typeTaskModels.js';
import { status } from '../constant/status.js';

//type task
const createTypeTask = async(req,res) => {
  try{
    const typeTask = new TypeTask(req.body)
    if (!req.body.nameType) {
      return res.status(status.BAD_REQUEST).json({ message: 'Thiếu trường nameType.' });
    }

    await typeTask.save()
    return res.status(status.CREATED).json({message: ' Success'})
  } catch(err){
    return res.status(status.ERROR).json({message: 'Error creating type task'})
  }
};

const getTypeTask = async(req,res) => {
  try{
    const typeTask = await TypeTask.find()
    if(typeTask.length === 0) {
      return res.status(status.NOT_FOUND).json({message: 'Không tìm thấy dữ liệu '})
    }
    return res.status(status.OK).json(typeTask)
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error creating type task'})
  }
};

const updateTypeTask = async(req,res) => {
  try{
    const idType = await TypeTask.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(status.NOT_FOUND).json({message: 'Type task not found'})
    }
    idType.nameType = req.body.nameType;
    await idType.save()
    return res.status(status.OK).json({message: 'update success', idType})
  } catch(err) {
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at update type task'})
  }
};

const deleteTypeTask = async(req,res) => {
  try {
    const idType = await TypeTask.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(status.NOT_FOUND).json({message:'Type task not found'})
    }
    await idType.deleteOne()
    return res.status(204).send()
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at delete Type task'})
  }
};

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
        $addFields: {
          nameType : { $arrayElemAt: ['$typeTask.nameType', 0] }
        }
      },
      {
        $project: {
          nameTask: 1,
          taskContent: 1,
          nameType: 1,
        },
      },

    ]);
    if(!tasks || tasks.length === 0 ) {
      return res.status(status.NOT_FOUND).json({message: 'Không tìm thấy dữ liệu '})
    }

    res.status(status.OK).json(tasks);
  } catch(err) {
    console.error(err);
    return res.status(status.ERROR).json({ msg: err.message });
  }
};

const createTasks = async(req,res) => {
  try {
    const newTask = new Tasks(req.body);
    const typeTask = await TypeTask.findById(req.body.typeTask);
    if (!typeTask) {
      return res.status(status.NOT_FOUND).json({ message: 'Type task not found' });
    } else if (!req.body.nameTask) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing nameTask field.' });
    } else if(!req.body.taskContent ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing taskContent field.' });
    }
    await newTask.save();
    console.log('created')
    res.status(status.CREATED).json(newTask);
  } catch (error) {
    res.status(status.ERROR).json({ message: 'Error creating task' });
  }
};

const updateTask = async(req,res) => {
  try{
    const idTask = await Tasks.findById(req.body.idTask).exec()
    if(!idTask) {
      return res.status(status.NOT_FOUND).json({message: 'Task not found'})
    }
    idTask.typeTask = req.body.typeTask;
    idTask.nameTask = req.body.nameTask;
    idTask.taskContent = req.body.taskContent;
    await idTask.save()
    return res.status(status.OK).json({message: 'update success', idTask})
  } catch(err) {
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at update task'})
  }
};

const deleteTask = async(req,res) => {
  try {
    const idTask = await TypeTask.findById(req.body.idTask).exec()
    if(!idTask) {
      return res.status(status.NOT_FOUND).json({message:'Task not found'})
    }
    await idTask.deleteOne()
    return res.status(204).send()
  } catch(err){
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at delete task'})
  }
};

export { createTasks,getAllTasks,updateTask,deleteTask, createTypeTask, getTypeTask,updateTypeTask,deleteTypeTask }

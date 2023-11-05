import { Tasks } from '@/models/tasksModels.js';
import { TypeTask } from '@/models/typeTaskModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

//type task
const createTypeTask = async(req,res) => {
  try{
    const typeTask = new TypeTask(req.body)
    if (!req.body.nameType) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    await typeTask.save()
    return res.status(status.CREATED).json({ message: message.CREATED })
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const getTypeTask = async(req,res) => {
  try{
    const typeTask = await TypeTask.find()
    if(typeTask.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    return res.status(status.OK).json({ message: message.OK, typeTask })
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  }
};

const updateTypeTask = async(req,res) => {
  try{
    const idType = await TypeTask.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    idType.nameType = req.body.nameType;
    await idType.save()
    return res.status(status.OK).json({ message: message.OK, idType})
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteTypeTask = async(req,res) => {
  try {
    const idType = await TypeTask.findById(req.body.idType).exec()
    if(!idType) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await idType.deleteOne()
    return res.status(204).send()
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
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
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    res.status(status.OK).json({ message: message.OK, tasks });
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const createTasks = async(req,res) => {
  try {
    const newTask = new Tasks(req.body);
    const typeTask = await TypeTask.findById(req.body.typeTask);
    if (!typeTask) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    } else if (!req.body.nameTask) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.taskContent ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    await newTask.save();
    res.status(status.CREATED).json({ message: message.CREATED, newTask });
  } catch (err) {
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateTask = async(req,res) => {
  try{
    const idTask = await Tasks.findById(req.body.idTask).exec()
    if(!idTask) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    idTask.typeTask = req.body.typeTask;
    idTask.nameTask = req.body.nameTask;
    idTask.taskContent = req.body.taskContent;
    await idTask.save()
    return res.status(status.OK).json({ message: message.OK, idTask})
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteTask = async(req,res) => {
  try {
    const idTask = await TypeTask.findById(req.body.idTask).exec()
    if(!idTask) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await idTask.deleteOne()
    return res.status(204).send()
  } catch(err){
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createTasks,getAllTasks,updateTask,deleteTask, createTypeTask, getTypeTask,updateTypeTask,deleteTypeTask }

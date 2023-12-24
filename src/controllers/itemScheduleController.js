import mongoose from 'mongoose';

import { Activities } from '@/models/activitiesModels.js'
import { Item } from '@/models/itemScheduleModels.js';
import { TypeSchedule } from '@/models/typeSchedule.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

//type Schedule
const createTypeSchedule = async (req, res) => {
  try {
    const typeSchedule = new TypeSchedule(req.body)
    await typeSchedule.save()
    return res.status(status.CREATED).json({ message: message.CREATED, typeSchedule })
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR })
  }
}

const getTypeSchedule = async (req, res) => {
  try {
    const typeSchedule = await TypeSchedule.find().select('-__v');
    return res.status(status.OK).json({ message: message.OK, typeSchedule })
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR })
  }
};

const updateTypeSchedule = async (req, res) => {
  try {
    const typeScheduleId = req.body.typeId;
    const type = await TypeSchedule.findById(typeScheduleId);

    type.name = req.body.name;
    await type.save();
    res.status(status.OK).json({ message: message.OK, type })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteTypeSchedule = async (req, res) => {
  try {
    const typeScheduleId = req.body.typeId;
    const type = await TypeSchedule.findById(typeScheduleId).exec()
    if (!type) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await TypeSchedule.findByIdAndRemove(typeScheduleId)
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};


//Item Schedule
const createItemSchedule = async (req, res) => {
  try {
    const activities = await Activities.findById(req.body.activitiesId);

    if (!activities) {
      return res.status(status.NOT_FOUND).json(message.NOT_FOUND);
    }
    const newItems = new Item(req.body);

    newItems.activity = activities;
    await newItems.save();

    return res.status(status.CREATED).json({ message: message.CREATED, newItems });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json(message.ERROR);
  }
};

const getAllItem = async (req, res) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 10
  try {
    const items = await Item.aggregate([
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activities'
        }
      },
      {
        $addFields: {
          idActivity: { $arrayElemAt: ['$activities._id', 0] },
          nameActivity: { $arrayElemAt: ['$activities.name', 0] },
        }
      },
      {
        $project: {
          order: 1,
          startTime: 1,
          endTime: 1,
          idActivity: 1,
          nameActivity: 1
        },
      },

    ]).skip(parseInt(offset))
      .limit(parseInt(limit));

    if (!items) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    res.status(status.OK).json({ message: message.OK, items });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const updateItemSchedule = async (req, res) => {
  try {
    const itemScheduleId = req.body.itemId;
    const item = await Item.findById(itemScheduleId);
    if (!item) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.startTime || !req.body.endTime) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }

    item.startTime = req.body.startTime;
    item.endTime = req.body.endTime;
    item.activity = req.body.activitiesId;
    await item.save();
    res.status(status.OK).json({ message: message.OK, item })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteItemSchedule = async (req, res) => {
  try {
    const itemScheduleId = req.body.itemId;
    const item = await Item.findById(itemScheduleId).exec()
    if (!item) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Item.findByIdAndRemove(itemScheduleId)
    return res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};


export { createItemSchedule, getAllItem, updateItemSchedule, deleteItemSchedule, createTypeSchedule, getTypeSchedule, updateTypeSchedule, deleteTypeSchedule }

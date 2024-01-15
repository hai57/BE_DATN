import { Statis } from '@/models/statisModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createStatis = async (req, res) => {
  try {
    const statis = new Statis({
      user: req.userId,
      caloriesNeed: req.body.caloriesNeed,
      caloriesSpend: req.body.caloriesSpend,
      isIncrease: req.body.isIncrease
    });

    await statis.save();
    res.status(status.OK).json({ message: message.OK, statis: statis });

  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getStatis = async (req, res) => {
  try {
    const statis = await Statis.aggregate([
      {
        $addFields: {
          id: '$_id'
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          caloriesNeed: 1,
          caloriesSpend: 1,
          isIncrease: 1,
        },
      },

    ])

    return res.status(status.OK).json({ message: message.OK, items: statis })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateStatis = async (req, res) => {
  try {
    const idStatis = await Statis.findById(req.body.idStatis).exec()
    if (!idStatis) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }

    await idStatis.save()
    return res.status(status.OK).json({ message: message.UPDATED, statis: idStatis })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteStatis = async (req, res) => {
  try {
    const idStatis = await Time.findById(req.body.idStatis).exec()
    if (!idStatis) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await idStatis.deleteOne()
    return res.status(204).send()
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createStatis, getStatis, updateStatis, deleteStatis }

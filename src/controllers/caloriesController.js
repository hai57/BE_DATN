import { Calories } from '@/models/caloriesModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createCalories = async (req, res) => {
  try {
    const caloriesToCreate = req.body;
    // Sử dụng Promise.all để tạo và lưu đồng thời tất cả các lần
    const createdCalories = await Promise.all(caloriesToCreate.map(async (caloriesData) => {

      // Tạo một thời gian mới
      const newCalories = new Calories({
        _id: caloriesData._id,
        gender: caloriesData.gender,
        maxAge: caloriesData.maxAge,
        minAge: caloriesData.minAge,
        caloriesNeed: caloriesData.caloriesNeed
      });

      return newCalories.save();
    }));
    return res.status(status.CREATED).json({ message: message.CREATED, calories: createdCalories });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getCalories = async (req, res) => {
  try {
    //Sử dụng sort lấy dữ liệu sx tăng dần
    const calories = await Calories.find().select({ _id: 0, id: '$_id', gender: '$gender', maxAge: '$maxAge', minAge: '$minAge', caloriesNeed: '$caloriesNeed' });

    return res.status(status.OK).json({ message: message.OK, items: calories })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateCalories = async (req, res) => {
  try {
    const caloriesId = await Calories.findById(req.body.caloriesId).exec()
    if (!caloriesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    caloriesId.gender = req.body.gender;
    caloriesId.maxAge = req.body.maxAge;
    caloriesId.minAge = req.body.minAge;
    caloriesId.caloriesNeed = req.body.caloriesNeed
    await caloriesId.save()
    return res.status(status.OK).json({ message: message.UPDATED, calories: caloriesId })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteCalories = async (req, res) => {
  try {
    const caloriesId = await Calories.findById(req.body.caloriesId).exec()
    if (!caloriesId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Calories.findByIdAndRemove(caloriesId)
    return res.status(status.OK).json({ message: message.OK })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createCalories, getCalories, updateCalories, deleteCalories }

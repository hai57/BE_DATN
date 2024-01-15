import { Time } from '@/models/timeModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createTime = async (req, res) => {
  try {
    const timesToCreate = req.body;
    // Sử dụng Promise.all để tạo và lưu đồng thời tất cả các lần
    const createdTimes = await Promise.all(timesToCreate.map(async (timeData) => {

      // Tạo một thời gian mới
      const newTime = new Time({
        _id: timeData.idTimes,
        hour: timeData.hour,
        minutes: timeData.minutes,
      });

      return newTime.save();
    }));
    return res.status(status.CREATED).json(createdTimes);
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getTime = async (req, res) => {
  try {
    //Sử dụng sort lấy dữ liệu sx tăng dần
    const time = await Time.find().select({ _id: 0, id: '$_id', hour: '$hour', minutes: '$minutes' });

    return res.status(status.OK).json({ message: message.OK, times: time })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateTime = async (req, res) => {
  try {
    const idTimes = await Time.findById(req.body.idTimes).exec()
    if (!idTimes) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    idTimes.hour = req.body.hour;
    idTimes.minutes = req.body.minutes
    await idTimes.save()
    return res.status(status.OK).json({ message: message.UPDATED, time: idTimes })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteTime = async (req, res) => {
  try {
    const idTimes = await Time.findById(req.body.idTimes).exec()
    if (!idTimes) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Time.findByIdAndRemove(idTimes)
    return res.status(204).send()
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createTime, getTime, updateTime, deleteTime }

const {Time} = require('../models/timeModels')

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
    return res.status(201).json(createdTimes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi khi tạo thời gian.' });
  }
};
const getTime = async(req,res) => {
  try {
    //Sử dụng sort lấy dữ liệu sx tăng dần
    const time = await Time.find().sort({_id:1})
    return res.status(200).json(time)
  }catch(err) {
    return res.status(500).json({message: 'Error at get time'})
  }
}
module.exports = {createTime, getTime}

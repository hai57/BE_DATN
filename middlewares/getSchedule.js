const { Schedule } = require('../models/scheduleModels');

const getScheduleId = async (req, res, next) => {
  try {
    // Retrieve the task data based on a certain condition (e.g., task ID)
    const schedule = await Schedule.findById(req.params.scheduleId);

    // Attach the task data to the request object
    req.schedule = schedule;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {getScheduleId}

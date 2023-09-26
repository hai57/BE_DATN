const mongoose = require('mongoose');

const scheduleUserSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users',required: true},
  schedule: {type: mongoose.Schema.Types.ObjectId, ref: 'schedules',required: true},
  date: {
    type: Date,
    required: true
  },
  times: [
    {
      hour: {
        type: Number,
        min: 0,
        max: 24,
        required: true,
      },
      minutes: {
        type: Number,
        min: 0,
        max: 59,
        default: 0,
      },
    },
  ],
});

const ScheduleUser = mongoose.model('scheduleUsers', scheduleUserSchema);

module.exports = {ScheduleUser}

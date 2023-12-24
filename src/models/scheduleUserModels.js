import mongoose from 'mongoose';

const scheduleUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'schedules',
    required: true
  },
  time: {
    type: mongoose.Schema.Types.Number,
    ref: 'times',
    required: true
  },
  date: {
    type: Date,
    required: true
  },

}, {
  versionKey: false,
});

const ScheduleUser = mongoose.model('scheduleUsers', scheduleUserSchema);

export { ScheduleUser }

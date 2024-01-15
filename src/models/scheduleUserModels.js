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
  status: {
    type: Boolean
  },
  startDay: {
    type: Date
  },
}, {
  versionKey: false,
});

const ScheduleUser = mongoose.model('scheduleUsers', scheduleUserSchema);

export { ScheduleUser }

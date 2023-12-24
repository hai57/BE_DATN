import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  nameSchedule: {
    type: String
  },
  createAt: {
    type: Date
  },
  type: {
    type: String,
    enum: ['day', 'week']
  },
  timeLine: [
    {
      startTime: {
        type: String
      },
      endTime: {
        type: String
      },
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities'
      },
      subActivities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'subActivities'
        }
      ]
    }
  ]

}, {
  versionKey: false,
})

const Schedule = mongoose.model('schedules', scheduleSchema)

export { Schedule }

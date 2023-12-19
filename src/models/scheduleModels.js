import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  nameSchedule: {
    type: String
  },
  typeSchedule: {
    type: mongoose.Schema.Types.Number,
    ref: 'typeSchedule'
  },
  daySchedule: [
    {
      order: {
        type: Number
      },
      itemSchedule: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'items'
        }
      ]
    }
  ]

})

const Schedule = mongoose.model('schedules', scheduleSchema)

export { Schedule }

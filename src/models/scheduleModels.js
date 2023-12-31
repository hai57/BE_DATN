import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  nameSchedule: {
    type: String
  },
  type: {
    type: String,
    enum: ['day', 'week']
  },
  timeLine: [
    {
      itemActivity: [
        {
          activity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'activities'
          },
          is_parent: {
            type: Boolean
          },
          startTime: {
            type: mongoose.Schema.Types.Number,
            ref: 'times'
          },
          endTime: {
            type: mongoose.Schema.Types.Number,
            ref: 'times'
          },
          itemSubActivity: [
            {
              subActivities:
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subActivities'
              }
            }
          ]
        }
      ]
    }
  ]

}, {
  versionKey: false,
})

const Schedule = mongoose.model('schedules', scheduleSchema)

export { Schedule }

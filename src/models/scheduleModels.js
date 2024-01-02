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
    enum: ['Day', 'Week']
  },
  timeLine: [
    {
      itemsActivity: [
        {
          activityID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'activities'
          },
          isParent: {
            type: Boolean
          },
          startTime: {
            type: mongoose.Schema.Types.String,
            ref: 'times'
          },
          endTime: {
            type: mongoose.Schema.Types.String,
            ref: 'times'
          },
          itemsSubActivity: [
            {
              subActivityId:
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

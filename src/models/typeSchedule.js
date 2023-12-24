import mongoose from 'mongoose'

const typeScheduleSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
}, {
  versionKey: false,
})

const TypeSchedule = mongoose.model('typeSchedule', typeScheduleSchema)

export { TypeSchedule }

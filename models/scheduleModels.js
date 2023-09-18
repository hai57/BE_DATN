const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  user: {type:mongoose.Schema.Types.ObjectId,ref:'users',required: true},
  tasks: {type:mongoose.Schema.Types.ObjectId,ref:'tasks'},
  day: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  meal: {
    type: String,
    required: true,
  },
  exercises: {
    type: String,
    required: true
  }
})

const Schedule = mongoose.model('schedules', scheduleSchema)

module.exports = { Schedule }

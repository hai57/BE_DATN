const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  times : {type : mongoose.Schema.Types.ObjectId, ref:"times", required: true},
  tasks: {type:mongoose.Schema.Types.ObjectId,ref:'tasks', required: true},
  nameSchedule: {
    type: String,
    required : true
  }
})

const Schedule = mongoose.model('schedules', scheduleSchema)

module.exports = { Schedule }

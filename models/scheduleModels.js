const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  time : {type : mongoose.Schema.Types.Number, ref:"times", required: true},
  task: {type:mongoose.Schema.Types.ObjectId,ref:'tasks', required: true},
  nameSchedule: {
    type: String,
    required : true
  }
})

const Schedule = mongoose.model('schedules', scheduleSchema)

module.exports = { Schedule }

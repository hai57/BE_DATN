const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  scheduleUser : {type : mongoose.Schema.Types.ObjectId, ref:"scheduleUsers", required: true},
  tasks: {type:mongoose.Schema.Types.ObjectId,ref:'tasks', required: true},
  nameSchedule: {
    type: String,
    required : true
  }
})

const Schedule = mongoose.model('schedules', scheduleSchema)

module.exports = { Schedule }

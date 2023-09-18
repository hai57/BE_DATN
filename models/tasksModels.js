const mongoose = require('mongoose')
const tasksSchema = new mongoose.Schema({
  user: {type:mongoose.Schema.Types.ObjectId,ref:'users',required: true},
  schedule: {type:mongoose.Schema.Types.ObjectId,ref:'schedules',required: true},
  nameTask: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
})

const Tasks = mongoose.model("tasks", tasksSchema);

module.exports = {Tasks}

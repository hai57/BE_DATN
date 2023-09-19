const mongoose = require('mongoose')
const tasksSchema = new mongoose.Schema({
  nameTask: {
    type: String,
    required: true
  },
  taskContent: {
    type: String,
    required: true
  },
  typeTask: {type: mongoose.Schema.Types.ObjectId, ref: 'types', required: true}

})

const Tasks = mongoose.model("tasks", tasksSchema);

module.exports = {Tasks}

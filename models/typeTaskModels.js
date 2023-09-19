const mongoose = require('mongoose')

const typeTask = new mongoose.Schema({
  nameType: {
    type: String,
    required: true
  },
  typeTasks: {
    type: mongoose.Schema.Types.Mixed.apply,
    required: true
  }
})

const TypeTask = mongoose.model('types', typeTask)

module.exports = {TypeTask}

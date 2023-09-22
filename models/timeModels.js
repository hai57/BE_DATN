const mongoose = require('mongoose')

const timeSchema = new mongoose.Schema({
  customId: { type: Number, min: 1, max: 24, required: true },
  hour: { type: Number, min: 0, max: 24, required: true },
  minutes: { type: Number, min: 0, max: 59, default: 0 },
});

const Time = mongoose.model('times', timeSchema);

module.exports = {Time};

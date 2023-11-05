import mongoose from 'mongoose';

const timeSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  hour: {
    type: Number,
    min: 0,
    max: 24,
    required: true
  },
  minutes: {
    type: Number,
    min: 0,
    max: 59,
    default: 0
  },
});

const Time = mongoose.model('times', timeSchema);

export {Time};

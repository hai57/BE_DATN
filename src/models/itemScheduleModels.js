import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities'
  }
}, {
  versionKey: false,
});

const Item = mongoose.model('items', itemSchema);

export { Item };

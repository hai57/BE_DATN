import mongoose from 'mongoose';

const activitiesSchema = new mongoose.Schema({
  typeActivities: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'types'
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  time: {
    type: String
  },
  isParent: {
    type: Boolean,
    required: true
  }
})

const Activities = mongoose.model('activities', activitiesSchema);

export { Activities }

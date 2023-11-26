import mongoose from 'mongoose';

const activitiesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  typeActivities: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'types'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isParent: {
    type: Boolean,
    required: true
  }
})

const Activities = mongoose.model('activities', activitiesSchema);

export { Activities }

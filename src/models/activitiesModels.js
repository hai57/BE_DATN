import mongoose from 'mongoose';

const activitiesSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'types'
  },
  activityName: {
    type: String
  },
  description: {
    type: String
  },
  isParent: {
    type: Boolean
  },
  iconCode: {
    type: String
  }
}, {
  versionKey: false,
})

const Activities = mongoose.model('activities', activitiesSchema);

export { Activities }

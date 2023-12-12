import mongoose from 'mongoose';

const activitiesSchema = new mongoose.Schema({
  typeActivities: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'types'
  },
  name: {
    type: String
  },
  desciption: {
    type: String
  },
  isParent: {
    type: Boolean
  }
})

const Activities = mongoose.model('activities', activitiesSchema);

export { Activities }

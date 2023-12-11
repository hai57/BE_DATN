import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  activity : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities'
  },
  name: {
    type: String
  },
  amount: {
    type: Number
  }
})

const SubActivities = mongoose.model('subActivities', subActivitiesSchema);

export { SubActivities }

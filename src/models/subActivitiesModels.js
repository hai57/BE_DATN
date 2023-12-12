import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities'
  },
  name: {
    type: String
  },
  amount: {
    type: Number
  },
  unit: {
    type: String,
    enum: ['kg', 's']
  }
})

const SubActivities = mongoose.model('subActivities', subActivitiesSchema);

export { SubActivities }

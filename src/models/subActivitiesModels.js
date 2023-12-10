import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  activity : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities'
  },
  amount: {
    type: Number
  }
})

const SubActivities = mongoose.model('subActivities', subActivitiesSchema);

export { SubActivities }

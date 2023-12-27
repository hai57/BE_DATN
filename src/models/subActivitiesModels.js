import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities'
  },
  iconCode: {
    type: String
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
}, {
  versionKey: false,
})

const SubActivities = mongoose.model('subactivities', subActivitiesSchema);

export { SubActivities }

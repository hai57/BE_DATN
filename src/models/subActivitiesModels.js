import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  iconCode: {
    type: String
  },
  subActivityName: {
    type: String
  },
  amount: {
    type: Number
  },
  unit: {
    type: String,
    enum: ['g', 'm']
  },
  type: {
    type: String
  }
}, {
  versionKey: false,
})

const SubActivities = mongoose.model('subactivities', subActivitiesSchema);

export { SubActivities }

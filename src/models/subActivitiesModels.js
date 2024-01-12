import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities'
  },
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
    enum: ["consumption", "absorption"]
  }
}, {
  versionKey: false,
})

const SubActivities = mongoose.model('subactivities', subActivitiesSchema);

export { SubActivities }

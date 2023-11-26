import mongoose from 'mongoose';

const subActivitiesSchema = new mongoose.Schema({
  activity : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activities',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },  
  amount: {
    type: Number
  },
})

const SubActivities = mongoose.model('subActivities', subActivitiesSchema);

export { SubActivities }

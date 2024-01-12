import mongoose from 'mongoose';

const caloriesSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['nam', 'nữ']
  },
  minAge: {
    type: String
  },
  maxAge: {
    type: String
  },
  caloriesNeed: {
    type: String
  }
}, {
  versionKey: false,
})

const Calories = mongoose.model('calories', caloriesSchema)

export { Calories }

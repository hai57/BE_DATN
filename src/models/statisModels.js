import mongoose from 'mongoose';

const statisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  caloriesNeed: {
    type: String
  },
  caloriesSpend: {
    type: String
  },
  isIncrease: {
    type: Boolean
  }
}, {
  versionKey: false,
})

const Statis = mongoose.model('statis', statisSchema)

export { Statis }

import mongoose from 'mongoose'

const typeActivities = new mongoose.Schema({
  _id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
}, {
  versionKey: false,
})

const Type = mongoose.model('types', typeActivities)

export { Type }

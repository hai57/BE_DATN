import mongoose from 'mongoose'

const typeActivities = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
}, {
  versionKey: false,
})

const Type = mongoose.model('types', typeActivities)

export { Type }

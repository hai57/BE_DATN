import mongoose from 'mongoose'

const typeActivities = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
})

const Type = mongoose.model('types', typeActivities)

export { Type }

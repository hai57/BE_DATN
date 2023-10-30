import mongoose from 'mongoose'

const typeTask = new mongoose.Schema({
  nameType: {
    type: String,
    required: true
  },
})

const TypeTask = mongoose.model('types', typeTask)

export { TypeTask }

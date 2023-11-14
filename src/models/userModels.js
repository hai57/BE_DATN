import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'roles',
    required:true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true,
    unique:true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // weight: {
  //   type: String,
  //   required: true
  // },
  // height: {
  //   type: String,
  //   required: true
  // }
})

const User = mongoose.model('users', userSchema)

export { User }

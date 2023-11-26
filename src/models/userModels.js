import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'roles'
  },
  name: {
    type: String
  },
  age: {
    type: String
  },
  gmail: {
    type: String,
    unique:true
  },
  address: {
    type: String
  },
  password: {
    type: String
  },
  // weight: {
  //   type: String
  // },
  // height: {
  //   type: String
  // }
})

const User = mongoose.model('users', userSchema)

export { User }

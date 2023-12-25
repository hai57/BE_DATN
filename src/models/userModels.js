import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles'
  },
  username: {
    type: String
  },
  birthday: {
    type: String
  },
  gmail: {
    type: String,
    unique: true
  },
  gender: {
    type: String
  },
  password: {
    type: String
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  }
}, {
  versionKey: false,
})

const User = mongoose.model('users', userSchema)

export { User }

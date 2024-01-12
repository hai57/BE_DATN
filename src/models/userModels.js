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
    type: String,
    enum: ['nam', 'nữ']
  },
  password: {
    type: String
  },
  weight: {
    type: String
  },
  height: {
    type: String
  }
}, {
  versionKey: false,
})

const User = mongoose.model('users', userSchema)

export { User }

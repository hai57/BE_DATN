const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {type: mongoose.Schema.Types.ObjectId,ref:'roles',required:true},
  token: {type: mongoose.Schema.Types.ObjectId,ref:'token'},
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
})

const User = mongoose.model('users', userSchema)

module.exports = { User }

const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
  token: {
    type: String
  },
  tokenExpiration: {
    type: String
  },

})

const Token = mongoose.model('tokens', tokenSchema)

module.exports = {Token}

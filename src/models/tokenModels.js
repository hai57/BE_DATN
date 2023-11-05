import  mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId, ref: 'users',
    required: true
  },
  token: {
    type: String
  },
  tokenExpiration: {
    type: Date
  },

})

const Token = mongoose.model('tokens', tokenSchema)

export {Token}

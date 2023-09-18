const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  nameRole: {
    type: String,
    required: true
  }
});

const Role =  mongoose.model('roles', roleSchema);

module.exports = {Role}

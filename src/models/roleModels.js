import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  nameRole: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
});

const Role = mongoose.model('roles', roleSchema);

export { Role }

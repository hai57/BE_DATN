import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema({
  typeTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'types',
    required: true
  },
  nameTask: {
    type: String,
    required: true
  },
  taskContent: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

})

const Tasks = mongoose.model('tasks', tasksSchema);

export { Tasks }

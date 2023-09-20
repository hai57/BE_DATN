const {TypeTask} = require('../models/typeTaskModels')

const taskContentMiddleware = async function (req, res, next) {
  try {
    const typeInfo = await TypeTask.findById(req.body.typeTask).exec();

    if (typeInfo) {
      if (typeInfo.nameType === 'String') {
        req.body.taskContent = String(req.body.taskContent);
      } else if (typeInfo.nameType === 'List') {
        if (!Array.isArray(req.body.taskContent)) {
          req.body.taskContent = [req.body.taskContent];
        }
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Middleware error at task content' });
  }
};

module.exports = {taskContentMiddleware}

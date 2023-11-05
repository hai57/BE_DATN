import { TypeTask } from '@/models/typeTaskModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

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
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

export { taskContentMiddleware }

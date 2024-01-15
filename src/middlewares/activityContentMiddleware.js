import { Type } from '@/models/typeModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const activityDescriptionMiddleware = async function (req, res, next) {
  try {
    const typeInfo = await Type.findById(req.body.activity).exec();

    if (typeInfo) {
      if (typeInfo.name === 'String') {
        req.body.description = String(req.body.description);
      } else if (typeInfo.name === 'List') {
        if (!Array.isArray(req.body.description)) {
          req.body.description = [req.body.description];
        }
      }
    }

    next();
  } catch (error) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

export { activityDescriptionMiddleware }

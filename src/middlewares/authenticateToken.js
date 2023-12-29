import jwt from 'jsonwebtoken'
import moment from 'moment';

import { Role } from '@/models/roleModels.js'
import { User } from '@/models/userModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const secretKey = 'abc';

const generateToken = (user) => {
  const tokenExpiration = Math.floor(Date.now() / 1000) + 4 * 30 * 24 * 60 * 60;
  return jwt.sign({ userId: user._id, tokenExpiration }, secretKey);
};

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(status.UNAUTHORIZED).json({ message: message.ERROR.INVALID_TOKEN_FORMAT });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(status.FORBIDDEN).json({ message: message.ERROR.INVALID_TOKEN });
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.tokenExpiration < currentTimestamp) {
      return res.status(status.UNAUTHORIZED).json({ message: message.ERROR.TOKEN_EXP });
    }

    req.userId = decoded.userId;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      res.status(status.NOT_FOUND).send({ message: message.ERROR.NOT_FOUND });
      return;
    }

    const roles = await Role.find({ _id: { $in: user.role } }).exec();

    let isAdmin = false;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].nameRole === 'admin') {
        isAdmin = true;
        break;
      }
    }

    if (isAdmin) {
      next();
    } else {
      return res.status(status.FORBIDDEN).json({ message: message.ERROR.MISSING_ADMIN });
    }
  } catch (error) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const authenticateToken = {
  verifyToken,
  isAdmin,
};

const checkTokenValidity = async (req, res) => {
  try {
    // Sử dụng middleware để kiểm tra token
    verifyToken(req, res, async () => {
      // Nếu token hợp lệ, trả về thông báo thành công
      const user = await User.findById(req.userId).select('-__v');;;
      if (!user) {
        return res.status(status.NOT_FOUND).json({ message: message.ERROR.USER_NOT_FOUND });
      }
      const formattedBirthday = moment(user.birthday).format('DD-MM-YYYY');
      const selectUser = {
        id: user._id,
        username: user.username || '',
        birthday: formattedBirthday || '',
        gmail: user.gmail || '',
        gender: user.gender || '',
        weight: user.weight || '',
        height: user.height || ''
      }

      return res.status(status.OK).json({ message: 'Token is valid', user: selectUser });
    });
  } catch (err) {
    console.error(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};


export { generateToken, authenticateToken, checkTokenValidity }

import jwt from 'jsonwebtoken'
import { Role } from '../models/roleModels.js'
import { User } from '../models/userModels.js'
import { status } from '../constant/status.js';

const secretKey = 'abc';

const generateToken = (user) => {
  const tokenExpiration = Math.floor(Date.now() / 1000) + 2 * 60;
  return jwt.sign({ userId: user._id, tokenExpiration  }, secretKey);
};

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(status.UNAUTHORIZED).json({ message: 'Access denied: Invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(status.FORBIDDEN).json({ message: 'Invalid token' });
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.tokenExpiration < currentTimestamp) {
      return res.status(status.UNAUTHORIZED).json({ message: 'Token has expired' });
    }

    req.userId = decoded.userId;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      res.status(status.ERROR).send({ message: 'User not found' });
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

    if (isAdmin ) {
      next();
    } else {
      return res.status(status.FORBIDDEN).json({ message: 'Require Admin Role!' });
    }
  }  catch (error) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(status.ERROR).json({ message: 'Server error', error: error.message });
  }
};

const authenticateToken = {
    verifyToken,
    isAdmin,
};

export {generateToken, authenticateToken}

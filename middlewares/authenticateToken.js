const jwt = require('jsonwebtoken');
const secretKey = 'abc';
const {Role} = require('@/models/roleModels')
const {User} = require('@/models/userModels')


const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, secretKey, { expiresIn: '4h' });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: Invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      res.status(500).send({ message: 'User not found' });
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
      return res.status(403).json({ message: 'Require Admin Role!' });
    }
  }  catch (error) {
    console.error('Error in isAdmin middleware:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const authenticateToken = {
    verifyToken,
    isAdmin,
  };
module.exports = {generateToken, authenticateToken}

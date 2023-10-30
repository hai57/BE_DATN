import moment from 'moment';

import { User } from '../models/userModels.js';
import { Role } from '../models/roleModels.js';
import { Token } from '../models/tokenModels.js';
import { generateToken } from '../middlewares/index.js';
import { status } from '../constant/status.js';


const createUser =  async (req, res) => {
  try {
    const user = new User(req.body);
    const role = await Role.findById(req.body.role);
    if (!role) {
      return res.status(status.NOT_FOUND).json({ message: "Role not found" });
    } else if (!req.body.name) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing name field.' });
    } else if(!req.body.age ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing age field.' });
    } else if(!req.body.gmail ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing gmail field.' });
    } else if(!req.body.address ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing address field.' });
    } else if(!req.body.password ) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing password field.' });
    }
    user.role = role._id;
    //token
    const token = generateToken(user);

    await user.save();
    res.status(status.CREATED).json({
      status: "Success",
      token: token
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(status.BAD_REQUEST).json({ message: 'Validation error' });
    }
    return res.status(status.ERROR).json({ msg: err.message });
  }
};

const getAllUser =  async (req, res) => {
  try {
    const usersWithRoles = await User.aggregate([
      {
        $lookup: {
          from:"roles",
          localField:"role",
          foreignField:"_id",
          as : "roleDetails"
        }
      },
      {
        $lookup: {
          from:"tokens",
          localField:"_id",
          foreignField:"user",
          as: "tokenDetails"
        }
      },
      {
        $project: {
          name: 1,
          age: 1,
          gmail: 1,
          address: 1,
          password: 1,
          'tokenDetails.token':1,
          'tokenDetails.tokenExpiration': 1,
          'roleDetails.nameRole': 1
        },
      }
    ])
    if (!usersWithRoles || usersWithRoles.length === 0 || !usersWithRoles[0].roleDetails.length) {
      return res.status(status.NOT_FOUND).json({ message: 'Không tìm thấy dữ liệu' });
    }
    res.status(status.OK).json(usersWithRoles);
  } catch (error) {
    return res.status(status.ERROR).json({ msg: error.message });
  }
};

const getUser = async(req,res) => {
  const {gmail} = req.body
  try{
    const user = await User.findOne({gmail});
    if(!user) {
      return res.status(status.NOT_FOUND).json({message: 'invalid gmail'})
    } else {
      const usersWithRoles = await User.aggregate([
        {
          $match: {gmail: gmail}
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'roles'
          }
        },
        {
          $project: {
            name: 1,
            age: 1,
            gmail: 1,
            address: 1,
            password: 1,
            token:1,
            tokenExpiration: 1,
            'roles.nameRole': 1
          }
        }
      ])
      if (!usersWithRoles || usersWithRoles.length === 0 || !usersWithRoles[0].roleDetails.length) {
        return res.status(status.NOT_FOUND).json({message: 'Không tìm thấy dữ liệu '})
      }

      res.status(status.OK).json(usersWithRoles)
  }
  } catch(err) {
    console.error(err)
    return res.status(status.ERROR).json({message: 'Server error at get user'})
  }
};

const deleteUser = async(req,res) => {
  const {gmail} = req.body;
  try {
    const user = await User.findOne({gmail});
    if(!user){
      return res.status(status.NOT_FOUND).json({message: 'invalid email'})
    }
    await User.findByIdAndRemove(user._id);
    res.status(status.OK).json({ message: 'User deleted successfully' });
  } catch(err) {
    console.error('Error in deleteUser:', error);
    return res.status(status.ERROR).json({message: 'Server error at delete user'})
  }
};

const updateUser = async(req,res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if(!user) {
      return res.status(status.NOT_FOUND).json({message:'User not found'})
    } else if ( !req.body.name || !req.body.age || !req.body.gmail || !req.body.address || !req.body.password) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing required fields' });
    }
    user.name = req.body.name;
    user.age = req.body.age;
    user.gmail = req.body.gmail;
    user.address = req.body.address
    user.password = req.body.password

    await user.save();
    res.status(status.OK).json({message: 'Update success'})
  } catch(err){
    console.error(err)
    return res.status(status.ERROR).json({message: 'Server error at update user'})
  }
};

const changePassword = async(req,res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if(!user) {
      return res.status(status.NOT_FOUND).json({message:'User not found'})
    } if (user.password !== req.body.oldPassword) {
      return res.status(status.UNAUTHORIZED).json({ message: 'Incorrect old password' });
    }
    user.password = req.body.newPassword;
    await user.save()
    res.status(status.OK).json({message: 'Change password success'})
  } catch(err) {
    console.error(err);
    return res.status(status.ERROR).json({message: 'Server error at change password'})
  }
};

const login = async(req,res) => {
  const {gmail, password} = req.body;

  try {
    const user = await User.findOne({ gmail });
    if(!user) {
      return res.status(status.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
    if(user.password === password ){
      await Token.deleteMany({ user: user._id });
      const token = generateToken(user);
      const newToken = new Token({
        user: user._id,
        token,
        expiration: token.tokenExpiration
      });
      try {
        await newToken.save();
        console.log('Token saved successfully');
        return res.status(status.OK).json( newToken.token  );
      } catch (error) {
        console.error('Error saving token:', error);
        return res.status(status.ERROR).json({message:"Error"})
      }

    } else {
      res.status(status.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
  }
  catch (err) {
    console.error(err)
    res.status(status.ERROR).json({ message: 'Server error at login' });
  }
};

//tao moi token cho nguoi dung
const refreshToken = async (req, res) => {
  const { gmail } = req.body;
  try {
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(status.UNAUTHORIZED).json({ message: 'Invalid email' });
    } else {
      const newToken = generateToken(user);
      user.token = newToken;
      const newExpiration =  moment().add(4, 'months');
      const duration = _duration(newExpiration.diff(moment()));
      const newRemainingTime  = duration.humanize();
      user.tokenExpiration = newRemainingTime;

      await user.save();

      res.status(status.OK).json({ user: user.name, token: newToken, Expiration: newRemainingTime });
    }
  } catch (error) {
    console.error('Error in refreshToken:', error);
    res.status(status.ERROR).json({ message: 'Server error' });
  }
};

const getToken = async (req, res) => {
  try {
    const token = await Token.find();
    res.status(status.OK).json(token)
  }
  catch(err) {
    res.status(status.ERROR).json({message: "error"})
  }
};

export { createUser,getAllUser,getUser,updateUser,login,refreshToken,deleteUser,changePassword,getToken }

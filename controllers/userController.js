const { User } = require('../models/userModels');
const { Role } = require('../models/roleModels');
const { Token } = require('../models/tokenModels')
const {generateToken}= require('../middlewares')
const moment = require('moment')

const createUser =  async (req, res) => {
  try {
    const user = new User(req.body);
    const role = await Role.findById(req.body.role);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    user.role = role._id;
    //token
    const token = generateToken(user);
    const expiration = moment().add(4, 'months');
    const duration = moment.duration(expiration.diff(moment()));
    const remainingTime  = duration.humanize();

    const dataToken = new Token({
      user: user._id,
      token : token,
      tokenExpiration : remainingTime
    })
    await dataToken.save()
    await user.save();
    res.status(200).json({
      status: "Success",
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
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

    res.status(200).json(usersWithRoles);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const getUser = async(req,res) => {
  const {gmail} = req.body
  try{
    const user = await User.findOne({gmail});
    if(!user) {
      return res.status(401).json({message: 'invalid gmail'})
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
            as: 'roleDetails'
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
            'roleDetails.nameRole': 1
          }
        }
      ])
      res.status(200).json(usersWithRoles)
    }
  } catch(err) {
    return res.status(500).json({message: 'Server error at get user'})
  }
}
const deleteUser = async(req,res) => {
  const {gmail} = req.body;
  try {
    const user = await User.findOne({gmail});
    if(!user){
      return res.status(401).json({message: 'invalid email'})
    }
    await User.findByIdAndRemove(user._id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch(err) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({message: 'Server error at delete user'})
  }
};
const updateUser = async(req,res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if(!user) {
      return res.status(401).json({message:'User not found'})
    }
    user.name = req.body.name;
    user.age = req.body.age;
    user.gmail = req.body.gmail;
    user.address = req.body.address
    await user.save();
    res.status(200).json({message: 'Update success'})
  } catch(err){
    return res.status(500).json({message: 'Server error at update user'})
  }
};
const changePassword = async(req,res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if(!user) {
      return res.status(401).json({message:'User not found'})
    } if(user.password === req.body.oldPassword) {
      user.password == req.body.newPassword
    }
    await user.save()
    res.status(200).json({message: 'Change password success'})
  } catch(err) {
    return res.status(500).json({message: 'Server error at change password'})
  }
};
const login = async(req,res) => {
  const {gmail, password} = req.body;
  try {
    const user = await User.findOne({ gmail });
    if(!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if(user.password === password ){
      const token = generateToken(user);
      const newExpiration = moment().add(4, 'months').format('YYYY-MM-DD HH:mm:ss');
      const dataToken = new Token({
        user: user._id,
        token : token,
        tokenExpiration : newExpiration
      })
      res.status(200).json({ dataToken });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error at login' });
  }
};

//tao moi token cho nguoi dung
const refreshToken = async (req, res) => {
  const { gmail } = req.body;
  try {
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    } else {
      const newToken = generateToken(user);
      user.token = newToken;
      const newExpiration =  moment().add(4, 'months');
      const duration = moment.duration(newExpiration.diff(moment()));
      const newRemainingTime  = duration.humanize();
      user.tokenExpiration = newRemainingTime;

      await user.save();

      res.status(200).json({ user: user.name, token: newToken, Expiration: newRemainingTime });
    }
  } catch (error) {
    console.error('Error in refreshToken:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {createUser,getAllUser,getUser,updateUser,login,refreshToken,deleteUser,changePassword};

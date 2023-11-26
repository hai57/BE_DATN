// import moment from 'moment';

import { User } from '@/models/userModels.js';
import { Role } from '@/models/roleModels.js';
import { Token } from '@/models/tokenModels.js';
import { generateToken } from '@/middlewares/index.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';


const createUser =  async (req, res) => {
  try {
    const user = new User(req.body);
    const defaultRole = '6503ee3bae3b2ccd6dae5fab'
    const role = await Role.findById(defaultRole);
    if (!role) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.MISS_FIELD });
    } else if (!req.body.name) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.age ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.gmail ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.address ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if(!req.body.password ) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    user.role = defaultRole;
    //token
    const token = generateToken(user);

    await user.save();
    res.status(status.CREATED).json({
      status: 'Success',
      message: message.CREATED ,
      user: user,
      token: token
    });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getAllUser =  async (req, res) => {
  const offset  =req.query.offset || 0 // Giá trị mặc định là 0 nếu không có tham số offset được cung cấp
  const limit = req.query.limit || 10 // Giá trị mặc định là 10 nếu không có tham số limit được cung cấp
  try {
    const usersWithRoles = await User.aggregate([
      {
        $lookup: {
          from:'roles',
          localField:'role',
          foreignField:'_id',
          as : 'roleDetails'
        }
      },
      {
        $addFields: {
          nameRole: { $arrayElemAt: ['$roleDetails.nameRole', 0] }
          //$roleDetails.nameRole là một mảng các giá trị nameRole lấy từ việc thực hiện $lookup.
          //0 chỉ đến phần tử đầu tiên của mảng nameRole.
        }
      },
      {
        $project: {
          name: 1, // 1 la duoc liet ke, 0 la khong bao gom
          age: 1,
          gmail: 1,
          address: 1,
          password: 1,
          nameRole: 1
        },
      }
    ])
    .skip(parseInt(offset))
    .limit(parseInt(limit));
    if (!usersWithRoles || usersWithRoles.length === 0 ) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }
    res.status(status.OK).json({ message: message.OK, usersWithRoles });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getUser = async(req, res) => {
  try{
    const user = await User.findById(req.userId);
    if(!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.INVALID })
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
          $addFields : {
            nameRole: { $arrayElemAt: ['$roles.nameRole', 0] }
          }
        },
        {
          $project: {
            name: 1,
            age: 1,
            gmail: 1,
            address: 1,
            password: 1,
            nameRole: 1
          }
        }
      ])

      if (!usersWithRoles || usersWithRoles.length === 0) {
        return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
      }

      res.status(status.OK).json({ message: message.OK, usersWithRoles })
  }
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteUser = async(req, res) => {
  try {
    const userId = req.body.idUser;
    const user = await User.findById(userId).exec();
    if(!user){
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await User.findByIdAndRemove(userId);
    res.status(status.OK).json({ message: message.OK });
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateUser = async(req, res) => {
  try {
    const userId = req.body._id;
    const user = await User.findById(userId).exec();
    if(!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if ( !req.body.name || !req.body.age || !req.body.gmail || !req.body.address || !req.body.password) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    user.name = req.body.name;
    user.age = req.body.age;
    user.gmail = req.body.gmail;
    user.address = req.body.address
    user.password = req.body.password

    await user.save();
    res.status(status.OK).json({ message: message.OK, user })
  } catch(err){
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const changePassword = async(req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if(!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } if (user.password !== req.body.oldPassword) {
      return res.status(status.UNAUTHORIZED).json({ message: message.ERROR.UNAUTHORIZED.OLD_PASS_INCORRECT });
    }
    user.password = req.body.newPassword;
    await user.save()
    res.status(status.OK).json({ message: message.OK })
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const login = async(req, res) => {
  const {gmail, password} = req.body;

  try {
    const user = await User.findOne({ gmail });
    if(!user) {
      return res.status(status.UNAUTHORIZED).json({ message: message.ERROR.INVALID });
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
        return res.status(status.OK).json({ userId: user._id, token: newToken.token });
      } catch (err) {
        return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
      }
    } else {
      res.status(status.UNAUTHORIZED).json({ message: message.ERROR.INVALID });
    }
  }
  catch (err) {
    console.error(err)
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

//tao moi token cho nguoi dung
// const refreshToken = async (req, res) => {
//   const { gmail } = req.body;
//   try {
//     const user = await User.findOne({ gmail });
//     if (!user) {
//       return res.status(status.UNAUTHORIZED).json({ message: message.ERROR.INVALID });
//     } else {
//       const newToken = generateToken(user);
//       user.token = newToken;
//       const newExpiration =  moment().add(4, 'months');
//       const duration = _duration(newExpiration.diff(moment()));
//       const newRemainingTime  = duration.humanize();
//       user.tokenExpiration = newRemainingTime;

//       await user.save();

//       res.status(status.OK).json({ user: user.name, token: newToken, Expiration: newRemainingTime });
//     }
//   } catch (err) {
//     res.status(status.ERROR).json({ message: message.ERROR.INVALID });
//   }
// };

const getToken = async (req, res) => {
  try {
    const token = await Token.find();
    res.status(status.OK).json({ message: message.OK, token })
  }
  catch(err) {
    res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createUser, getAllUser, getUser, updateUser, login, deleteUser, changePassword, getToken }

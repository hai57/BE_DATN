import moment from 'moment';

import { User } from '@/models/userModels.js';
import { Role } from '@/models/roleModels.js';
import { Token } from '@/models/tokenModels.js';
import { generateToken } from '@/middlewares/index.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';
import { Calories } from '@/models/caloriesModels.js';

const getSelectedUserFields = (user) => {
  return {
    id: user._id,
    username: user.username || '',
    birthday: user.birthday || '',
    gmail: user.gmail || '',
    gender: user.gender || '',
    weight: user.weight || '',
    height: user.height || ''
  };
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const defaultRole = '6555877d0fa87df47f00aead'
    const role = await Role.findById(defaultRole);
    if (!role) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    } else if (!req.body.username) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if (!req.body.gmail) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    if (req.body.birthday) {
      const dateOfBirth = moment(req.body.birthday, 'DD-MM-YYYY').toDate();
      if (Object.prototype.toString.call(dateOfBirth) === '[object Date]' && !isNaN(dateOfBirth)) {
        user.birthday = moment(dateOfBirth).format('YYYY-MM-DD');
      } else {
        return res.status(status.BAD_REQUEST).json({ message: message.ERROR.SERVER });
      }
    }
    //token
    const token = generateToken(user);
    const selectedUserFields = getSelectedUserFields(user)
    await user.save();
    res.status(status.CREATED).json({
      message: message.CREATED,
      user: selectedUserFields,
      token: token
    });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const register = async (req, res) => {
  try {
    const user = new User(req.body);
    const defaultRole = '6555877d0fa87df47f00aead'
    const role = await Role.findById(defaultRole);
    if (!role) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.MISS_FIELD });
    } else if (!req.body.gmail) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    } else if (!req.body.password) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    if (req.body.birthday) {
      const dateOfBirth = moment(req.body.birthday, 'DD-MM-YYYY').toDate();
      if (Object.prototype.toString.call(dateOfBirth) === '[object Date]' && !isNaN(dateOfBirth)) {
        user.birthday = moment(dateOfBirth).format('YYYY-MM-DD');
      } else {
        return res.status(status.BAD_REQUEST).json({ message: message.ERROR.SERVER });
      }
    } else {
      user.birthday = '';
    }
    user.role = defaultRole;
    //token
    const token = generateToken(user);

    await user.save();
    const selectedUserFields = getSelectedUserFields(user);
    return res.status(status.CREATED).json({
      message: message.CREATED,
      user: selectedUserFields,
      token: token
    });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getAllUser = async (req, res) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 10
  try {
    const usersWithRoles = await User.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roleDetails'
        }
      },
      {
        $addFields: {
          nameRole: { $arrayElemAt: ['$roleDetails.nameRole', 0] },
          id: '$_id'
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          username: { $ifNull: ['$username', ''] },
          birthday: {
            $cond: {
              if: { $gt: ['$birthday', ''] },
              then: {
                $dateToString: {
                  format: '%d-%m-%Y',
                  date: {
                    $dateFromString: {
                      dateString: '$birthday',
                      format: '%Y-%m-%d',
                    },
                  },
                },
              },
              else: '',
            },
          },
          gmail: { $ifNull: ['$gmail', ''] },
          gender: { $ifNull: ['$gender', ''] },
          weight: { $ifNull: ['$weight', ''] },
          height: { $ifNull: ['$height', ''] },
          nameRole: { $ifNull: ['$nameRole', ''] }
        },
      },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) }
    ])
    if (usersWithRoles.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND });
    }
    res.status(status.OK).json({ message: message.OK, items: usersWithRoles });
  } catch (err) {
    console.log(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.INVALID })
    } else {
      const usersWithRoles = await User.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(user) }
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
          $addFields: {
            nameRole: { $arrayElemAt: ['$roles.nameRole', 0] },
            id: '$_id'

          }
        },
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            age: 1,
            gmail: 1,
            gender: 1,
            nameRole: 1
          }
        }
      ])

      if (!usersWithRoles || usersWithRoles.length === 0) {
        return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
      }

      res.status(status.OK).json({ message: message.OK, items: usersWithRoles })
    }
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.body.idUser;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await User.findByIdAndRemove(userId);
    res.status(status.OK).json({ message: message.OK });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.username || !req.body.birthday || !req.body.gender || !req.body.weight || !req.body.height) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    if (req.body.birthday) {
      const dateOfBirth = moment(req.body.birthday, 'DD-MM-YYYY').toDate();
      if (Object.prototype.toString.call(dateOfBirth) === '[object Date]' && !isNaN(dateOfBirth)) {
        user.birthday = moment(dateOfBirth).format('YYYY-MM-DD');
      } else {
        return res.status(status.BAD_REQUEST).json({ message: message.ERROR.SERVER });
      }
    }

    user.username = req.body.username;
    user.weight = req.body.weight;
    user.height = req.body.height;
    user.gender = req.body.gender;

    await user.save();
    const formattedBirthday = moment(user.birthday).format('DD-MM-YYYY');
    user.birthday = formattedBirthday;
    const selectedUserFields = getSelectedUserFields(user)
    res.status(status.OK).json({ message: message.UPDATED, user: selectedUserFields })
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateUserWithIdForAdmin = async (req, res) => {
  try {
    const userId = req.body.id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.username || !req.body.birthday || !req.body.gender || !req.body.weight || !req.body.height) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    if (req.body.birthday) {
      const dateOfBirth = moment(req.body.birthday, 'DD-MM-YYYY').toDate();
      if (Object.prototype.toString.call(dateOfBirth) === '[object Date]' && !isNaN(dateOfBirth)) {
        user.birthday = moment(dateOfBirth).format('YYYY-MM-DD');
      } else {
        return res.status(status.BAD_REQUEST).json({ message: message.ERROR.SERVER });
      }
    }


    user.username = req.body.username;
    user.weight = req.body.weight;
    user.height = req.body.height;
    user.gender = req.body.gender;

    await user.save();
    const formattedBirthday = moment(user.birthday).format('DD-MM-YYYY');
    user.birthday = formattedBirthday;
    const selectedUserFields = getSelectedUserFields(user)
    res.status(status.OK).json({ message: message.UPDATED, user: selectedUserFields })
  } catch (err) {
    console.error(err)
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};


const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } if (user.password !== req.body.oldPassword) {
      return res.status(status.UNAUTHORIZED).json({ message: message.ERROR.UNAUTHORIZED.OLD_PASS_INCORRECT });
    }
    user.password = req.body.newPassword;
    await user.save()
    res.status(status.OK).json({ message: message.OK })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const login = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    const user = await User.findOne({ gmail })
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND, user: "", token: "" });
    }
    if (user.password === password) {
      await Token.deleteMany({ user: user._id });
      const token = generateToken(user);
      const newToken = new Token({
        user: user,
        token,
        expiration: token.tokenExpiration
      });
      try {
        await newToken.save();
        if (user.birthday) {
          const formattedBirthday = moment(user.birthday).format('DD-MM-YYYY');
          user.birthday = formattedBirthday;
        }
        const selectedUserFields = getSelectedUserFields(user);

        return res.status(status.OK).json({ message: message.LOGIN, user: selectedUserFields, token: newToken.token });
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

const loginAdmin = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    const user = await User.findOne({ gmail })
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND, user: "", token: "" });
    } else if (user.role.equals("655587830fa87df47f00aeaf")) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISSING_ADMIN, user: "", token: "" });

    }
    if (user.password === password) {
      await Token.deleteMany({ user: user._id });
      const token = generateToken(user);
      const newToken = new Token({
        user: user,
        token,
        expiration: token.tokenExpiration
      });
      try {
        await newToken.save();
        if (user.birthday) {
          const formattedBirthday = moment(user.birthday).format('DD-MM-YYYY');
          user.birthday = formattedBirthday;
        }
        const selectedUserFields = getSelectedUserFields(user);

        return res.status(status.OK).json({ message: message.LOGIN, user: selectedUserFields, token: newToken.token });
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

const calculateAge = (birthday) => {
  const today = moment();
  const birthdate = moment(birthday, 'YYYY-MM-DD');
  const age = today.diff(birthdate, 'years');
  return age;
};

const getCaloriesNeed = async (req, res) => {
  const user = await User.findById(req.userId);
  const caloriesList = await Calories.find();
  const age = calculateAge(user.birthday);

  try {
    let matchedCaloriesInfo = null;

    for (const caloriesInfo of caloriesList) {
      const minAge = parseInt(caloriesInfo.minAge);
      const maxAge = parseInt(caloriesInfo.maxAge);

      if (
        caloriesInfo.gender.toLowerCase() === user.gender.toLowerCase() &&
        age >= minAge &&
        age <= maxAge
      ) {
        matchedCaloriesInfo = caloriesInfo;
        break;
      }
    }

    if (matchedCaloriesInfo) {
      return res.status(status.OK).json({
        message: message.OK,
        caloriesNeed: matchedCaloriesInfo.caloriesNeed
      });
    } else {
      return res.status(status.OK).json({ message: "No matching record found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
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
    const token = await Token.find().select('-__v');
    res.status(status.OK).json({ message: message.OK, token })
  }
  catch (err) {
    res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createUser, getAllUser, getUser, updateUser, updateUserWithIdForAdmin, login, loginAdmin, deleteUser, changePassword, getToken, register, getCaloriesNeed }

import { Role } from '@/models/roleModels.js'
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const getRole = async(req, res) =>{
  try {
    const role = await Role.find()
    res.status(status.OK).json({ message: message.OK, role });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const createRole = async(req, res) => {
  try {
    const newRole = new Role(req.body)
    await newRole.save()
    res.status(status.CREATED).json({ message: message.CREATED, newRole})
  } catch (err) {
    return res.status(status.ERROR).json({ message : message.ERROR.SERVER });
  }
};

const updateRole = async(req, res) => {
  try {
    const checkRoleID = await Role.findById(req.body.roleId).exec()
    if(!checkRoleID) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    } else if (!req.body.nameRole) {
      return res.status(status.BAD_REQUEST).json({ message: message.ERROR.MISS_FIELD });
    }
    checkRoleID.nameRole = req.body.nameRole
    await checkRoleID.save()
    res.status(status.OK).json({ message: message.OK, checkRoleID})
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  }
};

const deleteRole = async(req, res) => {
  try{
    const checkRoleID = await Role.findById(req.body.idRole).exec()
    if(!checkRoleID) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND})
    }
    await checkRoleID.deleteOne()
    return res.status(status.NO_CONTENT).send()
  } catch(err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER})
  };
};

export { getRole,createRole,updateRole,deleteRole }

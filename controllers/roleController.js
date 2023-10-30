import { Role } from '../models/roleModels.js'
import { status } from '../constant/status.js';

const getRole = async(req,res) =>{
  try {
    const role = await Role.find()
    res.status(status.OK).json(role);
  } catch (error) {
    return res.status(status.ERROR).json({ msg: error.message });
  }
};

const createRole = async(req,res) => {
  try {
    const newRole = new Role(req.body)
    await newRole.save()
    res.status(status.CREATED).json({status: 'created'})
  } catch (error) {
    return res.status(status.ERROR).json({ msg: error.message });
  }
};

const updateRole = async(req,res) => {
  try {
    const checkRoleID = await Role.findById(req.body.roleId).exec()
    if(!checkRoleID) {
      return res.status(status.NOT_FOUND).json({message:'Role not found'})
    } else if (!req.body.nameRole) {
      return res.status(status.BAD_REQUEST).json({ message: 'Missing nameRole fields' });
    }
    checkRoleID.nameRole = req.body.nameRole
    await checkRoleID.save()
    res.status(status.OK).json({message: 'Update success', checkRoleID})
  } catch(err) {
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at update role'})
  }
};

const deleteRole = async(req,res) => {
  try{
    const checkRoleID = await Role.findById(req.body.idRole).exec()
    if(!checkRoleID) {
      return res.status(status.NOT_FOUND).json({message:'Role not found'})
    }
    await checkRoleID.deleteOne()
    return res.status(204).send()
  } catch(err) {
    console.error(err);
    return res.status(status.ERROR).json({message: 'Error at delete role'})
  };
};

export { getRole,createRole,updateRole,deleteRole }

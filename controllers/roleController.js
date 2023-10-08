const  {Role} = require('../models/roleModels')

const getRole = async(req,res) =>{
  try {
    const role = await Role.find()
    res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
const createRole = async(req,res) => {
  try {
    const newRole = new Role(req.body)
    await newRole.save()
    res.status(201).json({status: 'created'})
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
const updateRole = async(req,res) => {
  try {
    const checkRoleID = await Role.findById(req.body.roleId).exec()
    if(!checkRoleID) {
      return res.status(404).json({message:'Role not found'})
    } else if (!req.body.nameRole) {
      return res.status(400).json({ message: 'Missing nameRole fields' });
    }
    checkRoleID.nameRole = req.body.nameRole
    await checkRoleID.save()
    res.status(200).json({message: 'Update success', checkRoleID})
  } catch(err) {
    console.error(err);
    return res.status(500).json({message: 'Error at update role'})
  }
}
const deleteRole = async(req,res) => {
  try{
    const checkRoleID = await Role.findById(req.body.idRole).exec()
    if(!checkRoleID) {
      return res.status(404).json({message:'Role not found'})
    }
    await checkRoleID.deleteOne()
    return res.status(204).send()
  } catch(err) {
    console.error(err);
    return res.status(500).json({message: 'Error at delete role'})
  }
}
module.exports = {getRole,createRole,updateRole,deleteRole}

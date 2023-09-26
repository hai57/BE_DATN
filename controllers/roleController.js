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
module.exports = {getRole,createRole}

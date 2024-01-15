import { Type } from '@/models/typeModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createType = async (req, res) => {
  try {
    const TypeToCreate = req.body;
    const createdTypes = await Promise.all(TypeToCreate.map(async (typeData) => {

      const newType = new Type({
        _id: typeData.id,
        name: typeData.name,
      });

      return newType.save();
    }));
    return res.status(status.CREATED).json({ message: message.CREATED, items: createdTypes });
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getType = async (req, res) => {
  try {
    //Sử dụng sort lấy dữ liệu sx tăng dần
    const type = await Type.find().select({ _id: 0, id: '$_id', name: '$name' });

    return res.status(status.OK).json({ message: message.OK, items: type })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const updateType = async (req, res) => {
  try {
    const typeId = await Type.findById(req.body.typeId).exec()
    if (!typeId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    typeId.name = req.body.name;
    await typeId.save()
    return res.status(status.OK).json({ message: message.UPDATED, type: typeId })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

const deleteType = async (req, res) => {
  try {
    const typeId = await Type.findById(req.body.typeId).exec()
    if (!typeId) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    await Type.findByIdAndDelete(typeId)
    return res.status(status.OK).json({ message: message.OK })
  } catch (err) {
    return res.status(status.ERROR).json({ message: message.ERROR.SERVER })
  }
};

export { createType, getType, updateType, deleteType }

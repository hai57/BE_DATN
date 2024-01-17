import cloudinary from '@/utils/cloudinary.js';
import { message } from '@/constant/message.js';
import { status } from '@/constant/status.js';

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file provided' });
    }
    // Loại bỏ phần mở rộng của tên file (ví dụ: .png)
    const originalNameWithoutExtension = req.file.originalname.replace(/\.[^/.]+$/, '');

    const result = await uploadImage(req.file, 'DATN', originalNameWithoutExtension);

    if (result.status === 'success') {
      res.status(status.OK).json(result);
    } else {
      res.status(status.ERROR).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(status.ERROR).json({ status: 'error', message: message.ERROR.SERVER, error });
  }
};

const uploadImage = (file, folderName, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folderName,
      public_id: publicId,
    };
    cloudinary.uploader.upload(file.path, uploadOptions, (error, result) => {
      if (error) {
        reject({ status: 'error', message: message.ERROR.UPLOADED_FAIL, error });
      } else {
        result.original_filename = file.originalname;
        resolve({ status: 'success', message: message.UPLOADED, data: result });
      }
    });
  });
};


const getImagesInFolder = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {

      // Sử dụng `prefix` để chỉ định thư mục cụ thể trong Cloudinary
      const prefix = 'DATN';

      cloudinary.api.resources(
        { type: 'upload', prefix: prefix },
        (error, result) => {
          if (error) {
            reject({ status: 'error', message: message.ERROR.GET_IMAGES_FAIL, error });
          } else {
            const images = result.resources.map(resource => ({
              public_id: resource.public_id,
              format: resource.format,
              url: resource.url,
              created_at: resource.created_at,
            }));
            resolve({ status: 'success', message: message.GET_IMAGES, data: images });
          }
        }
      );
    });

    if (result.status === 'success') {
      res.status(status.OK).json(result);
    } else {
      res.status(status.ERROR).json(result);
    }
  } catch (error) {
    res.status(status.ERROR).json({ status: 'error', message: message.ERROR.SERVER });
  }
};


export { uploadFile, getImagesInFolder };

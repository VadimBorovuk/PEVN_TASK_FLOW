const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../lib/cloudinary');

const createUpload = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder: `task_uploads_images/${folder}`,
        allowed_formats: ['jpg', 'png', 'jpeg']
      };
    }
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  });
};

const profileUpload = createUpload('profiles');
const attachmentsUpload = createUpload('attachments');

// Один файл → req.file → task_uploads_images/profiles
const uploadSingle = (fieldName) => (req, res, next) => {
  profileUpload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'The file is too large. Maximum 3 MB.'
        });
      }

      return res.status(400).json({
        success: false,
        message: `Error upload: ${err.message}`
      });
    }

    if (err) {
      return res.status(err.http_code || 500).json({
        success: false,
        code: err.http_code,
        message: err.message || 'Error upload file'
      });
    }

    next();
  });
};


// Декілька файлів → req.files → task_uploads_images/attachments
const uploadMultiple = (fieldName, maxCount = 5) => (req, res, next) => {
  attachmentsUpload.array(fieldName, maxCount)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'One of the files is too large. Maximum 3 MB.'
        });
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxCount} files allowed.`
        });
      }

      return res.status(400).json({
        success: false,
        message: `Error upload: ${err.message}`
      });
    }

    if (err) {
      return res.status(err.http_code || 500).json({
        success: false,
        code: err.http_code,
        message: err.message || 'Error upload files'
      });
    }

    next();
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple
};

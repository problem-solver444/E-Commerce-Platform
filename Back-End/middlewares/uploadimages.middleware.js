const multer = require('multer');
const ApiError = require('../utils/api-error');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new ApiError('Only image allowed', 400), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//  Upload single image
exports.uploadSingleImage = (fieldName) => upload.single(fieldName);

//  Upload multiple fields images
exports.uploadMixOfImages = (arrayOfFields) => upload.fields(arrayOfFields);

const Category = require('../models/category.model');
const factory = require('../utils/handler.factory');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { uploadSingleImage } = require('../middlewares/uploadimages.middleware');

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const fileName = Date.now() + '-' + req.file.originalname;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
  req.body.image = fileName;
  next();
});

exports.uploadCategoryImage = uploadSingleImage('image');

//@ desc Get list of categories
//@ route GET /api/v1/categories
//@ access Public
exports.getCategories = factory.getAll(Category);

//@ desc Get category by id
//@ route GET /api/v1/categories/:id
//@ access Public
exports.getCategory = factory.getOne(Category,'category');

//@ desc Create new category
//@ route POST /api/v1/categories
//@ access Private/Admin-Manager
exports.createCategory = factory.createOne(Category);

//@ desc Update category by id
//@ route PUT /api/v1/categories/:id
//@ access Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

//@ desc Delete category by id
//@ route DELETE /api/v1/categories/:id
//@ access Private/Admin
exports.deleteCategory = factory.deleteOne(Category);

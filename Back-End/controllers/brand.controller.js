const Brand = require('../models/brand.model');
const factory = require('../utils/handler.factory');
const { uploadSingleImage } = require('../middlewares/uploadimages.middleware');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const fileName = Date.now() + '-' + req.file.originalname;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
});

exports.uploadBrandImage = uploadSingleImage('image');

//@ desc Get list of brands
//@ route GET /api/v1/brands
//@ access Public
exports.getBrands = factory.getAll(Brand);

//@ desc Get brand by id
//@ route GET /api/v1/categories/:id
//@ access Public

exports.getBrand = factory.getOne(Brand);

//@ desc Create new brand
//@ route POST /api/v1/brands
//@ access Private/Admin-Manager
exports.createBrand = factory.createOne(Brand);

//@ desc Update brand by id
//@ route PUT /api/v1/brands/:id
//@ access Private/Admin-Manager
exports.updateBrand = factory.updateOne(Brand);

//@ desc Delete brand by id
//@ route DELETE /api/v1/brands/:id
//@ access Private/Admin

exports.deleteBrand = factory.deleteOne(Brand);

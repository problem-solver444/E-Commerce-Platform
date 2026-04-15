const Product = require('../models/product.model');
const factory = require('../utils/handler.factory');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { uploadMixOfImages } = require('../middlewares/uploadimages.middleware');

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const fileName = `product-cover-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${fileName}`);
    req.body.imageCover = fileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const fileName = `product-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(800, 800)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);
        req.body.images.push(fileName);
      }),
    );
  }

  next();
});
exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

//@ desc Get list of Products
//@ route GET /api/v1/products
//@ access Public
exports.getProducts = factory.getAll(Product, 'products');

//@ desc Get product by id
exports.getProduct = factory.getOne(Product);

//@ desc Create new product
//@ route POST /api/v1/Products
//@ access Private/Admin-Manager
exports.createProduct = factory.createOne(Product);

//@ desc Update product by id
//@ route PUT /api/v1/Products/:id
//@ access Private/Admin-Manager
exports.updateProduct = factory.updateOne(Product);

//@ desc Delete product by id
//@ route DELETE /api/v1/Products/:id
//@ access Private/Admin
exports.deleteProduct = factory.deleteOne(Product);

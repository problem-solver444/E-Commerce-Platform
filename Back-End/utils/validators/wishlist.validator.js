const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const User = require('../../models/user.model');
const Product = require('../../models/product.model');
exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

exports.addProductToWishlistValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error('Product not found');
      }
      return true;
    }),
  validatorMiddleware,
];


exports.deleteProductFromWishlistValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid Product id format')
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error('Product not found');
      }
      return true;
    }),
  validatorMiddleware,
];

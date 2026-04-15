const express = require('express');
const router = express.Router();

const {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
  imageProcessing,
  uploadProductImages,
} = require('../controllers/product.controller');

const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require('../utils/validators/product.validator');

const authController = require('../controllers/auth.controller');
const reviewRouter = require('./review.route.js');

// Nested route to get all reviews of a specific product
router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    uploadProductImages,
    createProductValidator,
    imageProcessing,
    createProduct,
  )
  .get(getProducts);

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;

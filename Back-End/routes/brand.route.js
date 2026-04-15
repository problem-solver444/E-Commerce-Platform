const express = require('express');
const router = express.Router();

const {
  createBrand,
  deleteBrand,
  getBrands,
  getBrand,
  updateBrand,
  imageProcessing,
  uploadBrandImage,
} = require('../controllers/brand.controller');

const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brand.validator');

const authController = require('../controllers/auth.controller');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    uploadBrandImage,
    createBrandValidator,
    imageProcessing,
    createBrand,
  )
  .get(getBrands);

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    uploadBrandImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteBrandValidator,
    deleteBrand,
  );

module.exports = router;

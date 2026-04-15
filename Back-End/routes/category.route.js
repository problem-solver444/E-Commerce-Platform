const express = require('express');
const router = express.Router();

const subCategoryRouter = require('./subcategory.route');
const authController = require('../controllers/auth.controller');
const {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
  uploadCategoryImage,
  imageProcessing,
} = require('../controllers/category.controller');

const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require('../utils/validators/category.validator');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    uploadCategoryImage,
    createCategoryValidator,
    imageProcessing,
    createCategory,
  )
  .get(getCategories);

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    uploadCategoryImage,
    updateCategoryValidator,
    imageProcessing,
    updateCategory,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteCategoryValidator,
    deleteCategory,
  );

// Nested route to get all subcategories of a specific category
router.use('/:categoryId/subcategories', subCategoryRouter);
module.exports = router;

const express = require('express');

//mergeParams --> to access the params from the parent router (categoryId) in this sub-category router
// , allowing us to associate sub-categories with their parent categories effectively.

const router = express.Router({ mergeParams: true });

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require('../controllers/subcategory.controller');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/sub-category.validator');

const authController = require('../controllers/auth.controller');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFilterObject, getSubCategories);

router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    setCategoryIdToBody,
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;

const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const slugify = require('slugify');

exports.getSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('id must not be Empty')
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory name is required')
    .isLength({ min: 2 })
    .withMessage('SubCategory name must be at least 2 characters long')
    .isLength({ max: 32 })
    .withMessage('SubCategory name must be at most 32 characters long')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    
  check('category')
    .notEmpty()
    .withMessage('subcategory must be belong to category')
    .isMongoId()
    .withMessage('Invalid category id format'),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('id must not be Empty')
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('id must not be Empty')
    .isMongoId()
    .withMessage('Invalid Subcategory id format'),
  validatorMiddleware,
];

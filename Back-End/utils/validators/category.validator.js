const { check, body } = require('express-validator');
const slugify = require('slugify');
const Category = require('../../models/category.model');
const validatorMiddleware = require('../../middlewares/validator.middleware');

exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3 })
    .withMessage('Category name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('Category name must be at most 32 characters long')
    .custom(async (val, { req }) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        throw new Error('Category name already exists');
      }
      req.body.slug = slugify(val);
      return true;
    }),
  ,
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

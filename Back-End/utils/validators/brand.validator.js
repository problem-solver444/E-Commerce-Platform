const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const slugify = require('slugify');
const Brand = require('../../models/brand.model');
exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 3 })
    .withMessage('Brand name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('Brand name must be at most 32 characters long')
    .custom(async (val, { req }) => {
      const brand = await Brand.findOne({ name: val });
      if (brand) {
        throw new Error('Brand name already exists');
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validatorMiddleware,
];

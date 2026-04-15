const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const Coupon = require('../../models/coupon.model');

exports.getCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Coupon name is required')
    .isLength({ min: 3 })
    .withMessage('Coupon name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('Coupon name must be at most 32 characters long')
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) {
        throw new Error('Coupon name already exists');
      }
      return true;
    }),
  check('discount')
    .notEmpty()
    .withMessage('Coupon discount is required')
    .isFloat({ min: 1, max: 100 }),

  check('expiresAt')
    .notEmpty()
    .withMessage('Coupon expiry date is required')
    //Date Format Valid (Year-Month-Day)
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((val) => {
      if (new Date(val) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Coupon name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('Coupon name must be at most 32 characters long')
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) {
        throw new Error('Coupon name already exists');
      }
      return true;
    }),
  check('discount').optional().isFloat({ min: 1, max: 100 }),
  check('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((val) => {
      if (new Date(val) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  validatorMiddleware,
];

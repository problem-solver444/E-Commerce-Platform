const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const slugify = require('slugify');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 3 })
    .withMessage('User name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('User name must be at most 32 characters long')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error('User email already exists');
      }
      return true;
    }),
  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 6 })
    .withMessage('User password must be at least 6 characters long')
    .isLength({ max: 200 })
    .withMessage('User password must be at most 200 characters long'),
  check('confirmPassword')
    .notEmpty()
    .withMessage('User confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('User confirm password must match password');
      }
      return true;
    }),
  check('profileImage').optional(),
  check('phone')
    .notEmpty()
    .withMessage('User phone is required')
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format'),

  validatorMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error('User email already exists');
      }
      return true;
    }),
  check('profileImage').optional(),
  check('phone')
    .notEmpty()
    .withMessage('User phone is required')
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format'),

  validatorMiddleware,
];
exports.changePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You Must enter Current Password')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id).select('+password');
      if (!user) {
        throw new Error('there is no user for this id');
      }
      const isMatched = await bcrypt.compare(val, user.password);
      if (!isMatched) {
        throw new Error('Incorrect current password');
      }
      return true;
    }),
  body('password').notEmpty().withMessage('You Must enter new Password'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('User confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('User confirm password must match password');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('You Must enter Current Password')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id).select('+password');
      const isMatched = await bcrypt.compare(val, user.password);
      if (!isMatched) {
        throw new Error('Incorrect current password');
      }
      return true;
    }),
  body('password').notEmpty().withMessage('You Must enter new Password'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('User confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('User confirm password must match password');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 3 })
    .withMessage('User name must be at least 3 characters long')
    .isLength({ max: 32 })
    .withMessage('User name must be at most 32 characters long')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error('User email already exists');
      }
      return true;
    }),
  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 6 })
    .withMessage('User password must be at least 6 characters long')
    .isLength({ max: 200 })
    .withMessage('User password must be at most 200 characters long'),
  check('confirmPassword')
    .notEmpty()
    .withMessage('User confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('User confirm password must match password');
      }
      return true;
    }),
  check('profileImage').optional(),
  check('phone')
    .notEmpty()
    .withMessage('User phone is required')
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format'),

  validatorMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateLoogedUserValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error('User email already exists');
      }
      return true;
    }),
  check('phone')
    .notEmpty()
    .withMessage('User phone is required')
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone number format'),

  validatorMiddleware,
];

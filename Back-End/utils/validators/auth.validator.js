const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const slugify = require('slugify');
const User = require('../../models/user.model');

exports.signUpValidator = [
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

  validatorMiddleware,
];
exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid Credential'),

  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 6 })
    .withMessage('User password must be at least 6 characters long')
    .isLength({ max: 200 })
    .withMessage('User password must be at most 200 characters long'),

  validatorMiddleware,
];

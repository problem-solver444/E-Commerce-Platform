const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const slugify = require('slugify');
const Review = require('../../models/review.model');

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check('comment').optional(),
  check('rating')
    .notEmpty()
    .withMessage('Review rating is required')
    .isFloat({ min: 1, max: 5 }),
  check('product')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        user: req.user._id,
        product: val,
      });
      if (review) {
        throw new Error('You have already reviewed this product');
      }
      return true;
    }),
  check('user').isMongoId().withMessage('Invalid user id format'),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error('Review not found');
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error('You are not allowed to update this review');
      }
      return true;
    }),
  validatorMiddleware,
];
exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      if (req.user.role === 'user') {
        const review = await Review.findById(val);
        if (!review) {
          throw new Error('Review not found');
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error('You are not allowed to delete this review');
        }
      }
      return true;
    }),
  validatorMiddleware,
];

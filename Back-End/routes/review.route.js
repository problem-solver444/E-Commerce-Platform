const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  createReview,
  deleteReview,
  getReviews,
  getReview,
  updateReview,
  createFilterObject,
  setProductIdAndUserToBody,
} = require('../controllers/review.controller');

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/review.validator');

const authController = require('../controllers/auth.controller');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin', 'manager'),
    setProductIdAndUserToBody,
    createReviewValidator,
    createReview,
  )
  .get(createFilterObject, getReviews);

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(
    authController.protect,
    authController.restrictTo('user', 'admin', 'manager'),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin', 'manager'),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;

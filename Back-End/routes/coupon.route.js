const express = require('express');
const router = express.Router();

const {
  createCoupon,
  deleteCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  
} = require('../controllers/coupon.controller');

const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require('../utils/validators/coupon.validator');

const authController = require('../controllers/auth.controller');

router.use(authController.protect, authController.restrictTo('admin', 'manager'));

router.route('/').post(createCouponValidator, createCoupon).get(getCoupons);

router
  .route('/:id')
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;

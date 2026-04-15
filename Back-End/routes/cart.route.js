const express = require('express');
const router = express.Router();

const {
  addToCart,
  getLoggedUserCart,
  deleteCartItem,
  clearCart,
  updateCurrentItemQuantitiy,
  applyCoupon,
} = require('../controllers/cart.controller');

const authController = require('../controllers/auth.controller');

router.use(authController.protect, authController.restrictTo('user'));

router.route('/').post(addToCart).get(getLoggedUserCart).delete(clearCart);

router.route('/applyCoupon').put(applyCoupon);

router.route('/:itemId').put(updateCurrentItemQuantitiy).delete(deleteCartItem);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  addProductToWishlist,
  removeProductFromWishlist,
  loggedUserWishlist,
} = require('../controllers/wishlist.controller');

const authController = require('../controllers/auth.controller');
const {
  addProductToWishlistValidator,
  deleteProductFromWishlistValidator,
} = require('../utils/validators/wishlist.validator');

router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .post(addProductToWishlistValidator, addProductToWishlist)
  .get(loggedUserWishlist);

router
  .route('/:productId')
  .delete(deleteProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;

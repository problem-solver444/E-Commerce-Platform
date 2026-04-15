const express = require('express');
const router = express.Router();
const {
  createCashOrder,
  getAllLoggedUserOrders,
  filterAllOrders,
  getOrder,
  filterOrderByRole,
  updateOrderToDelevered,
  updateOrderToPaid,
  getCheckOutSession
} = require('../controllers/order.controller');
const authController = require('../controllers/auth.controller');

router.use(authController.protect);

router
  .route('/checkout-session/:cartId')
  .get(authController.restrictTo('user'), getCheckOutSession);

router
  .route('/:cartId')
  .post(authController.restrictTo('user'), createCashOrder);
router
  .route('/')
  .get(
    authController.restrictTo('user', 'admin', 'manager'),
    filterAllOrders,
    getAllLoggedUserOrders,
  );

router
  .route('/:id')
  .get(
    authController.restrictTo('user', 'admin', 'manager'),
    filterOrderByRole,
    getOrder,
  );
router
  .route('/:id/pay')
  .put(authController.restrictTo('admin', 'manager'), updateOrderToPaid);
router
  .route('/:id/deliver')
  .put(authController.restrictTo('admin', 'manager'), updateOrderToDelevered);

module.exports = router;

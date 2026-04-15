const express = require('express');
const router = express.Router();

const {
  addAddress,
  removeAddress,
  loggedUserAddress,
} = require('../controllers/address.controller');

const authController = require('../controllers/auth.controller');

router.use(authController.protect, authController.restrictTo('user'));

router.route('/').post(addAddress).get(loggedUserAddress);

router.route('/:addressId').delete(removeAddress);

module.exports = router;

const express = require('express');
const router = express.Router();

const { signUp, login,forgotPassword,verfiyResetCode,resetPassword } = require('../controllers/auth.controller');

const { signUpValidator, loginValidator } = require('../utils/validators/auth.validator');

router.route('/signup').post(signUpValidator, signUp);
router.route('/login').post(loginValidator, login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/verfiyResetCode').post(verfiyResetCode);
router.route('/resetPassword').put(resetPassword);
module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const {
  createUser,
  deleteUser,
  getUsers,
  getUser,
  updateUser,
  imageProcessing,
  uploadUserImage,
  changePassword,
  getMe,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require('../controllers/user.controller');

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoogedUserValidator,
} = require('../utils/validators/user.validator');

//Logged User
router.get('/getMe', authController.protect, getMe, getUser);
router.put(
  '/changeMyPassword',
  authController.protect,
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword,
);
router.put(
  '/updateMe',
  authController.protect,
  updateLoogedUserValidator,
  updateLoggedUserData,
);

router.delete('/deleteMe', authController.protect, deleteLoggedUserData);

// admin
router.put(
  '/changePassword/:id',
  authController.protect,
  authController.restrictTo('admin'),
  changePasswordValidator,
  changePassword,
);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    uploadUserImage,
    createUserValidator,
    imageProcessing,
    createUser,
  )
  .get(authController.protect, authController.restrictTo('admin'), getUsers);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    getUserValidator,
    getUser,
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    uploadUserImage,
    updateUserValidator,
    imageProcessing,
    updateUser,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteUserValidator,
    deleteUser,
  );

module.exports = router;

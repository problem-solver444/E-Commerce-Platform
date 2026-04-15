const User = require('../models/user.model');
const factory = require('../utils/handler.factory');
const { uploadSingleImage } = require('../middlewares/uploadimages.middleware');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/create-token');
const ApiError = require('../utils/api-error');

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const fileName = Date.now() + '-' + req.file.originalname;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
  req.body.profileImage = fileName;
  next();
});

exports.uploadUserImage = uploadSingleImage('profileImage');

//@ desc Get list of users
//@ route GET /api/v1/users
//@ access Private/Admin
exports.getUsers = factory.getAll(User);

//@ desc Get user by id
//@ route GET /api/v1/users/:id
//@ access Private/Admin
exports.getUser = factory.getOne(User);

//@ desc Create new User
//@ route POST /api/v1/users
//@ access Private/Admin
exports.createUser = factory.createOne(User);

//@ desc Update User by id
//@ route PUT /api/v1/users/:id
//@ access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      returnDocument: 'after',
    },
  );
  if (!document) {
    return next(new ApiError(`No User found for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: document,
  });
});

//@ desc Change User Password
//@ route PUT /api/v1/users/changePassword/:id
//@ access Public
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    { password: await bcrypt.hash(req.body.password, 12), changedPasswordAt: Date.now() },
    { returnDocument: 'after' },
  );
  if (!document) {
    return next(new ApiError(`No document found for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: document,
  });
});

//@ desc Delete User by id
//@ route DELETE /api/v1/users/:id
//@ access Private/Admin
exports.deleteUser = factory.deleteOne(User);

//@ desc Get current logged in user
//@ route GET /api/v1/users/me
//@ access private
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//@desc update logged in user
//@ route PUT /api/v1/users/changeMyPassword
//@ access private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { password: await bcrypt.hash(req.body.password, 12), changedPasswordAt: Date.now() },
    { returnDocument: 'after' },
  );
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    data: user,
    token,
  });
});

//@desc update logged in user
//@ route PUT /api/v1/users/updateMe
//@ access private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { returnDocument: 'after' },
  );
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    data: user,
    token,
  });
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'success',
  });
});

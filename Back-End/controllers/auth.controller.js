const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ApiError = require('../utils/api-error');
const sendMail = require('../utils/send-email');
const createToken = require('../utils/create-token');


//@desc Register new user
//@route POST /api/v1/auth/signup
//@access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    data: user,
    token,
  });
});

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: user,
    token,
  });
});

//desc Protected route
//route GET /api/v1/auth/protect
//access Private
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ApiError('You are not logged in. Please login to access this resource.', 401),
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError('User belonging to this token no longer exists.', 401));
  }

  if (currentUser.changedPasswordAt) {
    const PasswordChangedTimeStamps = parseInt(
      currentUser.changedPasswordAt.getTime() / 1000,
      10,
    );
    if (PasswordChangedTimeStamps > decoded.iat) {
      return next(
        new ApiError('Password was recently changed. Please log in again...', 401),
      );
    }
  }
  req.user = currentUser;
  next();
});

//desc restrict to
//route GET /api/v1/auth/protect
//access Private
exports.restrictTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }
    next();
  });

//desc forgot password
//route POST /api/v1/auth/forgotPassword
//access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No User Found for this Email ${req.body.email} `));
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  // save in DB
  user.passwordResetCode = hashedOTP;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // send email
  try {
    const message = `Hi ${user.name},\n we received a request to reset the password on your E-Pay Account.\n ${otp} \n Enter this code to complete the reset.`;
    await sendMail({
      email: user.email,
      subject: 'Your password reset code Valid for 10 min',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }
  res.status(200).json({
    status: 'success',
    message: 'OTP Sent to Your Email',
  });
});


//desc verfiy reset code
//route POST /api/v1/auth/verfiyResetCode
//access Public
exports.verfiyResetCode = asyncHandler(async (req, res, next) => {
  const hashedOTP = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
  const user = await User.findOne({
    passwordResetCode: hashedOTP,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Reset code invalid or expired', 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: 'Success',
  });
});

// desc reset password
// route POST /api/v1/auth/resetPassword
// access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`there is no user for this Email ${req.body.email}`, 400));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verfied', 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).json({
    status: 'Success',
    message: 'Password reset successfully',
    token,
  });
});



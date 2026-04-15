const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/api-error');

//desc add address
//route POST /api/v1/addresses
//access private/ user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { addresses: req.body } },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'address added successfully',
    data: user.addresses,
  });
});

//desc remove address
//route DELETE /api/v1/addresses/:id
//access private/ user
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id, 'addresses._id': req.params.addressId },
    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true },
  );

  if (!user) {
    return next(new ApiError('Address not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully',
    data: user.addresses,
  });
});

//desc get logged user address
//route DELETE /api/v1/addresses
//access private/ user
exports.loggedUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.status(200).json({
    status: 'success',
    result: user.addresses.length,
    data: user.addresses,
  });
});

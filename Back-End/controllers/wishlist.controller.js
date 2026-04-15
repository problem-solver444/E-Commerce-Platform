const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/api-error');
//desc add product to wishlist
//route POST /api/v1/wishlists
//access private/ user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { wishlist: req.body.productId } },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist successfully',
    data: user,
  });
});

//desc remove product from wishlist
//route DELETE /api/v1/wishlists/:id
//access private/ user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id, wishlist: req.params.productId },
    { $pull: { wishlist: req.params.productId } },
    { new: true },
  );

  if (!user) {
    return next(new ApiError('Product not found in wishlist', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist successfully',
    data: user.wishlist,
  });
});

//desc get logged user wishlist
//route DELETE /api/v1/wishlists
//access private/ user
exports.loggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json({
    status: 'success',
    result: user.wishlist.length,
    data: user.wishlist,
  });
});

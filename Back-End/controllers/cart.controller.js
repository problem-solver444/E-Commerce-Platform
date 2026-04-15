const asyncHandler = require('express-async-handler');

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/api-error');
const Coupon = require('../models/coupon.model');
const calcPrice = (cart) => {
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  cart.totalPriceAfterDiscount = undefined;
};

//desc add product to cart
//route POST /api/v1/carts
//access private/ user
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError('Product not found', 404));

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        { product: productId, quantity, color, price: product.price },
      ],
      totalCartPrice: product.price * quantity,
    });
  } else {
    const existingProduct = cart.cartItems.find(
      (item) => item.product.toString() === productId && item.color === color,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.cartItems.push({
        product: productId,
        quantity,
        color,
        price: product.price,
      });
    }
    calcPrice(cart);
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//desc get Logged User cart
//route GET /api/v1/carts
//access private/ user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError('No Cart for Current User', 404));
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//desc delete specific Item from Cart
//route DELETE /api/v1/carts
//access private/ user
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true },
  );

  if (!cart) {
    return next(new ApiError('Cart not found', 404));
  }

  calcPrice(cart);

  await cart.save();

  return res.status(204).send();
});

//desc Clear Cart
//route DELETE /api/v1/carts
//access private/ user
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

//desc Update Quantity
//route UPDATE /api/v1/carts
//access private/ user
exports.updateCurrentItemQuantitiy = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError('There is no curt for current user ', 404));
  }

  const item = cart.cartItems.find(
    (item) => item._id.toString() === req.params.itemId,
  );
  if (item) {
    item.quantity = quantity;
  } else {
    return next(new ApiError('Item not found', 404));
  }

  calcPrice(cart);

  await cart.save();
  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//desc apply Coupon
//route UPDATE /api/v1/carts
//access private/ user

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expiresAt: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError('Invalid Coupon Name or Expired!', 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError('There is no curt for current user ', 404));
  }
  const sale = (100 - coupon.discount) / 100;
  cart.totalPriceAfterDiscount = sale * cart.totalCartPrice;
  await cart.save();
  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

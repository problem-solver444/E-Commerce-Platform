const asyncHandler = require('express-async-handler');

const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/api-error');
const Product = require('../models/product.model');
const factory = require('../utils/handler.factory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //SETTING APP
  const shippingPrice = 0;
  const taxPrice = 0;

  const cart = await Cart.findOne({ _id: req.params.cartId, user: req.user._id });
  if (!cart) {
    return next(new ApiError('No Cart For Current User', 404));
  }

  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;
  // create order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
    paymentMethod: 'cash',
  });

  //update stock
  const bulkOptions = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOptions);

  //delete cart
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({
    status: 'success',
    data: order,
  });
});

exports.filterAllOrders = asyncHandler(async (req, res, next) => {
  if (req.user.role == 'user') {
    req.filterObject = { user: req.user._id };
  }
  next();
});

exports.filterOrderByRole = asyncHandler(async (req, res, next) => {
  if (req.user.role == 'user') {
    req.filterObject = {
      _id: req.params.id,
      user: req.user._id,
    };
  }
  next();
});
//desc get all logged user orders
//route GET /api/v1/orders
//access private/User-Manger-Admin
exports.getAllLoggedUserOrders = factory.getAll(Order);

//desc get order by id
//route GET /api/v1/orders/:id
//access private/User-Manger-Admin
exports.getOrder = factory.getOne(Order);

//desc update order status to Paid
//route UPDATE /api/v1/orders/:id
//access private/Manger-Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError('No Order Found', 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();
  res.status(200).json({
    status: 'success',
    data: order,
  });
});

//desc update order status to isDelivered
//route UPDATE /api/v1/orders/:id
//access private/Manger-Admin
exports.updateOrderToDelevered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError('No Order Found', 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();
  res.status(200).json({
    status: 'success',
    data: order,
  });
});

//desc get check out session to stripe
//route UPDATE /api/v1/orders/:cartId/checkout
//access private/user
exports.getCheckOutSession = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;

  const cart = await Cart.findOne({ _id: req.params.cartId, user: req.user._id });
  if (!cart) {
    return next(new ApiError('No Cart For Current User', 404));
  }

  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
  {
    price_data: {
      currency: 'egp',
      product_data: {
        name: 'Order Payment',
      },
      unit_amount: totalOrderPrice * 100,
    },
    quantity: 1,
  },
],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/carts`,
    customer_email: req.user.email,
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

const Coupon = require('../models/coupon.model');
const factory = require('../utils/handler.factory');
const asyncHandler = require('express-async-handler');

//@ desc Get list of coupons
//@ route GET /api/v1/coupons
//@ access Private/Admin-Manger
exports.getCoupons = factory.getAll(Coupon);

//@ desc Get coupon by id
//@ route GET /api/v1/coupons/:id
//@ access Private/Admin-Manger

exports.getCoupon = factory.getOne(Coupon);

//@ desc Create new coupon
//@ route POST /api/v1/coupons
//@ access Private/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);

//@ desc Update Coupon by id
//@ route PUT /api/v1/Coupons/:id
//@ access Private/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);

//@ desc Delete Coupon by id
//@ route DELETE /api/v1/Coupons/:id
//@ access Private/Admin-Manger
exports.deleteCoupon = factory.deleteOne(Coupon);

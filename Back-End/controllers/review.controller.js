const Review = require('../models/review.model');
const factory = require('../utils/handler.factory');



// to filter reviews by product if productId is present in the request parameters
exports.createFilterObject = (req, res, next) => {
  const filterObject = req.params.productId ? { product: req.params.productId } : {};
  req.filterObject = filterObject;
  next();
};

//only for nested route (create reviews for specific product)
exports.setProductIdAndUserToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//@ desc Get list of reviews
//@ route GET /api/v1/reviews
//@ access Public
exports.getReviews = factory.getAll(Review);

//@ desc Get Review by id
//@ route GET /api/v1/reviews/:id
//@ access Public

exports.getReview = factory.getOne(Review);

//@ desc Create new Review  
//@ route POST /api/v1/reviews
//@ access Private/Admin-Manager
exports.createReview = factory.createOne(Review);

//@ desc Update Review by id
//@ route PUT /api/v1/reviews/:id
//@ access Private/Admin-Manager
exports.updateReview = factory.updateOne(Review);

//@ desc Delete Review by id
//@ route DELETE /api/v1/reviews/:id
//@ access Private/Admin-Manger
exports.deleteReview = factory.deleteOne(Review);

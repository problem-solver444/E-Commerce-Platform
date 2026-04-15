const mongoose = require('mongoose');
const Product = require('../models/product.model');
const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      required: [true, 'Review rating is required'],
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name',
  });
});

reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingsQuantitiy: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingsQuantitiy,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAvgRatingsAndQuantity(this.product);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.calcAvgRatingsAndQuantity(this.product); 
});

module.exports = mongoose.model('Review', reviewSchema);

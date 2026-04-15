const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coupon name is required'],
      unique: [true, 'Coupon must be unique'],
      trim: true,
      minlength: [3, 'Too short coupon name'],
      maxlength: [32, 'Too long coupon name'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount is required'],
      min: [1, 'Discount must be above or equal 1.0'],
      max: [100, 'Discount must be below or equal 100.0'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Coupon expiresAt is required'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Coupon', couponSchema);

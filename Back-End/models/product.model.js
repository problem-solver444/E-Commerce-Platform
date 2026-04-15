const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Too short product title'],
      maxlength: [100, 'Too long product title'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [20, 'Too short product description'],
      maxlength: [2000, 'Too long product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [200000, 'Too long product price'],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
      max: [200000, 'Too long product price after discount'],
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, 'Product image cover is required'],
    },
    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to category'],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }, 
  },
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

productSchema.pre(/^find/, async function () {
  this.populate({
    path: 'category',
    select: 'name',
  }).populate({ path: 'reviews' });
});

productSchema.post(/init|save/, (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    const images = [];
    doc.images.forEach((image) => {
      images.push(`${process.env.BASE_URL}/products/${image}`);
    });
    doc.images = images;
  }
});
module.exports = mongoose.model('Product', productSchema);

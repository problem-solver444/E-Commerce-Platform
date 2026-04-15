const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sub category name is required'],
      unique: [true, 'Sub category must be unique'],
      minlength: [2, 'Too short sub category name'],
      maxlength: [32, 'Too long sub category name']
    },
    slug: {
      type: String,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Sub category must belong to a category parent']
    }
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = subCategoryModel;
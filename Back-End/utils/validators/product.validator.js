const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator.middleware');
const categoryModel = require('../../models/category.model');
const subCategoryModel = require('../../models/subcategory.model');
const slugify = require('slugify');

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3 })
    .withMessage('Product must be at least 3 characters')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 20 })
    .withMessage('Too short product description')
    .isLength({ max: 2000 })
    .withMessage('Too long product description'),

  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),

  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 0, max: 200000 })
    .withMessage('Price must be a positive number up to 200,000')
    .toFloat(),

  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product price after discount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          'Product price after discount must be less than the original price',
        );
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Colors must be a non-empty array'),

  check('colors.*')
    .isString()
    .notEmpty()
    .withMessage('Each color must be a non-empty string'),

  check('images').optional().isArray().withMessage('Product images must be an array'),

  check('images.*').optional(),

  check('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isMongoId()
    .withMessage('Invalid product category id')
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`No Category Found for this id ${categoryId}`);
      }
      return true;
    }),

  check('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array')
    // Validate that each subcategory ID is a valid MongoDB ObjectId and exists in the database
    .custom(async (subcategories) => {
      const foundSubs = await subCategoryModel.find({
        _id: { $exists: true, $in: subcategories },
      });
      if (foundSubs.length < 1 || foundSubs.length < subcategories.length) {
        throw new Error('Invalid subcategories Ids ');
      }
    })
    // Validate that each subcategory belongs to the specified category
    .custom(async (subCategories, { req }) => {
      const subs = await subCategoryModel.find({ category: req.body.category });
      const subCategoriesInDB = subs.map((sub) => sub._id.toString());

      const flag = subCategories.every((sub) => subCategoriesInDB.includes(sub));
      if (!flag) {
        throw new Error('subcategories not belong to category ');
      }
    }),

  check('subcategories.*').optional().isMongoId().withMessage('Invalid subcategory id'),

  check('brand').optional().isMongoId().withMessage('Invalid brand id'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Product ratings average must be a number')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Product ratings average must be between 0 and 5'),

  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('Product ratings quantity must be a number'),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id format'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id format'),
  validatorMiddleware,
];
exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id format'),
  validatorMiddleware,
];

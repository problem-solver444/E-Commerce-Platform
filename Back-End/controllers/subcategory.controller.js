const SubCategory = require('../models/subcategory.model');
const factory = require('../utils/handler.factory');

// middleware to create filter object for getSubCategories controller,
// to filter subcategories by category if categoryId is present in the request parameters
exports.createFilterObject = (req, res, next) => {
  const filterObject = req.params.categoryId ? { category: req.params.categoryId } : {};
  req.filterObject = filterObject;
  next();
};

//only for nested route (create subcategory for specific category)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//@ desc Create new SubCategory
//@ route POST /api/v1/subcategories
//@ access Private/Admin-Manager
exports.createSubCategory = factory.createOne(SubCategory);

//@ desc Get list of subcategories
//@ route GET /api/v1/subcategories
//@ access Public
exports.getSubCategories = factory.getAll(SubCategory);

//@ desc Get subcategory by id
//@ route GET /api/v1/subcategories/:id
//@ access Public
exports.getSubCategory = factory.getOne(SubCategory);

//@ desc Update subcategory by id
//@ route PUT /api/v1/subcategories/:id
//@ access Private/Admin-Manager
exports.updateSubCategory = factory.updateOne(SubCategory);

//@ desc Delete subCategory by id
//@ route DELETE /api/v1/subcategories/:id
//@ access Private/Admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);

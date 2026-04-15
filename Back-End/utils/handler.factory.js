const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/api-error');
const ApiFeatures = require('../utils/api-features');

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }
    // trggier "remove" event when remove document
    await document.deleteOne();
    res.status(204).send();
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
    });
    if (!document) {
      return next(
        new ApiError(`No document found for this id ${req.params.id}`, 404),
      );
    }
    // trggier "save" event when update document
    await document.save();
    res.status(200).json({
      status: 'success',
      data: document,
    });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: document,
    });
  });

exports.getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const filter = req.filterObject || { _id: req.params.id };
    const document = await model.findOne(filter);
    if (!document) {
      return next(
        new ApiError(`No document found for this id ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: 'success',
      data: document,
    });
  });

exports.getAll = (model, modelName) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = { ...req.filterObject };
    }
    const Features = new ApiFeatures(model.find(filter), req.query);
    const doucmentsCount = await model.countDocuments(filter);
    Features.filter()
      .limitFields()
      .sort()
      .search(modelName)
      .paginate(doucmentsCount);

    // Execute
    const { mongooseQuery, paginateResult } = Features;
    const documents = await mongooseQuery;

    res.status(200).json({
      status: 'success',
      results: documents.length,
      paginateResult,
      data: documents,
    });
  });

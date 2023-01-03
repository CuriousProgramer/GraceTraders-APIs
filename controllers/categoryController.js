const Category = require('../models/category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    categories,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  if (!newCategory) return next(new AppError('Could not create the category'));
  res.status(201).json({
    status: 'success',
    message: 'Category added successfully',
    newCategory,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Category deleted',
  });
});

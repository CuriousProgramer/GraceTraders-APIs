const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/ApiFeatures');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query);
  features.filter().sort().paginate();
  const products = await features.query;
  if (!products) {
    return new AppError(('Could not not find products', 404));
  }
  // const products = await Product.find(req.query);
  res.status(200).json({
    status: 'success',
    results: products.length,
    products,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  if (!newProduct) return next(new AppError('Could not create the prouct'));
  res.status(201).json({
    status: 'success',
    message: 'Product added successfully',
    newProduct,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Product Found',
    product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: 'success',
    message: 'Product Updated Successfull',
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Product deleted',
  });
});

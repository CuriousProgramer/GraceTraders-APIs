const Supplier = require('../models/supplierModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllSuppliers = catchAsync(async (req, res, next) => {
  const suppliers = await Supplier.find();

  res.status(200).json({
    status: 'success',
    results: suppliers.length,
    suppliers,
  });
});

exports.createSupplier = catchAsync(async (req, res, next) => {
  const newSupplier = await Supplier.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Supplier added successfully',
    newSupplier,
  });
});

exports.getSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return next(new AppError('No supplier found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Supplier Found',
    supplier,
  });
});

exports.updateSupplier = catchAsync(async (req, res, next) => {
  const updatedSupplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedSupplier) {
    return next(new AppError('Could not update the supplier', 404));
  }
  res.status(201).json({
    status: 'success',
    message: 'Supplier Updated Successfully',
    updatedSupplier,
  });
});

exports.deleteSupplier = catchAsync(async (req, res, next) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Supplier deleted',
  });
});

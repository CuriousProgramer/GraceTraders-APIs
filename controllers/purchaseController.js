const Purchase = require('../models/purchasesModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/ApiFeatures');

exports.getAllPurchases = catchAsync(async (req, res, next) => {
  console.log(req.query);

  const purchases = await Purchase.find(req.query).populate('supplier', [
    'photo',
    'firstName',
    'lastName',
  ]);
  res.status(200).json({
    status: 'success',
    results: purchases.length,
    purchases,
  });
});

exports.createPurchase = catchAsync(async (req, res, next) => {
  const newPurchase = await Purchase.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Purchase record added successfully',
    newPurchase,
  });
});

exports.getPurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id).populate('supplier', [
    'photo',
    'firstName',
    'lastName',
  ]);
  if (!purchase) {
    return next(new AppError('No purchase found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Purchase Found',
    purchase,
  });
});

exports.updatePurchase = catchAsync(async (req, res, next) => {
  const updatedPurchase = await Purchase.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPurchase) {
    return next(new AppError('Could not update the purchase', 404));
  }
  res.status(201).json({
    status: 'success',
    message: 'Purchase Updated Successfull',
    updatedPurchase,
  });
});

exports.deletePurchase = catchAsync(async (req, res, next) => {
  await Purchase.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: 'success',
    message: 'Purchase record deleted',
  });
});

exports.getMonthlyPurchases = catchAsync(async (req, res, next) => {
  const arr = req.params.month_year.split('_');
  const month = arr[0];
  const year = arr[1];
  console.log('chec bro', month, year);
  const purchases = await Purchase.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPurchases: { $sum: '$totalPrice' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: purchases.length,
    purchases,
  });
});

exports.getRecentPurchases = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.aggregate([
    {
      $limit: 5,
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: purchases.length,
    purchases,
  });
});

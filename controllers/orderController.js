const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/ApiFeatures');
const sendEmail = require('../utils/email');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const features = new APIFeatures(Order.find(), req.query);
  features.filter().sort();
  const orders = await features.query;
  // const products = await Product.find(req.query);
  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.placeOrder = catchAsync(async (req, res, next) => {
  const products = req.body.products;
  for (let x of products) {
    const quantity = x.quantity;
    const productStock = x.stock;
    const id = x._id;
    const newStock = productStock - quantity;
    const newProduct = await Product.findByIdAndUpdate(
      { _id: id },
      { stock: newStock },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!newProduct) {
      return next(new AppError('Could not create the new Order'));
    }
    console.log('Product stock updated', newProduct);
  }

  ///If everything successfull then create new order
  const newOrder = await Order.create(req.body);
  // console.log(req.body.email);
  if (!newOrder) return next(new AppError('Could not create the new Order'));
  res.status(200).json({
    status: 'success',
    message: 'Order Placed Successfully',
    newOrder,
  });
  //Updating the stock of products
  // console.log(newOrder.products);
  // try{
  // for (let x of newOrder.products) {
  //   console.log('title is', x.title);
  //   const quantity = x.quantity;
  //   const id = x._id;
  //   // console.log(quantity, id, x.stock);
  //   const newStock = x.stock - quantity;
  //   const stockProduct = await Product.findByIdAndUpdate(
  //     { _id: id },
  //     { stock: newStock },
  //     {
  //       new: true,
  //       runValidators: true,
  //     }

  //   );

  // }}catch(err){
  //   console.log('Error creating order',err);

  // }
  ///If Every thing is ok then place the order

  //
  //
  //   console.log('id is', id);
  //   const stockProduct = await Product.find({ _id: id });
  //   console.log(
  //     `${quantity} will be subtracted from This product`,
  //     stockProduct.title
  //   );
  // });

  ///Send notification email
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'You order has been placed successfully',
      message: `Hi ${req.body.lastName}.Your order has been placed succeccfully. Thank you for your purchase .\n Your tracking id is ${newOrder.trackingId} incase of any problem you can contact our customer support./nThanks`,
    });
    console.log('Email sent');
  } catch (err) {
    console.log('Could not send email');
  }
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('No order found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Order Found',
    order,
  });
});

exports.getUserOrder = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  const features = new APIFeatures(
    Order.find({ userId: req.user._id }),
    req.query
  );
  features.filter().sort();
  const orders = await features.query;
  if (!orders) {
    return next(new AppError('No order found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Order Found',
    results: orders.length,
    orders,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const updatedorder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    message: 'Order Updated Successfully',
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Order deleted',
  });
});

exports.newOrders = catchAsync(async (req, res, next) => {
  const newOrders = await Order.aggregate([
    {
      $limit: 5,
    },
  ]);
  res.status(200).json({
    status: 'success',
    message: 'New Orders',
    results: newOrders.length,
    newOrders,
  });
});

exports.monthlySales = catchAsync(async (req, res, next) => {
  const arr = req.params.mon_ye.split('_');
  const month = arr[0];
  const year = arr[1];
  console.log(month, year);
  const sales = await Order.aggregate([
    {
      $match: {
        orderStatus: 'Delivered',
        // createdAt: {
        //   $gte: new Date(`${year}-${month}-01`),
        //   $lte: new Date(`${year}-${month}-31`),
        // },
      },
    },
    {
      $group: {
        _id: null,
        monthlySales: { $sum: '$orderTotalPrice' },
      },
    },
  ]);
  if (!sales) {
    return next(new AppError('Could not find monthly sales', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'monthly sales',
    sales,
  });
});

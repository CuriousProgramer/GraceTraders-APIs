const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// exports.getAllusers = catchAsync(async (req, res, next) => {
//   console.log(req.headers);

//   const users = await User.find();
//   res.status(500).json({
//     status: 'success',
//     message: 'Mil gye',
//     users,
//   });
// });

exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    message: 'Mil gye',
    users,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.user);

  if (req.body.password || req.body.passwordConfirmed || req.body.email) {
    return next(
      new AppError('You cannot update password or email on this route', 400)
    );
  }

  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
    userName: req.body.userName,
    photo: req.body.photo,
  };
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: 'success',
    user: null,
  });
});

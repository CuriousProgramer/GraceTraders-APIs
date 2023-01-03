const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  // };

  // if (process.env.NODE_ENV == 'production') cookieOptions.secure = true;

  // res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and check if it's there
  console.log('ye dekh', process.env.JWT_EXPIRES_IN);

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in please login to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded', decoded);

  //Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to token no longer exists', 401)
    );
  }

  //if user changed passwords after jwt was issued
  // if (freshUser.passwordChangedAfter(decoded.iat)) {
  //   return next(new AppError('User changed his password recently', 401));
  // }

  req.user = freshUser;
  next();
});

exports.userLoggedIn = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'You are logged in',
  });
});

exports.adminLoggedIn = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'You are logged in',
  });
});

exports.restrictTo = (...roles) => {
  console.log('admin is executed....', roles);
  return (req, res, next) => {
    //roles ['admin']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You dont have acces for this action', 403));
    }

    next();
  };
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

//Login
exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(process.env.JWT_EXPIRES_IN);
  if (!email || !password) {
    return next(new AppError('Plese provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Email or password', 404));
  }
  createSendToken(user, 200, res);
  // res.status(201).json({
  //   status: 'success',
  //   message: 'Success fully logged in',
  //   freshUser,
  // });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User with this email does not exist'));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/resetPassword/${resetToken}`;

  const resetURL = `http://localhost:3006/resetPassword/${resetToken}`;

  const message = `Forgot your password?\n Submit a Patch request with your new password and password confirm to: \n ${resetURL}. \n If you didt forgot your password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password is only valid for 10 min',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (err) {
    console.log(err);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 get user based on token
  console.log('Executing reset......');

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);
  //2 if token has not exppired and there is user set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //3 update password chanaged at property
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //4 log user in send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //if current passwordis correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  await user.save();

  createSendToken(user, 200, res);
});

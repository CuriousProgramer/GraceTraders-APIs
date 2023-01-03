const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp);
userRouter.route('/login').post(authController.login);
userRouter
  .route('/userLoggedIn')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    authController.userLoggedIn
  );

userRouter
  .route('/adminLoggedIn')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    authController.userLoggedIn
  );

userRouter.route('/forgotPassword').post(authController.forgotPassword);
userRouter.route('/resetPassword/:token').patch(authController.resetPassword);

userRouter
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

userRouter
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

userRouter
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

userRouter.route('/').get(userController.getAllusers);

module.exports = userRouter;

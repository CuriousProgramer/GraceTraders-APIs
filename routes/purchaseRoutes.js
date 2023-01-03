const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const authController = require('../controllers/authController');

const purchaseRouter = express.Router();

purchaseRouter.route('/').get(purchaseController.getAllPurchases).post(
  // authController.protect,
  // authController.restrictTo('admin'),
  purchaseController.createPurchase
);

purchaseRouter
  .route('/getMonthlyPurchases/:month_year')
  .get(purchaseController.getMonthlyPurchases);

purchaseRouter
  .route('/getRecentPurchases/')
  .get(purchaseController.getRecentPurchases);

purchaseRouter
  .route('/:id')
  .get(purchaseController.getPurchase)
  .patch(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase);

module.exports = purchaseRouter;

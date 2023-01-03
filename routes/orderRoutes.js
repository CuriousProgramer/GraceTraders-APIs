const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const orderRouter = express.Router();

orderRouter
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.placeOrder);

orderRouter
  .route('/getUserOrders')
  .get(authController.protect, orderController.getUserOrder);

orderRouter.route('/getMonthlySales/:mon_ye').get(orderController.monthlySales);

orderRouter.route('/getNewOrders').get(orderController.newOrders);

orderRouter
  .route('/:id')
  .get(orderController.getOrder)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.updateOrder
  )
  .delete(orderController.deleteOrder);

module.exports = orderRouter;

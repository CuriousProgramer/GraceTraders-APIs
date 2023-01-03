const express = require('express');
const supplierController = require('../controllers/supplierController');
const authController = require('../controllers/authController');

const supplierRouter = express.Router();

supplierRouter.route('/').get(supplierController.getAllSuppliers).post(
  // authController.protect,
  // authController.restrictTo('admin'),
  supplierController.createSupplier
);

supplierRouter
  .route('/:id')
  .get(supplierController.getSupplier)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

module.exports = supplierRouter;

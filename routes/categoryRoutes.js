const express = require('express');
const categoryController = require('../controllers/categoryController');

const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .get(
    // authController.protect,
    // authController.restrictTo('admin'),
    categoryController.getAllCategories
  )
  .post(categoryController.createCategory);

categoryRouter.route('/:id').delete(categoryController.deleteCategory);

module.exports = categoryRouter;

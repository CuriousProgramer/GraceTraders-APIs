const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, 'Product must have a stock'],
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Product must have a category'],
    },
    img: {
      type: String,
      required: [true, 'Product must have an image'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

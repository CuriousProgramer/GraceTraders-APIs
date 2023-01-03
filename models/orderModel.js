const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/my-react-img.appspot.com/o/test%2Fblank-profile-picture-g03c7ca96e_1280.png2c4daeb8-5dfc-403e-af37-02ac9e360aa7%20?alt=media&token=8e8f8eb9-4484-4853-b19c-238f5c76cf16',
    },
    products: {
      type: Array,
    },
    orderQuantity: {
      type: Number,
      required: [true, 'Order must have quantity'],
      default: 1,
    },
    orderTotalPrice: {
      type: Number,
      required: [true, 'Order must have total price'],
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    orderType: {
      type: String,
      enum: ['Online', 'Custom'],
      required: [true, 'An order must have Type'],
      default: 'Online',
    },
    // deliveryAddress: {
    //   type: S,
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  const randomId = `#${Math.floor(Math.random() * 1000000)}`;
  this.trackingId = randomId;
  console.log(this.trackingId);
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

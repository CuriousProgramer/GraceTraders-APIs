const mongoose = require('mongoose');
const purchasesSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.ObjectId,
      ref: 'Supplier',
      required: [true, 'Purcahse must have Supplier Id'],
    },
    material: {
      type: String,
      required: [true, 'Purchase must have material'],
    },
    totalPrice: {
      type: Number,
    },
    purchaseDate: {
      type: String,
    },

    unitPrice: {
      type: Number,
      required: [true, 'Purcahse must have a unit price'],
      min: [0, 'Unit price Cannot be less than zero'],
    },
    quantity: {
      type: Number,
      required: [true, 'Purchase must have quantity'],
      min: [0, 'Quantity Cannot be less than zero'],
    },
    paymentStatus: {
      type: String,
      required: [true, 'Purchase must have payment status'],
      enum: ['Pending', 'Approved'],
    },
    createdAt: {},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

purchasesSchema.pre('save', function (next) {
  console.log('purchase date is', this.purchaseDate);
  const d = new Date(`${this.purchaseDate}`);
  console.log('ISO date', d);
  this.createdAt = d;
  console.log(this);
  // const d = new Date(this.purchaseDate);
  // const day = d.toUTCString().split(' ')[1];
  // const month = d.toUTCString().split(' ')[2];
  // const year = d.toUTCString().split(' ')[3];
  // const purchaseDate = `${day} ${month} ${year}`;
  // this.purchaseDate = purchaseDate;
  // console.log(this.purchaseDate);
  // console.log(this.material);
  next();
});

purchasesSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  console.log(this.totalPrice);
  next();
});

const Purchase = mongoose.model('Purchase', purchasesSchema);

module.exports = Purchase;

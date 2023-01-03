const mongoose = require('mongoose');
const validator = require('validator');

const supplierSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Supplier must have firstname'],
  },
  lastName: {
    type: String,
    required: [true, 'Supplier must have lastname'],
  },
  email: {
    type: String,
    required: [true, 'Supplier must have email'],
    unique: true,
  },
  address: {
    type: String,
    required: [true, 'Supplier must have an address'],
  },
  phone: {
    type: String,
    required: [true, 'Supplier must have contact number'],
    unique: true,
  },
  active: {
    type: Boolean,
    required: [true, 'Supplier must have status'],
    default: true,
  },
  photo: {
    type: String,
    default:
      'https://firebasestorage.googleapis.com/v0/b/my-react-img.appspot.com/o/test%2Fblank-profile-picture-g03c7ca96e_1280.png2c4daeb8-5dfc-403e-af37-02ac9e360aa7%20?alt=media&token=8e8f8eb9-4484-4853-b19c-238f5c76cf16',
  },
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;

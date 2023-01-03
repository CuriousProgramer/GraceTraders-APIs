const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your firstname'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your lastname'],
  },
  userName: {
    type: String,
    required: [true, 'Please provide your name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default:
      'https://firebasestorage.googleapis.com/v0/b/my-react-img.appspot.com/o/test%2Fblank-profile-picture-g03c7ca96e_1280.png2c4daeb8-5dfc-403e-af37-02ac9e360aa7%20?alt=media&token=8e8f8eb9-4484-4853-b19c-238f5c76cf16',
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirmed: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
    validate: {
      //Works for save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords Do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },

  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log('ye dekh', { resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre('save', async function (next) {
  //If password is modified
  if (!this.isModified('password')) return next();
  //Whilecreateing document
  this.password = await bcrypt.hash(this.password, 12);

  //Delete password confirmed filed
  this.passwordConfirmed = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

// userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
//     console.log('ye dekh', changedAt, JWTTimestamp);
//     console.log(JWTTimestamp < changedAt);

//     return JWTTimestamp < changedAt;
//   }

//   return false;
// };

const User = mongoose.model('User', userSchema);
module.exports = User;

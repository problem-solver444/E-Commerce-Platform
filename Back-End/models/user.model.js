const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [3, 'Too short user name'],
      maxlength: [32, 'Too long user name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: [true, 'User email must be unique'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      trim: true,
      minlength: [6, 'Too short user password'],
      maxlength: [200, 'Too long user password'],
      select: false,
    },
    changedPasswordAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    profileImage: String,
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    addresses: [
      {
        id: mongoose.Schema.ObjectId,
        alias:String,
        details:String,
        city: String,
        state: String,
        country: String,
        pincode: String
      },
    ],
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.passwordResetCode;
    delete ret.passwordResetExpires;
    delete ret.passwordResetVerified;
    delete ret.__v;

    return ret;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});
module.exports = mongoose.model('User', userSchema);

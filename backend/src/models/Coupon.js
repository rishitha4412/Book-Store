import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required.'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
    },
    discountAmount: {
      type: Number,
      required: [true, 'Discount amount is required.'],
      min: [0, 'Discount amount cannot be negative.'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Coupon expiration date is required.'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxRedemptions: {
      type: Number,
      default: 100, // Limit maximum total redemptions
    },
    redemptionsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
couponSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Middleware: Standardize codes to uppercase
couponSchema.pre('save', function (next) {
  this.code = this.code.toUpperCase();
  next();
});

// Instance Method: Validate if coupon is active and unexpired
couponSchema.methods.isValid = function () {
  const isUnexpired = new Date() < this.expiresAt;
  const underLimit = this.maxRedemptions ? this.redemptionsCount < this.maxRedemptions : true;
  return this.isActive && isUnexpired && underLimit;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;

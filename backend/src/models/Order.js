import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user.'],
      index: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    paymentInfo: {
      id: { type: String, default: 'mock-payment-id' },
      status: { type: String, default: 'Pending' }, // e.g. Pending, Succeeded, Failed
      method: { type: String, default: 'COD' }, // e.g. Card, NetBanking, COD
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: [true, 'An order must have a total price.'],
    },
    couponUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
      index: true,
    },
    deliveredAt: Date,
    paidAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

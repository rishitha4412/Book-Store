import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user.'],
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    totalItems: {
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
cartSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Middleware: Automatically calculate totals before saving
cartSchema.pre('save', function (next) {
  let calculatedTotalPrice = 0;
  let calculatedTotalItems = 0;

  this.items.forEach((item) => {
    calculatedTotalPrice += item.price * item.quantity;
    calculatedTotalItems += item.quantity;
  });

  this.totalPrice = parseFloat(calculatedTotalPrice.toFixed(2));
  this.totalItems = calculatedTotalItems;
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

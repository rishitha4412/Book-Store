import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wishlist must belong to a user.'],
      unique: true, // One wishlist per user
      index: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
wishlistSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Review must belong to a book.'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    userName: {
      type: String,
      required: [true, 'Review must have a reviewer name.'],
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    company: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating.'],
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
    },
    comment: {
      type: String,
      required: [true, 'Review must contain comment text.'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
reviewSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Static Method: Compute rating average and review counts automatically
reviewSchema.statics.calcAverageRatings = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      reviewCount: stats[0].nRating,
      rating: parseFloat(stats[0].avgRating.toFixed(1)),
    });
  } else {
    // Reset if there are no reviews left
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      reviewCount: 0,
      rating: 0,
    });
  }
};

// Post hook on review creation/save
reviewSchema.post('save', function () {
  // Point to the constructor of the review model
  this.constructor.calcAverageRatings(this.book);
});

// Post hook on review updates or deletions
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.book);
  }
});

// Post hook on review deleteOne/remove if called on document
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calcAverageRatings(this.book);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

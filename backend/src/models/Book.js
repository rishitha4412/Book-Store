import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A book must have a title'],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, 'A book must have an author'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'A book must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: [true, 'A book must have a cover image URL'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'A book must have a description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A book must belong to a category name'],
      trim: true,
      index: true,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    genre: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: [true, 'A book must have a published date'],
    },
    pages: {
      type: Number,
      min: [1, 'A book must have at least 1 page'],
    },
    isbn: {
      type: String,
      required: [true, 'A book must have an ISBN number'],
      unique: true,
      trim: true,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Low Stock'],
      default: 'In Stock',
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    bestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    newArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    authorBio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
bookSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual property for computing final price after discount
bookSchema.virtual('discountedPrice').get(function () {
  if (this.discount > 0) {
    return parseFloat((this.price * (1 - this.discount / 100)).toFixed(2));
  }
  return this.price;
});

// Index compound text search on key textual attributes
bookSchema.index({
  title: 'text',
  author: 'text',
  genre: 'text',
  description: 'text',
  tags: 'text',
}, {
  weights: {
    title: 10,
    author: 5,
    tags: 3,
    genre: 2,
    description: 1,
  },
  name: 'BookTextSearchIndex',
});

const Book = mongoose.model('Book', bookSchema);
export default Book;

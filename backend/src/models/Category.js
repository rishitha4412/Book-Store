import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'A category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'A category must have a slug'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    cover: {
      type: String,
      required: [true, 'A category must have a cover image URL'],
    },
    count: {
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
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;

import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Address must belong to a user.'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name for the address.'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number.'],
      trim: true,
    },
    street: {
      type: String,
      required: [true, 'Please provide a street address.'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide a city.'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide a state/region.'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide a postal/zip code.'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide a country.'],
      default: 'India',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
addressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Address = mongoose.model('Address', addressSchema);
export default Address;

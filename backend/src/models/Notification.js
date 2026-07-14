import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to a user.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title.'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message.'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['order', 'coupon', 'system', 'auth'],
      default: 'system',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Map Mongo _id to virtual id for frontend integration
notificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

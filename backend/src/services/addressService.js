import Address from '../models/Address.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Retrieve all saved addresses for a user
export const getAddresses = async (userId) => {
  return await Address.find({ user: userId }).sort('-isDefault -createdAt');
};

// Create a new address profile card
export const createAddress = async (userId, addressData) => {
  // If this is set as default, clear default flags on other user addresses
  if (addressData.isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
  }

  const newAddress = new Address({
    ...addressData,
    user: userId,
  });

  await newAddress.save();
  return newAddress;
};

// Edit an existing address
export const updateAddress = async (userId, addressId, updateData) => {
  if (updateData.isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
  }

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedAddress) {
    throw new AppError('Address not found or unauthorized to update', HTTP_STATUS.NOT_FOUND);
  }

  return updatedAddress;
};

// Delete address card
export const deleteAddress = async (userId, addressId) => {
  const deletedAddress = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!deletedAddress) {
    throw new AppError('Address not found or unauthorized to delete', HTTP_STATUS.NOT_FOUND);
  }
  return deletedAddress;
};

import * as addressService from '../services/addressService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getAllAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddresses(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(req.user._id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Address saved successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const editAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(req.user._id, req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const removeAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddress(req.user._id, req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Address deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

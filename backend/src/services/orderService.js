import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Book from '../models/Book.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';
import logger from '../utils/logger.js';

// Process checkout, decrement book inventory, apply coupon limits, and clear cart
export const createCheckoutOrder = async (userId, checkoutData) => {
  const { shippingAddress, paymentInfo, couponCode } = checkoutData;

  // 1. Fetch user cart
  const cart = await Cart.findOne({ user: userId }).populate('items.book');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Your shopping cart is empty.', HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Setup transaction session (with fallback for standalone MongoDB instances)
  let session = null;
  let useTransaction = true;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (error) {
    useTransaction = false;
    if (session) {
      session.endSession();
      session = null;
    }
    logger.warn('MongoDB Transactions are not supported on this standalone server. Running checkout sequentially.');
  }

  try {
    const transactionOpts = useTransaction ? { session } : {};
    let discountPrice = 0.0;
    let coupon = null;

    // 3. Verify and Apply Coupon Code
    if (couponCode) {
      const formattedCode = couponCode.trim().toUpperCase();
      coupon = await Coupon.findOne({ code: formattedCode }).session(session);

      if (!coupon) {
        throw new AppError('Promotional coupon code not found', HTTP_STATUS.NOT_FOUND);
      }

      if (!coupon.isValid()) {
        throw new AppError('Promotional coupon has expired or is invalid', HTTP_STATUS.BAD_REQUEST);
      }

      // Calculate discount amount
      if (coupon.discountType === 'percentage') {
        discountPrice = parseFloat((cart.totalPrice * (coupon.discountAmount / 100)).toFixed(2));
      } else {
        discountPrice = Math.min(coupon.discountAmount, cart.totalPrice);
      }

      // Increment coupon redemptions count
      coupon.redemptionsCount += 1;
      await coupon.save(transactionOpts);
    }

    const orderItems = [];

    // 4. Validate stock and decrement inventory
    for (const item of cart.items) {
      const book = await Book.findById(item.book._id).session(session);
      if (!book) {
        throw new AppError(`Product not found: ${item.book.title}`, HTTP_STATUS.NOT_FOUND);
      }

      if (book.stock < item.quantity) {
        throw new AppError(`Insufficient inventory stock for book: "${book.title}". Available: ${book.stock}`, HTTP_STATUS.BAD_REQUEST);
      }

      // Decrement inventory stock
      book.stock -= item.quantity;
      book.inStock = book.stock > 0;
      book.stockStatus = book.stock === 0 ? 'Out of Stock' : (book.stock < 5 ? 'Low Stock' : 'In Stock');
      await book.save(transactionOpts);

      // Add item to checkout snapshot list
      orderItems.push({
        book: book._id,
        title: book.title,
        coverImage: book.coverImage,
        quantity: item.quantity,
        price: item.discount > 0 ? parseFloat((book.price * (1 - book.discount / 100)).toFixed(2)) : book.price,
      });
    }

    // 5. Calculate Final Order pricing
    const taxPrice = parseFloat((cart.totalPrice * 0.05).toFixed(2)); // 5% VAT
    const shippingPrice = cart.totalPrice > 35 ? 0.0 : 4.99; // Free shipping over $35
    const totalPrice = parseFloat((cart.totalPrice + taxPrice + shippingPrice - discountPrice).toFixed(2));

    // 6. Create Order document
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentInfo: paymentInfo || { id: 'mock-payment-id', status: 'Pending', method: 'COD' },
      taxPrice,
      shippingPrice,
      discountPrice,
      totalPrice: Math.max(0, totalPrice),
      couponUsed: coupon ? coupon._id : undefined,
      paidAt: paymentInfo?.status === 'Succeeded' ? Date.now() : undefined,
    });

    await order.save(transactionOpts);

    // 7. Clear Shopping Cart
    cart.items = [];
    cart.totalPrice = 0.0;
    cart.totalItems = 0;
    await cart.save(transactionOpts);

    // 8. Add system notification
    await Notification.create([{
      user: userId,
      title: 'Order Placed!',
      message: `Your order has been recorded successfully under Ref: ${order._id}.`,
      type: 'order',
    }], transactionOpts);

    // Commit transaction if active
    if (useTransaction && session) {
      await session.commitTransaction();
      session.endSession();
    }

    return order;
  } catch (error) {
    // Abort transaction and rollback changes on exceptions
    if (useTransaction && session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

// Retrieve order history for a user
export const getMyOrders = async (userId) => {
  return await Order.find({ user: userId }).sort('-createdAt');
};

// Retrieve details for a single order (checks ownership/admin permissions)
export const getOrderDetails = async (userId, userRole, orderId) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure only order owner or system administrator can query order
  if (userRole !== 'admin' && order.user._id.toString() !== userId.toString()) {
    throw new AppError('Access denied. You do not own this order.', HTTP_STATUS.FORBIDDEN);
  }

  return order;
};

// Get invoice metadata
export const getOrderInvoice = async (userId, userRole, orderId) => {
  const order = await getOrderDetails(userId, userRole, orderId);

  return {
    invoiceNumber: `INV-${order._id.toString().substring(18).toUpperCase()}`,
    orderId: order._id,
    date: order.createdAt,
    customer: {
      name: order.user.name,
      email: order.user.email,
    },
    shippingAddress: order.shippingAddress,
    items: order.orderItems,
    pricing: {
      subtotal: parseFloat((order.totalPrice - order.taxPrice - order.shippingPrice + order.discountPrice).toFixed(2)),
      tax: order.taxPrice,
      shipping: order.shippingPrice,
      discount: order.discountPrice,
      total: order.totalPrice,
    },
    payment: order.paymentInfo,
  };
};

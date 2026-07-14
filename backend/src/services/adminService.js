import Order from '../models/Order.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Calculate sales KPI metrics and monthly progress totals
export const getDashboardStats = async () => {
  // 1. Calculate total revenue from non-cancelled orders
  const revenueAggregation = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueAggregation.length > 0 ? parseFloat(revenueAggregation[0].total.toFixed(2)) : 0.0;

  // 2. Count totals
  const totalOrders = await Order.countDocuments({});
  const totalBooks = await Book.countDocuments({});
  const totalUsers = await User.countDocuments({ role: 'customer' });

  // 3. Aggregate sales by month for line charts
  const salesHistory = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const formattedHistory = salesHistory.map((item) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: parseFloat(item.revenue.toFixed(2)),
      orders: item.orders,
    };
  });

  return {
    kpis: {
      totalRevenue,
      totalOrders,
      totalBooks,
      totalUsers,
    },
    salesHistory: formattedHistory,
  };
};

// Compile stock levels and low-inventory notices
export const getInventoryStatus = async () => {
  const books = await Book.find({}).select('title author category stock stockStatus price').lean();

  const outOfStockCount = books.filter((b) => b.stock === 0).length;
  const lowStockCount = books.filter((b) => b.stock > 0 && b.stock < 5).length;
  const totalStockItems = books.reduce((sum, b) => sum + b.stock, 0);

  // Group stock count by category
  const categoryStock = {};
  books.forEach((b) => {
    categoryStock[b.category] = (categoryStock[b.category] || 0) + b.stock;
  });

  const categoryStockFormatted = Object.keys(categoryStock).map((cat) => ({
    category: cat,
    stock: categoryStock[cat],
  }));

  return {
    summary: {
      totalStockItems,
      outOfStockCount,
      lowStockCount,
    },
    categoryStock: categoryStockFormatted,
    items: books.map((b) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      category: b.category,
      stock: b.stock,
      status: b.stock === 0 ? 'Out of Stock' : (b.stock < 5 ? 'Low Stock' : 'In Stock'),
      price: b.price,
    })),
  };
};

// Aggregate sales records filtered by category and book popularity
export const getSalesReport = async () => {
  // Aggregate sales by category type
  const categorySales = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'Cancelled' } } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'books',
        localField: 'orderItems.book',
        foreignField: '_id',
        as: 'bookInfo',
      },
    },
    { $unwind: '$bookInfo' },
    {
      $group: {
        _id: '$bookInfo.category',
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        itemsSold: { $sum: '$orderItems.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Aggregate top selling books
  const bookSales = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'Cancelled' } } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.book',
        title: { $first: '$orderItems.title' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        unitsSold: { $sum: '$orderItems.quantity' },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
  ]);

  return {
    categorySales: categorySales.map((c) => ({
      category: c._id,
      revenue: parseFloat(c.revenue.toFixed(2)),
      unitsSold: c.itemsSold,
    })),
    topSellingBooks: bookSales.map((b) => ({
      bookId: b._id,
      title: b.title,
      revenue: parseFloat(b.revenue.toFixed(2)),
      unitsSold: b.unitsSold,
    })),
  };
};

// Update status of client orders and issue tracking updates
export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid order status supplied', HTTP_STATUS.BAD_REQUEST);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
  }

  order.orderStatus = status;

  if (status === 'Delivered') {
    order.deliveredAt = Date.now();
  }
  
  if (status === 'Shipped') {
    order.paidAt = order.paidAt || Date.now(); // Mark as paid on shipping if Cash on Delivery (COD)
  }

  await order.save();

  // Create client notification
  await Notification.create({
    user: order.user,
    title: 'Order Status Update',
    message: `Your order Ref: ${order._id} status has been updated to "${status}".`,
    type: 'order',
  });

  return order;
};

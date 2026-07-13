import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiShoppingBag, FiSettings, FiCalendar, FiBox, 
  FiCheckCircle, FiChevronDown, FiChevronUp, FiMapPin, FiCreditCard 
} from 'react-icons/fi';
import { MOCK_ORDERS } from '../utils/mockData';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Processing' | 'Delivered'
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Load orders
  useEffect(() => {
    const saved = localStorage.getItem('bookstore_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem('bookstore_orders', JSON.stringify(MOCK_ORDERS));
    }
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'All') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">My Orders</h1>
        <p className="text-text-muted mt-1">Review transaction receipts, shipment tracking, and download bills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 glassmorphism border border-border-main rounded-2xl p-6 h-fit space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiUser /> Dashboard
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiUser /> Profile
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/5 transition-all">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiSettings /> Settings
          </Link>
        </aside>

        {/* Orders Log */}
        <main className="md:col-span-3 space-y-6">
          
          {/* Status filters */}
          <div className="flex gap-2 border-b border-border-main/50 pb-4 text-xs font-bold">
            {['All', 'Processing', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  filter === status
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'bg-bg-surface text-text-muted hover:text-text-main border border-border-main'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-bg-surface border border-border-main rounded-2xl">
                <p className="text-sm text-text-muted">No orders found in this status category.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <div 
                    key={order.id} 
                    className="bg-bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm transition-all"
                  >
                    
                    {/* Order header summary card */}
                    <div 
                      onClick={() => toggleExpand(order.id)}
                      className="bg-bg-app border-b border-border-main p-4 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-bg-app/80 transition-colors"
                    >
                      <div className="flex gap-6">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-text-muted">Order Placed</p>
                          <p className="text-xs font-semibold text-text-main flex items-center gap-1.5 mt-0.5">
                            <FiCalendar className="w-3.5 h-3.5 text-primary" /> {order.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-text-muted">Total</p>
                          <p className="text-xs font-bold text-text-main mt-0.5">${order.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-text-muted">Order ID</p>
                          <p className="text-xs font-bold text-primary mt-0.5">{order.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {order.status === 'Delivered' ? <FiCheckCircle className="w-3 h-3" /> : <FiBox className="w-3 h-3 animate-pulse" />}
                          {order.status}
                        </span>
                        {isExpanded ? <FiChevronUp className="text-text-muted" /> : <FiChevronDown className="text-text-muted" />}
                      </div>
                    </div>

                    {/* Expandable detailed content section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 divide-y divide-border-main/40 space-y-4">
                            {/* Product list */}
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <img src={item.coverImage} alt={item.title} className="w-10 aspect-[3/4] rounded-md object-cover border border-border-main/30 bg-bg-app" />
                                    <div>
                                      <Link to={`/books/${item.id}`} className="font-bold text-text-main text-xs sm:text-sm hover:text-primary transition-colors">
                                        {item.title}
                                      </Link>
                                      <p className="text-[10px] text-text-muted mt-0.5">Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                                    </div>
                                  </div>
                                  <span className="font-extrabold text-xs text-text-main">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Billing & Address specifications */}
                            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted bg-bg-app/10 rounded-xl p-3 mt-4 border border-border-main/30">
                              <p className="flex items-center gap-1.5 leading-relaxed">
                                <FiMapPin className="text-primary shrink-0" /> 
                                <span>Shipping Address: <strong className="text-text-main font-semibold">{order.shippingAddress}</strong></span>
                              </p>
                              <p className="flex items-center gap-1.5 leading-relaxed">
                                <FiCreditCard className="text-primary shrink-0" />
                                <span>Payment Method: <strong className="text-text-main font-semibold">{order.paymentMethod}</strong></span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

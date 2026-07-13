import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiShoppingBag, FiLayers } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  // Redirect to browse if accessed directly without completing checkout
  if (!location.state?.orderId) {
    // We allow demo access but let's default to generating a mock orderId above rather than crashing
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glassmorphism border border-border-main p-8 sm:p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>

        <div className="inline-flex p-4 bg-green-500/10 text-green-500 rounded-full mb-6">
          <FiCheckCircle className="w-16 h-16" />
        </div>

        <h2 className="text-3xl font-extrabold text-text-main tracking-tight leading-none mb-3">
          Order Placed!
        </h2>
        <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto leading-relaxed">
          Thank you for your purchase. We are processing your request. You will receive invoice receipts shortly via email.
        </p>

        {/* Order Info Badge */}
        <div className="p-4 bg-bg-app border border-border-main rounded-2xl mb-8 space-y-1">
          <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Order ID Reference</p>
          <p className="text-lg font-black text-primary uppercase">{orderId}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <FiLayers /> Track in My Orders
          </Link>
          <Link
            to="/books"
            className="w-full border border-border-main hover:bg-bg-app text-text-main font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <FiShoppingBag /> Continue Shopping <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

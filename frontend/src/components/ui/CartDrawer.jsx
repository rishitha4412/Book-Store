import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag, FiTrash2, FiArrowRight, FiTag, FiPercent } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartDiscount,
    cartTax, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="absolute inset-0 bg-black backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-bg-surface border-l border-border-main flex flex-col justify-between shadow-2xl h-full"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-main/50 flex items-center justify-between">
                <span className="font-extrabold text-lg text-text-main flex items-center gap-2">
                  <FiShoppingBag className="text-primary" /> Shopping Cart
                  {cartItems.length > 0 && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-2 border border-border-main rounded-xl text-text-muted hover:text-text-main hover:bg-bg-app transition-all cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                    <div className="p-5 bg-primary/10 text-primary rounded-3xl mb-4">
                      <FiShoppingBag className="w-12 h-12" />
                    </div>
                    <h3 className="font-extrabold text-base text-text-main">Cart is empty</h3>
                    <p className="text-xs text-text-muted mt-1 max-w-[200px]">
                      Your items will show up here once added.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate('/books');
                      }}
                      className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      Browse Books
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-bg-app/40 border border-border-main/40 p-3 rounded-2xl relative"
                    >
                      <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden shrink-0 border border-border-main/50 bg-bg-app">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between pr-4">
                        <div>
                          <h4 className="font-bold text-sm text-text-main truncate leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-text-muted mt-0.5">{item.author}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-sm text-text-main">
                            ${item.price.toFixed(2)}
                          </span>
                          
                          {/* Quantity selectors */}
                          <div className="flex items-center border border-border-main rounded-lg p-0.5 bg-bg-surface shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-bg-app rounded-md transition-colors text-text-main cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-text-main">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-bg-app rounded-md transition-colors text-text-main cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-3 right-3 text-text-muted hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Summary and Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-border-main bg-bg-app/20 space-y-4">
                  {/* Coupon Form */}
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Promo code (DEV15)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-bg-surface border border-border-main rounded-xl text-xs text-text-main focus:outline-none focus:border-primary uppercase font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs font-semibold text-green-700 dark:text-green-400">
                      <span className="flex items-center gap-1.5"><FiPercent className="w-4 h-4" /> Coupon "{appliedCoupon.code}" Applied</span>
                      <button 
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-600 font-extrabold uppercase text-[10px] tracking-wider cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Calculations breakdown */}
                  <div className="space-y-2 text-xs border-b border-border-main/50 pb-4">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal</span>
                      <span className="font-semibold text-text-main">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount</span>
                        <span>-${cartDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-text-muted">
                      <span>Sales Tax (8%)</span>
                      <span className="font-semibold text-text-main">${cartTax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-extrabold text-sm text-text-main">Total Amount</span>
                    <span className="text-xl font-extrabold text-primary">${cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    Proceed to Checkout <FiArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}

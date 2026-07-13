import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTax, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 text-center">
        <div className="inline-flex p-5 bg-primary/10 text-primary rounded-3xl mb-6">
          <FiShoppingBag className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-main mb-2">Your Cart is Empty</h2>
        <p className="text-text-muted mb-8 max-w-sm">
          Looks like you haven't added any books to your cart yet. Discover your next favorite read today!
        </p>
        <Link
          to="/books"
          className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 flex items-center gap-2"
        >
          <FiArrowLeft /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-text-main mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 sm:gap-6 bg-bg-surface border border-border-main p-4 sm:p-5 rounded-2xl shadow-sm"
            >
              {/* Cover */}
              <div className="w-20 sm:w-24 aspect-[3/4] rounded-lg overflow-hidden shrink-0 border border-border-main/40 bg-bg-app">
                <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
              </div>

              {/* Title & info */}
              <div className="flex-1 min-w-0">
                <Link to={`/books/${item.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-text-main truncate text-sm sm:text-base">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-text-muted mt-0.5">{item.author}</p>
                <p className="font-extrabold text-sm sm:text-base mt-2 text-text-main">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity selectors */}
              <div className="flex items-center border border-border-main rounded-xl p-0.5 bg-bg-app shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold hover:bg-bg-surface rounded-lg transition-colors text-text-main"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-xs sm:text-sm text-text-main">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold hover:bg-bg-surface rounded-lg transition-colors text-text-main"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-text-muted hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors shrink-0"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary panel */}
        <div className="lg:col-span-4 glassmorphism border border-border-main rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-extrabold text-lg mb-6 text-text-main">Order Summary</h2>

          <div className="space-y-4 text-sm mb-6 border-b border-border-main/60 pb-6">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-text-main">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Estimated Sales Tax</span>
              <span className="font-semibold text-text-main">${cartTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Shipping</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mb-8">
            <span className="font-extrabold text-text-main">Total</span>
            <span className="text-2xl font-extrabold text-primary">${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              navigate('/checkout');
            }}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Proceed to Checkout <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiSettings, FiHeart, FiClock, FiDollarSign, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { MOCK_ORDERS } from '../utils/mockData';
import { bookService } from '../services/bookService';

export default function DashboardPage() {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Load orders and recommendations
  useEffect(() => {
    const saved = localStorage.getItem('bookstore_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem('bookstore_orders', JSON.stringify(MOCK_ORDERS));
    }

    // Load recommendations
    const loadRecs = async () => {
      try {
        const featured = await bookService.getFeaturedBooks() || [];
        setRecommendations(featured.slice(0, 3));
      } catch (err) {
        console.error("Error loading recommendations", err);
      }
    };
    loadRecs();
  }, []);

  const totalSpent = orders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Dashboard</h1>
        <p className="text-text-muted mt-1">Manage your account parameters, order histories, and recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 glassmorphism border border-border-main rounded-2xl p-6 h-fit space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/5 transition-all">
            <FiUser /> Dashboard
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiUser /> Profile
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiSettings /> Settings
          </Link>
        </aside>

        {/* Main panels */}
        <main className="md:col-span-3 space-y-8">
          
          {/* Welcome profile badge */}
          {user && (
            <div className="bg-bg-surface border border-border-main rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-border-main" />
              <div>
                <h2 className="text-xl font-extrabold text-text-main">Hello, {user.name}!</h2>
                <p className="text-sm text-text-muted mt-0.5">{user.email}</p>
                <p className="text-xs text-primary font-bold mt-2 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md w-fit">
                  {user.role} Account
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bg-surface border border-border-main p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <FiShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold">Total Orders</p>
                <p className="text-2xl font-black text-text-main">{orders.length}</p>
              </div>
            </div>

            <div className="bg-bg-surface border border-border-main p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                <FiHeart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold">Saved Items</p>
                <p className="text-2xl font-black text-text-main">{wishlistItems.length}</p>
              </div>
            </div>

            <div className="bg-bg-surface border border-border-main p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold">Total Spent</p>
                <p className="text-2xl font-black text-text-main">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Recent Orders section */}
          <div className="bg-bg-surface border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg text-text-main">Recent Activity</h3>
              <Link to="/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View all orders <FiClock />
              </Link>
            </div>
            
            {orders.length === 0 ? (
              <p className="text-xs text-text-muted py-2">No orders placed yet.</p>
            ) : (
              <div className="divide-y divide-border-main/50">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <p className="font-bold text-sm text-text-main">{order.id}</p>
                      <p className="text-xs text-text-muted mt-0.5">{order.date}</p>
                    </div>
                    <div>
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-text-main">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Books Grid */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-text-main flex items-center gap-2">
              <FiBookOpen className="text-primary" /> Handpicked Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.map(book => (
                <div key={book.id} className="bg-bg-surface border border-border-main rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-bg-app border border-border-main/40 mb-3">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-text-main truncate leading-tight">{book.title}</h4>
                    <p className="text-[10px] text-text-muted mt-0.5 truncate">{book.author}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-main/50">
                      <span className="font-extrabold text-xs text-text-main">${book.price.toFixed(2)}</span>
                      <Link to={`/books/${book.id}`} className="text-[10px] font-bold text-primary hover:underline">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

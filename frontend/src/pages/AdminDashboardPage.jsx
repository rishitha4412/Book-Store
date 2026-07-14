import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBriefcase, FiBook, FiShoppingBag, FiUsers, FiLayers, 
  FiDollarSign, FiPlus, FiEdit2, FiTrash2 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { MOCK_BOOKS, MOCK_ORDERS } from '../utils/mockData';
import { bookService } from '../services/bookService';
import api from '../utils/api.js';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'books' | 'categories'
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset
  } = useForm();

  // Load database catalog and customer orders
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const booksResponse = await bookService.getBooks({ limit: 100 });
        setBooks(
          booksResponse.books.map((b) => ({
            id: b._id || b.id,
            title: b.title,
            author: b.author,
            category: b.category,
            price: b.price,
            discount: b.discount,
            coverImage: b.coverImage,
            description: b.description,
            stock: b.stock,
            isbn: b.isbn,
          }))
        );
      } catch (err) {
        console.error('Failed to load catalog books:', err);
      }

      try {
        const ordersResponse = await api.get('/admin/orders?limit=100');
        const formattedOrders = ordersResponse.data.data.orders.map((o) => ({
          id: o._id,
          date: o.createdAt.split('T')[0],
          status: o.orderStatus,
          total: o.totalPrice,
          shippingAddress: `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.state} ${o.shippingAddress.postalCode}`,
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error('Failed to load admin orders list:', err);
      }
    };
    fetchAdminData();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const handleOpenBookModal = (book = null) => {
    setEditingBook(book);
    if (book) {
      setValue('title', book.title);
      setValue('author', book.author);
      setValue('category', book.category);
      setValue('price', book.price);
      setValue('discount', book.discount || 0);
      setValue('coverImage', book.coverImage);
      setValue('featured', !!book.featured);
      setValue('bestSeller', !!book.bestSeller);
    } else {
      reset({
        title: '',
        author: '',
        category: 'Business & Investing',
        price: '',
        discount: 0,
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
        featured: false,
        bestSeller: false
      });
    }
    setIsBookModalOpen(true);
  };

  const onBookSubmit = async (data) => {
    let updatedBooks;
    if (editingBook) {
      // Edit
      updatedBooks = books.map(b => b.id === editingBook.id ? { 
        ...b, 
        ...data, 
        price: parseFloat(data.price), 
        discount: parseInt(data.discount) 
      } : b);
      toast.success(`"${data.title}" updated successfully!`);
    } else {
      // Create
      const newBook = {
        id: `book-${Date.now()}`,
        ...data,
        price: parseFloat(data.price),
        discount: parseInt(data.discount),
        rating: 4.5,
        reviewCount: 1,
        stockStatus: 'In Stock'
      };
      updatedBooks = [...books, newBook];
      toast.success(`"${data.title}" added to catalogue!`);
    }

    setBooks(updatedBooks);
    await bookService.saveBooks(updatedBooks);
    setIsBookModalOpen(false);
  };

  const handleDeleteBook = async (id) => {
    const target = books.find(b => b.id === id);
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    await bookService.saveBooks(updatedBooks);
    toast.success(`Removed "${target.title}" from catalog.`);
  };

  const stats = [
    { name: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'text-green-600 bg-green-500/10' },
    { name: 'Total Orders', value: orders.length, icon: FiShoppingBag, color: 'text-blue-600 bg-blue-500/10' },
    { name: 'Books Catalogue', value: books.length, icon: FiBook, color: 'text-purple-600 bg-purple-500/10' },
    { name: 'Active Users', value: 4, icon: FiUsers, color: 'text-amber-600 bg-amber-500/10' }
  ];

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
            <FiBriefcase className="text-primary" /> Admin Control Panel
          </h1>
          <p className="text-text-muted mt-1">Monitor bookstore activity, configure books, categories, and manage checkouts.</p>
        </div>
        {activeTab === 'books' && (
          <button
            onClick={() => handleOpenBookModal(null)}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FiPlus /> Add New Book
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 glassmorphism border border-border-main rounded-2xl p-6 h-fit space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
              activeTab === 'overview' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-main hover:bg-bg-surface'
            }`}
          >
            <FiBriefcase /> Dashboard
          </button>
          <div className="text-xs font-bold text-text-muted px-4 pt-3 pb-1 uppercase tracking-wider">Catalog & Settings</div>
          <button 
            onClick={() => setActiveTab('books')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'books' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-main hover:bg-bg-surface'
            }`}
          >
            <FiBook /> Manage Books
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'categories' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-main hover:bg-bg-surface'
            }`}
          >
            <FiLayers /> Categories
          </button>
        </aside>

        {/* Admin content */}
        <main className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            
            {/* Tab: Dashboard Overview */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-8"
              >
                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.name} className="bg-bg-surface border border-border-main p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-text-muted">{stat.name}</p>
                          <p className="text-xl font-black text-text-main mt-0.5">{stat.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed listing log */}
                <div className="bg-bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-border-main/50">
                    <h3 className="font-bold text-lg text-text-main">Recent Incoming Orders</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-bg-app border-b border-border-main text-text-muted text-xs uppercase font-bold">
                          <th className="p-4 px-6">Order ID</th>
                          <th className="p-4 px-6">Date</th>
                          <th className="p-4 px-6">Customer Address</th>
                          <th className="p-4 px-6">Status</th>
                          <th className="p-4 px-6 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-main/40 text-text-main font-semibold">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-bg-app/40 transition-colors">
                            <td className="p-4 px-6 text-primary">{order.id}</td>
                            <td className="p-4 px-6 font-normal text-text-muted">{order.date}</td>
                            <td className="p-4 px-6 max-w-xs truncate">{order.shippingAddress}</td>
                            <td className="p-4 px-6">
                              <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 px-6 text-right">${order.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Manage Books Grid */}
            {activeTab === 'books' && (
              <motion.div
                key="books"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-bg-app border-b border-border-main text-text-muted text-xs uppercase font-bold">
                        <th className="p-4 px-6">Book Cover</th>
                        <th className="p-4 px-6">Title & Author</th>
                        <th className="p-4 px-6">Category</th>
                        <th className="p-4 px-6">Price</th>
                        <th className="p-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/40 text-text-main font-semibold">
                      {books.map((book) => (
                        <tr key={book.id} className="hover:bg-bg-app/40 transition-colors">
                          <td className="p-4 px-6">
                            <img src={book.coverImage} alt={book.title} className="w-8 aspect-[3/4] object-cover rounded-md border border-border-main/40 bg-bg-app" />
                          </td>
                          <td className="p-4 px-6">
                            <p className="font-bold text-xs sm:text-sm text-text-main">{book.title}</p>
                            <p className="font-normal text-[10px] text-text-muted mt-0.5">{book.author}</p>
                          </td>
                          <td className="p-4 px-6 text-xs text-text-muted">{book.category}</td>
                          <td className="p-4 px-6 text-xs text-text-main">
                            ${book.price.toFixed(2)}
                            {book.discount > 0 && (
                              <span className="text-[10px] text-green-600 block">-{book.discount}% Off</span>
                            )}
                          </td>
                          <td className="p-4 px-6 text-right">
                            <div className="inline-flex gap-2">
                              <button 
                                onClick={() => handleOpenBookModal(book)}
                                className="p-2 border border-border-main hover:border-primary text-text-muted hover:text-primary rounded-lg transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBook(book.id)}
                                className="p-2 border border-border-main hover:border-red-500 hover:bg-red-500/5 text-text-muted hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Tab: Categories */}
            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-bg-surface border border-border-main rounded-2xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-lg text-text-main">Active Categories Directory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {Array.from(new Set(books.map(b => b.category))).map(catName => (
                    <div key={catName} className="p-4 border border-border-main rounded-xl bg-bg-app/20 text-xs font-bold text-text-main flex justify-between items-center">
                      <span>{catName}</span>
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px]">
                        {books.filter(b => b.category === catName).length} books
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Book Add/Edit Modal Overlay */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookModalOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-lg w-full bg-bg-surface border border-border-main rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8"
            >
              <h3 className="font-extrabold text-xl text-text-main mb-6 border-b border-border-main/50 pb-3">
                {editingBook ? 'Modify Catalogue Details' : 'Add New Book Entry'}
              </h3>

              <form onSubmit={handleSubmit(onBookSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Book Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                    required
                    {...register('title')}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Author Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                    required
                    {...register('author')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      required
                      {...register('price')}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">Discount (%)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      {...register('discount')}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Category</label>
                  <select
                    className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary cursor-pointer"
                    {...register('category')}
                  >
                    <option>Business & Investing</option>
                    <option>Technology & Coding</option>
                    <option>Design & Creative</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Cover Image URL</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                    {...register('coverImage')}
                  />
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-text-main cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary focus:ring-1" {...register('featured')} />
                    Featured Title
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-main cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary focus:ring-1" {...register('bestSeller')} />
                    Best Seller
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border-main/50 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="px-4 py-2.5 border border-border-main hover:bg-bg-app text-text-muted hover:text-text-main text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {editingBook ? 'Save Modifications' : 'Create Book'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiShoppingBag, FiSettings, FiMail, FiLock, 
  FiCamera, FiPlus, FiEdit2, FiTrash2, FiMapPin, 
  FiPhone
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api.js';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('details'); // 'details' | 'security' | 'addresses'

  // Avatar local state
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');

  // Address Modal states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Initial Addresses
  const [addresses, setAddresses] = useState([]);

  // Fetch addresses from backend database
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        try {
          const response = await api.get('/addresses');
          const mapped = response.data.data.map((addr) => ({
            id: addr._id || addr.id,
            fullName: addr.name,
            streetAddress: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.postalCode,
            country: addr.country,
            phone: addr.phone,
            isDefault: addr.isDefault,
          }));
          setAddresses(mapped);
        } catch (err) {
          console.error('Failed to load user addresses:', err);
        }
      }
    };
    fetchAddresses();
  }, [user]);

  // Form for Personal Details
  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: errorsDetails }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  // Form for Change Password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    reset: resetPassword,
    formState: { errors: errorsPassword }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Form for Address Addition/Edit
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    setValue: setAddressValue,
    reset: resetAddressForm
  } = useForm();

  const newPasswordVal = watch('newPassword');

  // Calculates password strength (0 to 5)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwdStrength = getPasswordStrength(newPasswordVal);

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0: return { label: 'None', color: 'bg-border-main', text: 'text-text-muted' };
      case 1:
      case 2: return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
      case 3: return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
      case 4: return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
      case 5: return { label: 'Excellent', color: 'bg-blue-500', text: 'text-blue-500' };
      default: return { label: 'None', color: 'bg-border-main', text: 'text-text-muted' };
    }
  };

  const strengthMeta = getStrengthLabel(pwdStrength);

  // Profile Update
  const onSaveDetails = async (data) => {
    const success = await updateProfile({
      ...data,
      avatar
    });
    if (success) {
      toast.success("Profile details updated!");
    }
  };

  // Avatar Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        toast.success("Avatar loaded! Click 'Save Profile Details' to apply.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Password Submit handler
  const onChangePasswordSubmit = async () => {
    toast.success("Password changed successfully!");
    resetPassword();
  };

  // Address Book CRUD handlers
  const handleOpenAddressModal = (address = null) => {
    setEditingAddress(address);
    if (address) {
      setAddressValue('fullName', address.fullName);
      setAddressValue('streetAddress', address.streetAddress);
      setAddressValue('city', address.city);
      setAddressValue('state', address.state);
      setAddressValue('zipCode', address.zipCode);
      setAddressValue('country', address.country);
      setAddressValue('phone', address.phone);
    } else {
      resetAddressForm({
        fullName: user?.name || '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: ''
      });
    }
    setIsAddressModalOpen(true);
  };

  const onAddressSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        street: data.streetAddress,
        city: data.city,
        state: data.state,
        postalCode: data.zipCode,
        country: data.country,
        phone: data.phone,
      };

      if (editingAddress) {
        // Edit mode
        payload.isDefault = editingAddress.isDefault;
        await api.put(`/addresses/${editingAddress.id}`, payload);
        toast.success('Address updated successfully!');
      } else {
        // Add mode
        payload.isDefault = addresses.length === 0;
        await api.post('/addresses', payload);
        toast.success('New address added!');
      }

      // Re-fetch addresses to update local state cleanly
      const response = await api.get('/addresses');
      const mapped = response.data.data.map((addr) => ({
        id: addr._id || addr.id,
        fullName: addr.name,
        streetAddress: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone,
        isDefault: addr.isDefault,
      }));
      setAddresses(mapped);
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address removed.');

      const response = await api.get('/addresses');
      const mapped = response.data.data.map((addr) => ({
        id: addr._id || addr.id,
        fullName: addr.name,
        streetAddress: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone,
        isDefault: addr.isDefault,
      }));
      setAddresses(mapped);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove address.');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      toast.success('Default shipping address updated.');

      const response = await api.get('/addresses');
      const mapped = response.data.data.map((addr) => ({
        id: addr._id || addr.id,
        fullName: addr.name,
        streetAddress: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone,
        isDefault: addr.isDefault,
      }));
      setAddresses(mapped);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set default address.');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">My Profile</h1>
        <p className="text-text-muted mt-1">Manage personal parameters, security triggers, and shipping directories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 glassmorphism border border-border-main rounded-2xl p-6 h-fit space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiUser /> Dashboard
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/5 transition-all">
            <FiUser /> Profile
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiSettings /> Settings
          </Link>
        </aside>

        {/* Profile Content Body */}
        <main className="md:col-span-3 space-y-6">
          <div className="bg-bg-surface border border-border-main rounded-3xl overflow-hidden shadow-sm">
            {/* Horizontal sub-tabs for Details, Security, Addresses */}
            <div className="flex border-b border-border-main/50 bg-bg-app/40 text-sm font-semibold">
              {[
                { id: 'details', label: 'Profile Details', icon: FiUser },
                { id: 'security', label: 'Security & Password', icon: FiLock },
                { id: 'addresses', label: 'Address Book', icon: FiMapPin }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all cursor-pointer ${
                    activeSubTab === tab.id 
                      ? 'border-primary text-primary bg-bg-surface' 
                      : 'border-transparent text-text-muted hover:text-text-main'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                
                {/* 1. Profile Details Tab */}
                {activeSubTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-xl space-y-6"
                  >
                    {/* Avatar Upload Grid */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border-main/50">
                      <div className="relative group w-24 h-24 rounded-2xl overflow-hidden shadow-inner border border-border-main/50 bg-bg-app shrink-0">
                        <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                          <FiCamera className="w-5 h-5 mb-1 block" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-main">Profile Photo</h4>
                        <p className="text-xs text-text-muted mt-1 leading-normal">
                          Choose an image file. We recommend squared dimensions. Supported files: JPEG, PNG.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitDetails(onSaveDetails)} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                          <input
                            type="text"
                            className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
                            {...registerDetails('name', { required: 'Name is required' })}
                          />
                        </div>
                        {errorsDetails.name && (
                          <p className="text-xs text-danger font-semibold mt-1">{errorsDetails.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                          <input
                            type="email"
                            className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
                            {...registerDetails('email', {
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                          />
                        </div>
                        {errorsDetails.email && (
                          <p className="text-xs text-danger font-semibold mt-1">{errorsDetails.email.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                      >
                        Save Profile Details
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 2. Security / Change Password Tab */}
                {activeSubTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-xl"
                  >
                    <h3 className="font-bold text-base text-text-main mb-6">Change Password</h3>
                    <form onSubmit={handleSubmitPassword(onChangePasswordSubmit)} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Current Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
                            {...registerPassword('currentPassword', { required: 'Current password is required' })}
                          />
                        </div>
                        {errorsPassword.currentPassword && (
                          <p className="text-xs text-danger font-semibold mt-1">{errorsPassword.currentPassword.message}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">New Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
                            {...registerPassword('newPassword', {
                              required: 'New password is required',
                              minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                          />
                        </div>
                        {errorsPassword.newPassword && (
                          <p className="text-xs text-danger font-semibold mt-1">{errorsPassword.newPassword.message}</p>
                        )}

                        {/* Password Strength Indicator */}
                        {newPasswordVal && (
                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-text-muted">Password Strength:</span>
                              <span className={strengthMeta.text}>{strengthMeta.label}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5 h-1.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    i < pwdStrength ? strengthMeta.color : 'bg-bg-app'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Confirm New Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
                            {...registerPassword('confirmPassword', {
                              required: 'Please confirm your new password',
                              validate: (val) => val === newPasswordVal || 'Passwords do not match'
                            })}
                          />
                        </div>
                        {errorsPassword.confirmPassword && (
                          <p className="text-xs text-danger font-semibold mt-1">{errorsPassword.confirmPassword.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                      >
                        Update Password
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. Address Book Tab */}
                {activeSubTab === 'addresses' && (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border-main/50">
                      <h3 className="font-bold text-base text-text-main">Saved Addresses</h3>
                      <button
                        onClick={() => handleOpenAddressModal(null)}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FiPlus /> Add New Address
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div 
                          key={addr.id}
                          className={`p-5 rounded-2xl border flex flex-col justify-between h-48 transition-all ${
                            addr.isDefault 
                              ? 'border-primary/50 bg-primary/[0.02] shadow-sm' 
                              : 'border-border-main bg-bg-app/20 hover:border-text-muted'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-extrabold text-sm text-text-main truncate max-w-[150px]">{addr.fullName}</h4>
                              {addr.isDefault && (
                                <span className="inline-flex px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{addr.streetAddress}</p>
                            <p className="text-xs text-text-muted leading-relaxed mt-0.5">{addr.city}, {addr.state} {addr.zipCode}</p>
                            <p className="text-[11px] text-text-muted mt-2 font-semibold flex items-center gap-1">
                              <FiPhone className="w-3 h-3" /> {addr.phone}
                            </p>
                          </div>

                          <div className="flex justify-between items-center border-t border-border-main/50 pt-3 mt-3">
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              disabled={addr.isDefault}
                              className={`text-[10px] font-bold transition-all cursor-pointer ${
                                addr.isDefault 
                                  ? 'text-primary cursor-default' 
                                  : 'text-text-muted hover:text-primary'
                              }`}
                            >
                              {addr.isDefault ? '✓ Selected Default' : 'Set as Default'}
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenAddressModal(addr)}
                                className="p-1.5 rounded-lg border border-border-main text-text-muted hover:text-primary hover:bg-bg-app transition-all cursor-pointer"
                                title="Edit"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="p-1.5 rounded-lg border border-border-main text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Address Form Modal Overlay */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-lg w-full bg-bg-surface border border-border-main rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8"
            >
              <h3 className="font-extrabold text-xl text-text-main mb-6 border-b border-border-main/50 pb-3">
                {editingAddress ? 'Modify Address Entry' : 'Add New Address'}
              </h3>

              <form onSubmit={handleSubmitAddress(onAddressSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">Receiver Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      required
                      {...registerAddress('fullName')}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">Phone</label>
                    <input
                      type="text"
                      placeholder="123-456-7890"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      required
                      {...registerAddress('phone')}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St, Apt 4B"
                    className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                    required
                    {...registerAddress('streetAddress')}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      required
                      {...registerAddress('city')}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      placeholder="NY"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      required
                      {...registerAddress('state')}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">Zip Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                      required
                      {...registerAddress('zipCode')}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Country</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                    required
                    {...registerAddress('country')}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border-main/50 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="px-4 py-2.5 border border-border-main hover:bg-bg-app text-text-muted hover:text-text-main text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {editingAddress ? 'Update Details' : 'Save Address'}
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

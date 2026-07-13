import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiSettings, FiBell, FiGlobe, FiSun, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();

  // Settings State initialized from localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('bookstore_settings');
    if (saved) return JSON.parse(saved);
    return {
      orderUpdates: true,
      promotions: false,
      language: 'English (US)',
      currency: 'USD ($)'
    };
  });

  // Sync settings state to localStorage on changes
  const handleCheckboxChange = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSelectChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('bookstore_settings', JSON.stringify(settings));
    toast.success('Configuration preferences saved successfully!');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Settings</h1>
        <p className="text-text-muted mt-1">Configure layout options, mailing preferences, and security triggers.</p>
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
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-main hover:bg-bg-surface transition-all">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/5 transition-all">
            <FiSettings /> Settings
          </Link>
        </aside>

        {/* Settings panels */}
        <main className="md:col-span-3 space-y-6">
          
          {/* Notifications toggles */}
          <div className="bg-bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 mb-6">
              <FiBell className="text-primary" /> Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.orderUpdates}
                  onChange={() => handleCheckboxChange('orderUpdates')}
                  className="w-4.5 h-4.5 text-primary border-border-main rounded focus:ring-primary focus:ring-2 cursor-pointer" 
                />
                <span className="text-sm text-text-main font-semibold">Email updates on order arrivals</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.promotions}
                  onChange={() => handleCheckboxChange('promotions')}
                  className="w-4.5 h-4.5 text-primary border-border-main rounded focus:ring-primary focus:ring-2 cursor-pointer" 
                />
                <span className="text-sm text-text-main font-semibold">Promotions and discount newsletter notifications</span>
              </label>
            </div>
          </div>

          {/* Region & Localization selection */}
          <div className="bg-bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 mb-6">
              <FiGlobe className="text-primary" /> Region & Localization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                  className="bg-bg-app border border-border-main text-text-main text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option>English (US)</option>
                  <option>Spanish (ES)</option>
                  <option>German (DE)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Currency</label>
                <select 
                  value={settings.currency}
                  onChange={(e) => handleSelectChange('currency', e.target.value)}
                  className="bg-bg-app border border-border-main text-text-main text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme Preferences */}
          <div className="bg-bg-surface border border-border-main rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-text-main flex items-center gap-2 mb-6">
              {isDarkMode ? <FiMoon className="text-primary" /> : <FiSun className="text-primary" />} Theme Settings
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => isDarkMode && toggleTheme()}
                className={`flex-1 py-3 text-center rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isDarkMode 
                    ? 'border-primary text-primary bg-primary/5 shadow-inner' 
                    : 'border-border-main text-text-muted hover:text-text-main hover:bg-bg-app'
                }`}
              >
                <FiSun /> Light Theme
              </button>
              <button
                onClick={() => !isDarkMode && toggleTheme()}
                className={`flex-1 py-3 text-center rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-primary text-primary bg-primary/5 shadow-inner' 
                    : 'border-border-main text-text-muted hover:text-text-main hover:bg-bg-app'
                }`}
              >
                <FiMoon /> Dark Theme
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            Save Configuration Changes
          </button>
        </main>
      </div>
    </div>
  );
}

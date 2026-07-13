import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center glassmorphism border border-border-main p-10 rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl mb-6">
          <FiAlertCircle className="w-12 h-12 animate-pulse" />
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight text-text-main mb-2">404</h1>
        <h2 className="text-2xl font-bold text-text-main mb-4">Page Not Found</h2>
        <p className="text-text-muted mb-8">
          The page you are looking for doesn't exist, was removed, or is temporarily unavailable. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-border-main hover:bg-bg-surface text-text-main font-semibold px-5 py-3 rounded-xl transition-all duration-300"
          >
            <FiArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-primary/15 transition-all duration-300"
          >
            <FiHome className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

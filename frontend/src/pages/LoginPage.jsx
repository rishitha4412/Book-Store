import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    const userObj = await login(data.email, data.password);
    if (userObj) {
      if (userObj.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 gradient-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glassmorphism border border-border-main p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
            <FiBookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main">
            Welcome Back
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Sign in to manage your library and checkout books
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-main uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-11 pr-4 py-3 bg-bg-app border rounded-xl text-sm text-text-main focus:outline-none transition-colors ${
                  errors.email ? 'border-danger focus:border-danger' : 'border-border-main focus:border-primary'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger font-semibold mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 bg-bg-app border rounded-xl text-sm text-text-main focus:outline-none transition-colors ${
                  errors.password ? 'border-danger focus:border-danger' : 'border-border-main focus:border-primary'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-danger font-semibold mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer helper */}
        <p className="text-center text-sm text-text-muted mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

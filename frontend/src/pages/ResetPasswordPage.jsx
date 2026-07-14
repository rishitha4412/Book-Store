import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, data.password);
      setSuccess(true);
      toast.success('Password updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.';
      toast.error(message);
    } finally {
      setLoading(false);
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

        {!success ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main">
                Reset Password
              </h2>
              <p className="text-sm text-text-muted mt-2">
                Set a secure new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main uppercase tracking-wider">New Password</label>
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 bg-bg-app border rounded-xl text-sm text-text-main focus:outline-none transition-colors ${
                      errors.confirmPassword ? 'border-danger focus:border-danger' : 'border-border-main focus:border-primary'
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === newPassword || 'Passwords do not match'
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-danger font-semibold mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex p-4 bg-green-500/10 text-green-500 rounded-full mb-6">
              <FiCheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-3">Password Reset Complete</h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed">
              Your password has been successfully updated. You can now log in using your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

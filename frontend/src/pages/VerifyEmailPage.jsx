import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);

  // Handles 30-sec countdown for Resend button
  useEffect(() => {
    let interval = null;
    if (isResendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, resendTimer]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow numbers only
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Shift focus forward if value is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Shift focus backward on backspace if value is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    setIsResendDisabled(true);
    setResendTimer(30);
    toast.success("Verification code resent to your email!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Premium micro-delay
    setLoading(false);
    
    // In our mock, code '123456' or any 6-digit input is accepted for demo convenience
    toast.success("Email verified successfully! Welcome to BookHaven.");
    navigate('/');
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

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
            <FiMail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main">
            Verify Your Email
          </h2>
          <p className="text-sm text-text-muted mt-2">
            We've sent a 6-digit verification code to your registered email address. Enter it below to activate your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center bg-bg-app border border-border-main rounded-xl text-lg font-bold text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-text-muted">Didn't receive the code? </span>
          <button
            onClick={handleResend}
            disabled={isResendDisabled}
            className={`font-semibold transition-colors cursor-pointer ${
              isResendDisabled ? 'text-text-muted cursor-not-allowed' : 'text-primary hover:underline'
            }`}
          >
            {isResendDisabled ? `Resend in ${resendTimer}s` : 'Resend Code'}
          </button>
        </div>

        <div className="mt-8 text-center border-t border-border-main/50 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer bg-transparent border-0"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

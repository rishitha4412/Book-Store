import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight, 
  FiArrowLeft, FiShoppingBag, FiInfo
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cartItems, 
    cartSubtotal, 
    cartDiscount, 
    cartTax, 
    cartTotal, 
    appliedCoupon,
    clearCart 
  } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'apple'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handlers
  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    setValue: setShippingValue,
    formState: { errors: errorsShipping }
  } = useForm();

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: errorsPayment }
  } = useForm({
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardName: user?.name || ''
    }
  });

  // Load addresses from database on mount
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/books');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await api.get('/addresses');
        const addrList = response.data.data.map((addr) => ({
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

        setAddresses(addrList);

        const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          // Pre-fill shipping form fields
          setShippingValue('fullName', defaultAddr.fullName);
          setShippingValue('streetAddress', defaultAddr.streetAddress);
          setShippingValue('city', defaultAddr.city);
          setShippingValue('state', defaultAddr.state);
          setShippingValue('zipCode', defaultAddr.zipCode);
          setShippingValue('country', defaultAddr.country);
          setShippingValue('phone', defaultAddr.phone);
        }
      } catch (err) {
        console.error('Failed to load checkout addresses:', err);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [cartItems, navigate, user, setShippingValue]);

  const handleAddressSelect = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      // Clear form for custom input
      setShippingValue('fullName', '');
      setShippingValue('streetAddress', '');
      setShippingValue('city', '');
      setShippingValue('state', '');
      setShippingValue('zipCode', '');
      setShippingValue('phone', '');
    } else {
      const addr = addresses.find(a => a.id === addrId);
      if (addr) {
        setShippingValue('fullName', addr.fullName);
        setShippingValue('streetAddress', addr.streetAddress);
        setShippingValue('city', addr.city);
        setShippingValue('state', addr.state);
        setShippingValue('zipCode', addr.zipCode);
        setShippingValue('country', addr.country);
        setShippingValue('phone', addr.phone);
      }
    }
  };

  // Step submissions
  const onShippingSubmit = (data) => {
    // If it's a new address, save it to the local state so we can display it in Review
    if (selectedAddressId === 'new') {
      const tempId = `temp-addr-${Date.now()}`;
      const newAddr = { id: tempId, ...data, isDefault: false };
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddressId(tempId);
    }
    setStep(2);
  };

  const onPaymentSubmit = () => {
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || {};
      
      const payload = {
        shippingAddress: {
          name: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.zipCode,
          country: selectedAddress.country,
        },
        paymentInfo: {
          id: `pay_mock_${Date.now().toString().substring(8)}`,
          status: 'Succeeded',
          method: paymentMethod === 'card' ? 'Card' : paymentMethod === 'paypal' ? 'PayPal' : 'ApplePay',
        },
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      };

      const response = await api.post('/orders', payload);
      const createdOrder = response.data.data;

      await clearCart();
      setIsSubmitting(false);
      navigate('/checkout-success', { state: { orderId: createdOrder._id } });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit order.';
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const currentAddress = addresses.find(a => a.id === selectedAddressId) || {};

  return (
    <div className="min-h-screen pt-24 pb-16 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Indicators */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-text-muted">
            <span className={`flex items-center gap-1 cursor-pointer transition-colors ${step >= 1 ? 'text-primary' : ''}`} onClick={() => step > 1 && setStep(1)}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-primary bg-primary/10' : 'border-border-main'}`}>1</span> Shipping
            </span>
            <FiChevronRight className="w-4 h-4 text-border-main" />
            <span className={`flex items-center gap-1 cursor-pointer transition-colors ${step >= 2 ? 'text-primary' : ''}`} onClick={() => step > 2 && setStep(2)}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-primary bg-primary/10' : 'border-border-main'}`}>2</span> Payment
            </span>
            <FiChevronRight className="w-4 h-4 text-border-main" />
            <span className={`flex items-center gap-1 transition-colors ${step === 3 ? 'text-primary' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 3 ? 'border-primary bg-primary/10' : 'border-border-main'}`}>3</span> Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Step content Panel */}
          <main className="lg:col-span-8 bg-bg-surface border border-border-main rounded-3xl p-6 sm:p-8 shadow-sm">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-text-main flex items-center gap-2">
                    <FiMapPin className="text-primary" /> Delivery Shipping Details
                  </h2>

                  {/* Saved addresses picker */}
                  {addresses.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Saved Address</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {addresses.map(addr => (
                          <div
                            key={addr.id}
                            onClick={() => handleAddressSelect(addr.id)}
                            className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                              selectedAddressId === addr.id
                                ? 'border-primary bg-primary/[0.01]'
                                : 'border-border-main hover:border-text-muted'
                            }`}
                          >
                            <h4 className="font-bold text-xs text-text-main">{addr.fullName}</h4>
                            <p className="text-[11px] text-text-muted mt-1 truncate">{addr.streetAddress}</p>
                            <p className="text-[11px] text-text-muted">{addr.city}, {addr.state} {addr.zipCode}</p>
                          </div>
                        ))}
                        <div
                          onClick={() => handleAddressSelect('new')}
                          className={`p-4 rounded-xl border-2 border-dashed text-center flex flex-col justify-center items-center cursor-pointer transition-all ${
                            selectedAddressId === 'new'
                              ? 'border-primary bg-primary/[0.01]'
                              : 'border-border-main hover:border-text-muted'
                          }`}
                        >
                          <span className="font-extrabold text-xs text-text-main">Custom/New Address</span>
                          <p className="text-[10px] text-text-muted mt-1">Enter a different shipping address</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Form */}
                  <form onSubmit={handleSubmitShipping(onShippingSubmit)} className="space-y-4 pt-4 border-t border-border-main/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                          {...registerShipping('fullName', { required: 'Name is required' })}
                        />
                        {errorsShipping.fullName && <p className="text-xs text-danger">{errorsShipping.fullName.message}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Phone</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                          {...registerShipping('phone', { required: 'Phone is required' })}
                        />
                        {errorsShipping.phone && <p className="text-xs text-danger">{errorsShipping.phone.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-main uppercase tracking-wider">Street Address</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                        {...registerShipping('streetAddress', { required: 'Address is required' })}
                      />
                      {errorsShipping.streetAddress && <p className="text-xs text-danger">{errorsShipping.streetAddress.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">City</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                          {...registerShipping('city', { required: 'City is required' })}
                        />
                        {errorsShipping.city && <p className="text-xs text-danger">{errorsShipping.city.message}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">State</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                          {...registerShipping('state', { required: 'State is required' })}
                        />
                        {errorsShipping.state && <p className="text-xs text-danger">{errorsShipping.state.message}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">Zip Code</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                          {...registerShipping('zipCode', { required: 'Zip is required' })}
                        />
                        {errorsShipping.zipCode && <p className="text-xs text-danger">{errorsShipping.zipCode.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text-main uppercase tracking-wider">Country</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                        defaultValue="United States"
                        {...registerShipping('country', { required: 'Country is required' })}
                      />
                      {errorsShipping.country && <p className="text-xs text-danger">{errorsShipping.country.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Continue to Payment <FiChevronRight />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Payment Details */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-text-main flex items-center gap-2">
                    <FiCreditCard className="text-primary" /> Select Payment Method
                  </h2>

                  {/* Payment selector tabs */}
                  <div className="flex border border-border-main rounded-2xl overflow-hidden text-xs font-bold bg-bg-app">
                    {[
                      { id: 'card', label: 'Credit Card' },
                      { id: 'paypal', label: 'PayPal' },
                      { id: 'apple', label: 'Apple Pay' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                          paymentMethod === method.id 
                            ? 'bg-bg-surface text-primary border-b-2 border-primary' 
                            : 'text-text-muted hover:text-text-main'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {paymentMethod === 'card' && (
                      <motion.form
                        key="card-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onSubmit={handleSubmitPayment(onPaymentSubmit)}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-main uppercase tracking-wider">Cardholder Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                            {...registerPayment('cardName', { required: 'Name is required' })}
                          />
                          {errorsPayment.cardName && <p className="text-xs text-danger">{errorsPayment.cardName.message}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-main uppercase tracking-wider">Card Number</label>
                          <input
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                            {...registerPayment('cardNumber', { 
                              required: 'Card number is required',
                              pattern: { value: /^[0-9\s]{16,19}$/, message: 'Invalid card number format' }
                            })}
                          />
                          {errorsPayment.cardNumber && <p className="text-xs text-danger">{errorsPayment.cardNumber.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-text-main uppercase tracking-wider">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                              {...registerPayment('expiry', { required: 'Expiry is required' })}
                            />
                            {errorsPayment.expiry && <p className="text-xs text-danger">{errorsPayment.expiry.message}</p>}
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-text-main uppercase tracking-wider">CVV Code</label>
                            <input
                              type="password"
                              placeholder="•••"
                              maxLength="3"
                              className="w-full px-4 py-2.5 bg-bg-app border border-border-main rounded-xl text-sm text-text-main focus:outline-none focus:border-primary"
                              {...registerPayment('cvv', { required: 'CVV is required' })}
                            />
                            {errorsPayment.cvv && <p className="text-xs text-danger">{errorsPayment.cvv.message}</p>}
                          </div>
                        </div>

                        <div className="pt-4 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-5 py-3 border border-border-main text-text-muted hover:text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <FiArrowLeft /> Back
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            Review Order <FiChevronRight />
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {paymentMethod !== 'card' && (
                      <motion.div
                        key="mock-payment"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="py-6 text-center space-y-4"
                      >
                        <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full">
                          <FiInfo className="w-8 h-8" />
                        </div>
                        <h3 className="font-extrabold text-sm text-text-main">
                          Selected {paymentMethod === 'paypal' ? 'PayPal Checkout' : 'Apple Pay Wallet'}
                        </h3>
                        <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                          Clicking review will proceed with your saved sandbox authorization credentials.
                        </p>
                        <div className="pt-4 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-5 py-3 border border-border-main text-text-muted hover:text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <FiArrowLeft /> Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            Review Order <FiChevronRight />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Step 3: Review & Place Order */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-text-main flex items-center gap-2">
                    <FiCheckCircle className="text-primary" /> Review Final Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border-main/50">
                    <div className="p-4 bg-bg-app/40 border border-border-main/50 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Shipping Address</p>
                      <p className="font-bold text-xs text-text-main mt-1.5">{currentAddress.fullName}</p>
                      <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">{currentAddress.streetAddress}</p>
                      <p className="text-[11px] text-text-muted leading-relaxed">{currentAddress.city}, {currentAddress.state} {currentAddress.zipCode}</p>
                    </div>

                    <div className="p-4 bg-bg-app/40 border border-border-main/50 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Payment Details</p>
                      <p className="font-bold text-xs text-text-main mt-1.5 uppercase">
                        {paymentMethod === 'card' ? 'Credit Card (•••• 1024)' : paymentMethod === 'paypal' ? 'PayPal Gateway' : 'Apple Pay Wallet'}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">Billing Address: Same as shipping</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Checkout Items</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-bg-app/20 border border-border-main/30 rounded-xl">
                          <img src={item.coverImage} alt={item.title} className="w-8 aspect-[3/4] rounded-md object-cover border border-border-main/30" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-text-main truncate">{item.title}</h4>
                            <p className="text-[10px] text-text-muted">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <span className="font-bold text-xs text-text-main">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border-main/50 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 border border-border-main text-text-muted hover:text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FiArrowLeft /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Confirm & Place Order'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* Right Summary Panel */}
          <aside className="lg:col-span-4 glassmorphism border border-border-main rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-base text-text-main mb-6 flex items-center gap-2">
              <FiShoppingBag /> Order Summary
            </h3>

            <div className="space-y-3.5 text-xs pb-6 border-b border-border-main/50">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-text-main">${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-muted">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-text-main">${cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-6">
              <span className="font-extrabold text-sm text-text-main">Total Amount</span>
              <span className="text-xl font-extrabold text-primary">${cartTotal.toFixed(2)}</span>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

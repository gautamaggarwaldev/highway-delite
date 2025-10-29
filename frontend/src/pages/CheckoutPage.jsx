import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { experience, booking } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    promoCode: '',
    agreeTerms: false
  });

  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if no booking data
  if (!experience || !booking) {
    navigate('/');
    return null;
  }

  const calculateFinalTotal = () => {
    const discount = promoApplied?.discount || 0;
    return {
      subtotal: booking.subtotal,
      taxes: booking.taxes,
      discount,
      total: booking.total - discount
    };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms and safety policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      setLoading(true);
      setPromoError('');
      
      const response = await axios.post(`${API_URL}/promo/validate`, {
        code: formData.promoCode,
        subtotal: booking.subtotal
      });

      setPromoApplied(response.data.data);
      setPromoError('');
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Invalid promo code');
      setPromoApplied(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const finalTotal = calculateFinalTotal();

      const bookingData = {
        experienceId: experience.id,
        userName: formData.fullName,
        userEmail: formData.email,
        userPhone: formData.phone,
        date: booking.date,
        time: booking.time,
        quantity: booking.quantity,
        price: experience.price,
        subtotal: finalTotal.subtotal,
        taxes: finalTotal.taxes,
        discount: finalTotal.discount,
        promoCode: promoApplied?.code || null,
        total: finalTotal.total
      };

      const response = await axios.post(`${API_URL}/bookings`, bookingData);

      navigate('/result', {
        state: {
          success: true,
          bookingRef: response.data.data.bookingRef,
          booking: response.data.data.booking
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      navigate('/result', {
        state: {
          success: false,
          message: error.response?.data?.message || 'Booking failed. Please try again.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = calculateFinalTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Checkout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Full Name and Email */}
            <div className="bg-gray-100 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className={`w-full px-4 py-2.5 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.fullName ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className={`w-full px-4 py-2.5 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.email ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  className={`w-full px-4 py-2.5 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.phone ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2.5 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={loading || !formData.promoCode.trim()}
                    className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-600 text-xs mt-1">
                    ✓ {promoApplied.description} - ₹{promoApplied.discount} off applied!
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs">{errors.agreeTerms}</p>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="bg-gray-100 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="text-gray-900 font-medium">{experience.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900 font-medium">{booking.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="text-gray-900 font-medium">{booking.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Qty</span>
                  <span className="text-gray-900 font-medium">{booking.quantity}</span>
                </div>
              </div>

              <hr className="border-gray-300 my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{finalTotal.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">₹{finalTotal.taxes}</span>
                </div>
                {finalTotal.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-₹{finalTotal.discount}</span>
                  </div>
                )}
              </div>

              <hr className="border-gray-300 my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{finalTotal.total}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
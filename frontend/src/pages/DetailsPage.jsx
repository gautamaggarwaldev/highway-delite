import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchExperienceDetails();
  }, [id]);

  const fetchExperienceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/experiences/${id}`);
      const data = response.data.data;
      setExperience(data);
      
      // Set first available date as default
      if (data.slots && data.slots.length > 0) {
        setSelectedDate(data.slots[0].date);
      }
    } catch (error) {
      console.error('Error fetching experience details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const getSelectedTimeSlot = () => {
    if (!experience || !selectedDate || !selectedTime) return null;
    const slot = experience.slots.find(s => s.date === selectedDate);
    return slot?.times.find(t => t.time === selectedTime);
  };

  const calculateTotal = () => {
    const subtotal = experience.price * quantity;
    const taxes = experience.taxes || 59;
    return {
      subtotal,
      taxes,
      total: subtotal + taxes
    };
  };

  const handleConfirm = () => {
    const timeSlot = getSelectedTimeSlot();
    
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    if (!timeSlot || timeSlot.availableSlots < quantity) {
      alert('Selected slot is not available');
      return;
    }

    const { subtotal, taxes, total } = calculateTotal();

    navigate('/checkout', {
      state: {
        experience: {
          id: experience._id,
          title: experience.title,
          image: experience.image,
          price: experience.price
        },
        booking: {
          date: selectedDate,
          time: selectedTime,
          quantity,
          subtotal,
          taxes,
          total
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Experience not found</div>
      </div>
    );
  }

  const selectedSlot = experience.slots.find(s => s.date === selectedDate);
  const { subtotal, taxes, total } = calculateTotal();
  const selectedTimeSlot = getSelectedTimeSlot();
  const isConfirmDisabled = !selectedDate || !selectedTime || (selectedTimeSlot && selectedTimeSlot.availableSlots < quantity);

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
              <span className="font-medium">Details</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {experience.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {experience.about}
            </p>

            {/* Choose Date */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Choose date
              </h2>
              <div className="flex gap-3 flex-wrap">
                {experience.slots.map((slot) => (
                  <button
                    key={slot.date}
                    onClick={() => {
                      setSelectedDate(slot.date);
                      setSelectedTime('');
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedDate === slot.date
                        ? 'bg-yellow-400 border-yellow-400 text-black'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {slot.date}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Time */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Choose time
              </h2>
              <div className="flex gap-3 flex-wrap">
                {selectedSlot?.times.map((timeSlot) => (
                  <button
                    key={timeSlot.time}
                    onClick={() => setSelectedTime(timeSlot.time)}
                    disabled={timeSlot.status === 'soldout'}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors relative ${
                      timeSlot.status === 'soldout'
                        ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                        : selectedTime === timeSlot.time
                        ? 'bg-yellow-400 border-yellow-400 text-black'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {timeSlot.time}
                    {timeSlot.status !== 'soldout' && (
                      <span className={`ml-2 text-xs ${selectedTime === timeSlot.time ? 'text-red-700' : 'text-red-600'}`}>
                        {timeSlot.availableSlots} left
                      </span>
                    )}
                    {timeSlot.status === 'soldout' && (
                      <span className="ml-2 text-xs">Sold out</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {experience.about}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-xl p-6 sticky top-24">
              {/* Price */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Starts at</span>
                <span className="text-2xl font-bold text-gray-900">₹{experience.price}</span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <hr className="border-gray-300 my-4" />

              {/* Subtotal */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">₹{subtotal}</span>
              </div>

              {/* Taxes */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Taxes</span>
                <span className="text-gray-900 font-medium">₹{taxes}</span>
              </div>

              <hr className="border-gray-300 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{total}</span>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isConfirmDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-400 text-black hover:bg-yellow-500'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
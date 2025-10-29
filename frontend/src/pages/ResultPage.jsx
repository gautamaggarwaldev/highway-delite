import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, bookingRef, message } = location.state || {};

  // Redirect if no state
  if (success === undefined) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {success ? (
            <>
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Booking Confirmed
              </h1>

              {/* Booking Reference */}
              <p className="text-gray-600 mb-8">
                Ref ID: <span className="font-semibold">{bookingRef}</span>
              </p>

              
            </>
          ) : (
            <>
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Booking Failed
              </h1>

              <p className="text-gray-600 mb-8">
                {message || 'Something went wrong. Please try again.'}
              </p>
            </>
          )}

          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
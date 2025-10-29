/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ onSearch, showSearch = true, searchQuery = '', setSearchQuery }) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (setSearchQuery) {
      setSearchQuery(value);
    }
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    if (setSearchQuery) {
      setSearchQuery('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="highway delite" 
                className="h-15 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex items-center gap-3 flex-1 max-w-2xl ml-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search experiences"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm text-gray-700 placeholder-gray-500 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
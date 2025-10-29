import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HomePage = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      fetchExperiences(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  const fetchExperiences = async (search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/experiences`, {
        params: search ? { search } : {}
      });
      setExperiences(response.data.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/experience/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading experiences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Info */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing results for "{searchQuery}" ({experiences.length} found)
            </p>
          </div>
        )}

        {/* Experience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <div
              key={experience._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title and Location */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {experience.title}
                  </h3>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap ml-2">
                    {experience.location}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                  {experience.description}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-600">From</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{experience.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(experience._id)}
                    className="px-4 py-1.5 bg-yellow-400 text-black text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No experiences found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
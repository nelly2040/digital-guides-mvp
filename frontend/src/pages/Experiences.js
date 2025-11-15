import React, { useState, useEffect } from 'react';
import { experiencesAPI } from '../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    location: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await experiencesAPI.getAll();
      setExperiences(response.data.experiences || response.data);
    } catch (err) {
      setError('Failed to load experiences. Please try again.');
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = experiences.filter(exp => {
    if (filters.category && exp.category !== filters.category) return false;
    if (filters.location && !exp.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (exp.price < min || exp.price > max) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchExperiences}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Filter Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                <option value="safari">Safari</option>
                <option value="cultural">Cultural</option>
                <option value="adventure">Adventure</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Any Price</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200 - $500</option>
                <option value="500-1000">$500+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperiences.map((experience) => (
            <div key={experience.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                {experience.image_url ? (
                  <img 
                    src={experience.image_url} 
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Kenya</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {experience.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{experience.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{experience.description}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <span>📍 {experience.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${experience.price}</span>
                    <span className="text-gray-500 text-sm">/person</span>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/experience/${experience.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No experiences found matching your filters.</div>
            <button 
              onClick={() => setFilters({ category: '', priceRange: '', location: '' })}
              className="mt-4 text-green-600 hover:text-green-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiences;
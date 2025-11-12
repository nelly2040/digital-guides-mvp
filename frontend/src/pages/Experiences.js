import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { browseExperiences } from '../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: '',
    category: '',
    search: ''
  });

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await browseExperiences();
      setExperiences(response.data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterExperiences = useCallback(() => {
    let filtered = experiences;

    if (filters.location) {
      filtered = filtered.filter(exp => 
        exp.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(exp => exp.price <= parseFloat(filters.maxPrice));
    }

    if (filters.category) {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(searchTerm) ||
        exp.description.toLowerCase().includes(searchTerm) ||
        exp.location.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredExperiences(filtered);
  }, [experiences, filters]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  useEffect(() => {
    filterExperiences();
  }, [filterExperiences]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      maxPrice: '',
      category: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-xl text-primary-600">Loading amazing Kenyan experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Kenyan Experiences
          </h1>
          <p className="text-xl text-center text-primary-100 max-w-2xl mx-auto">
            Discover authentic adventures with local guides. From wildlife safaris to cultural immersions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search experiences..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Nairobi, Maasai Mara"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="culture">Culture</option>
                <option value="food">Food</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredExperiences.length} Experiences Found
          </h2>
          <div className="text-sm text-gray-600">
            Showing {filteredExperiences.length} of {experiences.length} experiences
          </div>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦒</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No experiences found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map(experience => (
              <div key={experience.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img 
                    src={experience.photos[0]} 
                    alt={experience.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ${experience.price}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold capitalize">
                      {experience.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition duration-200">
                    {experience.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{experience.description}</p>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{experience.location}</span>
                    <span className="mx-2">•</span>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{experience.duration_hours}h</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {experience.guide.name.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{experience.guide.name}</span>
                    </div>
                    
                    <Link 
                      to={`/experiences/${experience.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiences;
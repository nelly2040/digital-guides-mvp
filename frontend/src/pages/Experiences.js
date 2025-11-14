import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { browseExperiences } from '../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const response = await browseExperiences();
      console.log('Experiences data:', response.data); // Debug log
      setExperiences(response.data);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setError('Failed to load experiences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-blue-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadExperiences}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kenyan Experiences
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover authentic adventures with local Kenyan guides
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map(experience => (
            <div key={experience.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={experience.photos[0]} 
                alt={experience.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{experience.title}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
                    {experience.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <span>📍 {experience.location}</span>
                  <span className="mx-2">•</span>
                  <span>⏱️ {experience.duration_hours}h</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ${experience.price}
                  </div>
                  <Link 
                    to={`/experiences/${experience.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                    {experience.guide.name.charAt(0)}
                  </div>
                  <span>Guide: {experience.guide.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦒</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No experiences found</h3>
            <p className="text-gray-600">Check back later for new experiences</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiences;
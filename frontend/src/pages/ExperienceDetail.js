import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { experiencesAPI, reviewsAPI } from '../services/api';

const ExperienceDetail = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setLoading(true);
        const [expResponse, reviewsResponse] = await Promise.all([
          experiencesAPI.getById(id),
          reviewsAPI.getByExperience(id)
        ]);
        
        setExperience(expResponse.data);
        setReviews(reviewsResponse.data.reviews || []);
      } catch (err) {
        setError('Failed to load experience details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Experience not found'}</div>
          <button 
            onClick={() => window.location.href = '/experiences'}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Experience Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-96 bg-gray-200 relative">
            {experience.image_url ? (
              <img 
                src={experience.image_url} 
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">Kenya Adventure</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {experience.category}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{experience.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{experience.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">${experience.price}</span>
                <span className="text-gray-500 ml-2">per person</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-700 font-semibold">📍 {experience.location}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-700 font-semibold">⏱️ {experience.duration}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Book Now
              </button>
              <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold">
                Contact Guide
              </button>
            </div>
          </div>
        </div>

        {/* What's Included */}
        {(experience.includes || experience.excludes) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.includes && (
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">✅ Included:</h3>
                  <p className="text-gray-600">{experience.includes}</p>
                </div>
              )}
              {experience.excludes && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">❌ Not Included:</h3>
                  <p className="text-gray-600">{experience.excludes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="ml-2 text-gray-600">{review.rating}/5</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    By {review.user?.name || 'Anonymous'} • {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this experience!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
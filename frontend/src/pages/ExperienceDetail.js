import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getExperience, getReviews } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth();
  const [exp, setExp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadExperience = useCallback(async () => {
    try {
      setLoading(true);
      const [expRes, reviewsRes] = await Promise.all([
        getExperience(id),
        getReviews(id)
      ]);
      setExp(expRes.data);
      setReviews(reviewsRes.data);
      
      if (expRes.data.available_dates.length > 0) {
        setSelectedDate(expRes.data.available_dates[0]);
      }
    } catch (error) {
      console.error('Error loading experience:', error);
      navigate('/experiences');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadExperience();
  }, [loadExperience]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    navigate(`/experiences/${id}/book`);
  };

  const calculateTotal = () => {
    return exp ? (exp.price * guestCount).toFixed(2) : '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-xl text-primary-600">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Experience not found</h2>
          <Link to="/experiences" className="text-primary-600 hover:underline">
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/experiences" className="text-primary-600 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Experiences
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <img 
                src={exp.photos[activeImage]} 
                alt={exp.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Thumbnail Gallery */}
              {exp.photos.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {exp.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          activeImage === index ? 'border-primary-600' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={photo} 
                          alt={`${exp.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{exp.title}</h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{exp.location}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{exp.duration_hours} hours</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="capitalize">{exp.category}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10c0-1.777.833-3.357 2.125-4.418A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  <span>Up to 10 guests</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">About this experience</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{exp.description}</p>

                <h3 className="text-xl font-semibold mb-3">Itinerary</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{exp.itinerary}</p>
              </div>
            </div>

            {/* Guide Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Meet your guide</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {exp.guide.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{exp.guide.name}</h4>
                  <p className="text-gray-600 mb-2">{exp.guide.bio}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Based in {exp.guide.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h3>
              
              {reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review this experience!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{review.traveler_name}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg sticky top-24 p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-accent-600 mb-2">${exp.price}</div>
                <div className="text-gray-600">per person</div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {exp.available_dates.map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg border text-sm font-medium transition duration-200 ${
                        selectedDate === date
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 hover:border-primary-600 text-gray-700'
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Guests
                </label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    disabled={guestCount <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="text-lg font-semibold">{guestCount} guest{guestCount !== 1 ? 's' : ''}</span>
                  
                  <button
                    onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    disabled={guestCount >= 10}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-accent-600">${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-105 shadow-lg"
              >
                {isAuthenticated ? 'Book Now 🦁' : 'Login to Book'}
              </button>

              {/* Safety Info */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>🔒 Secure booking</p>
                <p>🦺 Safety standards met</p>
                <p>💬 24/7 support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
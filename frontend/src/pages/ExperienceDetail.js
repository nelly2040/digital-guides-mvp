import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { experiencesAPI, bookingsAPI } from '../services/api';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await experiencesAPI.getById(id);
        
        if (response.experience) {
          setExperience(response.experience);
          
          // Fetch available dates
          const datesResponse = await experiencesAPI.getAvailability(id);
          setAvailableDates(datesResponse.available_dates || []);
        } else {
          setError('Experience not found');
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to load experience details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id]);

  const handleQuickBook = async () => {
    if (availableDates.length === 0) {
      alert('No available dates for this experience');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Use the first available date
      const firstDate = availableDates[0];
      
      const bookingData = {
        experience_id: parseInt(id),
        experience_date_id: firstDate.id,
        number_of_guests: 1,
        special_requests: '',
        total_price: experience.price_per_person
      };

      const response = await bookingsAPI.create(bookingData);
      
      if (response.booking) {
        alert('🎉 Booking created successfully! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 1500);
      } else {
        alert('Booking failed: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Experience Not Found</h2>
              <p className="text-red-600 mb-6">
                {error || 'The experience you are looking for does not exist or has been removed.'}
              </p>
              <Link 
                to="/experiences" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Back to Experiences
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={experience.cover_image} 
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{experience.title}</h1>
              <p className="text-xl opacity-90">{experience.short_description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Experience Details */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience Details</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{experience.description}</p>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <span className="w-6">📍</span>
                      <span><strong>Location:</strong> {experience.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-6">⏱️</span>
                      <span><strong>Duration:</strong> {Math.floor(experience.duration_hours / 24)} days</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-6">👥</span>
                      <span><strong>Group Size:</strong> Up to {experience.max_group_size} guests</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <span className="w-6">💰</span>
                      <span><strong>Price:</strong> ${experience.price_per_person} per person</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-6">📋</span>
                      <span><strong>Category:</strong> {experience.category}</span>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                {experience.itinerary && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Itinerary</h3>
                    <p className="text-gray-600 whitespace-pre-line">{experience.itinerary}</p>
                  </div>
                )}

                {/* What's Included */}
                {experience.includes && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Included</h3>
                    <p className="text-gray-600">{experience.includes}</p>
                  </div>
                )}

                {/* Requirements */}
                {experience.requirements && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                    <p className="text-gray-600">{experience.requirements}</p>
                  </div>
                )}

                {/* Guide Information */}
                {experience.guide && (
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About Your Guide</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{experience.guide.name}</h4>
                      <p className="text-gray-600 mt-2">{experience.guide.experience}</p>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          Languages: {experience.guide.languages?.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${experience.price_per_person}
                  </div>
                  <div className="text-gray-500">per person</div>
                </div>

                {/* Quick Book Button */}
                <button
                  onClick={handleQuickBook}
                  disabled={bookingLoading || availableDates.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </button>

                {/* View Available Dates */}
                <Link
                  to={`/booking/${id}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
                >
                  View Available Dates
                </Link>

                {/* Available Dates Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {availableDates.length} dates available
                    </span>
                    <span className="text-xs text-blue-600">
                      Next 30 days
                    </span>
                  </div>
                </div>

                {/* Experience Highlights */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-6">✅</span>
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-6">✅</span>
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-6">✅</span>
                    <span>Local expert guide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { experiencesAPI } from '../services/api';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        console.log('Fetching experience with ID:', id);
        
        const response = await experiencesAPI.getById(id);
        console.log('Experience response:', response);
        
        if (response.experience) {
          setExperience(response.experience);
          
          // Fetch available dates for this experience
          const datesResponse = await experiencesAPI.getAvailability(id);
          console.log('Available dates:', datesResponse);
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

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    try {
      setBookingLoading(true);
      
      const bookingData = {
        experience_id: parseInt(id),
        experience_date_id: parseInt(selectedDate),
        number_of_guests: numberOfGuests,
        special_requests: specialRequests,
        total_price: experience.price_per_person * numberOfGuests
      };

      console.log('Booking data:', bookingData);
      
      const response = await experiencesAPI.createBooking(bookingData);
      
      if (response.booking) {
        alert('Booking created successfully!');
        navigate('/my-bookings');
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

  const totalPrice = experience ? experience.price_per_person * numberOfGuests : 0;

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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              to="/experiences" 
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              ← Back to Experiences
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Experience Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
              
              <img 
                src={experience.cover_image} 
                alt={experience.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${experience.price_per_person}
                    <span className="text-sm text-gray-500"> / person</span>
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {experience.category}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    📍 {experience.location}
                  </span>
                  <span className="flex items-center">
                    ⏱️ {Math.floor(experience.duration_hours / 24)} days
                  </span>
                  <span className="flex items-center">
                    👥 Max {experience.max_group_size} guests
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{experience.description}</p>
                </div>

                {experience.includes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">What's Included</h3>
                    <p className="text-gray-600">{experience.includes}</p>
                  </div>
                )}

                {experience.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                    <p className="text-gray-600">{experience.requirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Experience</h2>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Choose a date</option>
                    {availableDates.map((date) => (
                      <option key={date.id} value={date.id}>
                        {new Date(date.date).toLocaleDateString()} - {date.available_slots} slots available
                      </option>
                    ))}
                  </select>
                  {availableDates.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">No available dates for this experience</p>
                  )}
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {[...Array(experience.max_group_size)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any dietary requirements, accessibility needs, or special requests..."
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per person</span>
                    <span className="text-gray-900">${experience.price_per_person}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Number of guests</span>
                    <span className="text-gray-900">{numberOfGuests}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || availableDates.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  You'll be able to review your booking before payment
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

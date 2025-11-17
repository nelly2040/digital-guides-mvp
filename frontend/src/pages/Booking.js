import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { experiencesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    number_of_guests: 1,
    tour_date: '',
    special_requests: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=booking');
      return;
    }

    const fetchExperience = async () => {
      try {
        const response = await experiencesAPI.getById(id);
        setExperience(response.experience);
      } catch (err) {
        setError('Failed to load experience details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const bookingData = {
        experience_id: parseInt(id),
        number_of_guests: formData.number_of_guests,
        tour_date: formData.tour_date,
        special_requests: formData.special_requests,
        total_price: experience.price_per_person * formData.number_of_guests
      };

      const response = await bookingsAPI.create(bookingData);
      
      setSuccess('Booking confirmed successfully!');
      
      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);

    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Experience not found</div>
          <Link 
            to="/experiences"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = experience.price_per_person * formData.number_of_guests;
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Book Your Adventure</h1>
              <p className="text-emerald-100">Complete your booking for {experience.title}</p>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Form */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Guests
                      </label>
                      <select
                        name="number_of_guests"
                        value={formData.number_of_guests}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      >
                        {[...Array(experience.max_group_size || 10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tour Date
                      </label>
                      <input
                        type="date"
                        name="tour_date"
                        value={formData.tour_date}
                        onChange={handleChange}
                        min={minDate}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Any dietary requirements, accessibility needs, or special requests..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing Booking...</span>
                        </div>
                      ) : (
                        `Confirm Booking - $${totalPrice}`
                      )}
                    </button>
                  </form>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={experience.image} 
                        alt={experience.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{experience.title}</h4>
                        <p className="text-gray-600 text-sm">{experience.location}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per person:</span>
                        <span className="font-semibold">${experience.price_per_person}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of guests:</span>
                        <span className="font-semibold">{formData.number_of_guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tour date:</span>
                        <span className="font-semibold">
                          {formData.tour_date ? new Date(formData.tour_date).toLocaleDateString() : 'Select date'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total:</span>
                        <span className="text-2xl font-bold text-emerald-600">${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mt-6 p-4 bg-white rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Booking for:</h4>
                    <p className="text-gray-600">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
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

export default Booking;
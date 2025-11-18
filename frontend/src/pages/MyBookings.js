import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI, contactAPI } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getMyBookings();
      console.log('Bookings response:', response);
      setBookings(response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await bookingsAPI.delete(bookingId);
      alert('Booking cancelled successfully!');
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleContactGuide = async (booking) => {
    setSelectedBooking(booking);
    setShowContactModal(true);
  };

  const sendMessageToGuide = async () => {
    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      setContactLoading(true);
      await contactAPI.sendMessage(selectedBooking.experience.guide_id, contactMessage);
      alert('Message sent to guide successfully!');
      setShowContactModal(false);
      setContactMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Bookings</h1>
            <p className="text-lg text-gray-600">
              Manage your upcoming experiences and view booking history
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't booked any experiences yet. Start exploring amazing Kenyan adventures!
                </p>
                <Link
                  to="/experiences"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
                >
                  Browse Experiences
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Experience Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {booking.experience?.title || 'Experience Not Available'}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <span className="w-6">📅</span>
                              <span>
                                {booking.experience_date ? formatDate(booking.experience_date.date) : 'Date not set'}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-6">👥</span>
                              <span>{booking.number_of_guests} guests</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-6">📍</span>
                              <span>{booking.experience?.location || 'Location not available'}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <span className="w-6">💰</span>
                              <span>Total: ${booking.total_price}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-6">🆔</span>
                              <span>Booking ID: #{booking.id}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-6">📞</span>
                              <span>Guide: {booking.experience?.guide?.name || 'Not specified'}</span>
                            </div>
                          </div>
                        </div>

                        {booking.special_requests && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Special Requests:</h4>
                            <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                              {booking.special_requests}
                            </p>
                          </div>
                        )}

                        <div className="text-sm text-gray-500">
                          Booked on {formatDate(booking.created_at)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3 min-w-[200px]">
                        <button
                          onClick={() => handleContactGuide(booking)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>📧</span>
                          <span>Contact Guide</span>
                        </button>

                        {booking.status === 'pending' || booking.status === 'confirmed' ? (
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <span>🗑️</span>
                            <span>Cancel Booking</span>
                          </button>
                        ) : null}

                        <Link
                          to={`/experience/${booking.experience_id}`}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>👁️</span>
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Guide Modal */}
      {showContactModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Guide
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Send a message to your guide for <strong>{selectedBooking.experience?.title}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Guide: {selectedBooking.experience?.guide?.name}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message to the guide here..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={sendMessageToGuide}
                disabled={contactLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {contactLoading ? 'Sending...' : 'Send Message'}
              </button>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactMessage('');
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
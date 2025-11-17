import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        // For demo, create some mock bookings
        setBookings([
          {
            id: 1,
            experience: {
              title: 'Maasai Mara Safari Adventure',
              image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              location: 'Maasai Mara'
            },
            number_of_guests: 2,
            total_price: 900,
            status: 'confirmed',
            tour_date: '2024-02-15',
            created_at: '2024-01-20T10:00:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your upcoming adventures</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No bookings yet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start your Kenyan adventure by booking one of our amazing experiences.
              </p>
              <Link 
                to="/experiences"
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 inline-block"
              >
                Browse Experiences
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <img 
                          src={booking.experience?.image} 
                          alt={booking.experience?.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {booking.experience?.title}
                          </h3>
                          <p className="text-gray-600">{booking.experience?.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ${booking.total_price}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-semibold">
                          {new Date(booking.tour_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Guests:</span>
                        <p className="font-semibold">{booking.number_of_guests} people</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Booked on:</span>
                        <p className="font-semibold">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 font-semibold">
                        Contact Guide
                      </button>
                      {booking.status === 'confirmed' && (
                        <button className="text-red-600 hover:text-red-700 font-semibold">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
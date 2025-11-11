import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGuideBookings, getProfile } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const GuideDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          getProfile(),
          getGuideBookings(user?.id || 'me')
        ]);
        setProfile(profileRes.data.profile);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [user]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      // You'll need to add this endpoint to your backend
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status } : b
        ));
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (!profile) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">Guide Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold">Total Bookings</h3>
            <p className="text-2xl">{bookings.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold">Upcoming</h3>
            <p className="text-2xl">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold">Pending</h3>
            <p className="text-2xl">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
        </div>

        <Link 
          to="/guide/create" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Create New Experience
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Experience</th>
                  <th className="px-4 py-2 text-left">Traveler</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Guests</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-b">
                    <td className="px-4 py-2">{booking.experience_title}</td>
                    <td className="px-4 py-2">{booking.traveler_name}</td>
                    <td className="px-4 py-2">{new Date(booking.tour_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{booking.guest_count}</td>
                    <td className="px-4 py-2">${booking.total_amount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;
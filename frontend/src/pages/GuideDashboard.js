import React, { useState, useEffect } from 'react';
import { authAPI, bookingsAPI, experiencesAPI } from '../services/api';

const GuideDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/';
          return;
        }

        // Fetch user profile
        const profileResponse = await authAPI.getProfile();
        setUser(profileResponse.data.user);

        // Fetch guide bookings
        const bookingsResponse = await bookingsAPI.getGuideBookings();
        setBookings(bookingsResponse.data.bookings || []);

        // Fetch guide experiences
        const experiencesResponse = await experiencesAPI.getByGuide();
        setExperiences(experiencesResponse.data.experiences || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Guide Dashboard</h1>
        
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user.name}!</h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: <span className="capitalize">{user.role}</span></p>
            {!user.is_approved && user.role === 'guide' && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                <p className="text-yellow-700">Your guide account is pending approval. You'll be able to create experiences once approved.</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-green-600 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Experiences</h3>
            <p className="text-3xl font-bold">{experiences.length}</p>
          </div>
          
          <div className="bg-blue-600 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Upcoming Bookings</h3>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
        </div>

        {/* Create Experience Button */}
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/create-experience'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            + Create New Experience
          </button>
        </div>

        {/* Experiences List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Experiences</h2>
          {experiences.length > 0 ? (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{experience.title}</h3>
                  <p className="text-gray-600">{experience.location} • ${experience.price}</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't created any experiences yet.</p>
          )}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800">{booking.experience?.title}</h3>
                  <p className="text-gray-600">
                    {new Date(booking.booking_date).toLocaleDateString()} • 
                    {booking.number_of_people} people • 
                    ${booking.total_price}
                  </p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
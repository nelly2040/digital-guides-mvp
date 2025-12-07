import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookingsAPI, experiencesAPI } from '../services/api';

const GuideDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user || user.role !== 'guide') {
          navigate('/');
          return;
        }

        // Fetch guide bookings
        const bookingsResponse = await bookingsAPI.getGuideBookings();
        setBookings(bookingsResponse.bookings || []);

        // Fetch guide experiences
        const experiencesResponse = await experiencesAPI.getMyExperiences();
        setExperiences(experiencesResponse.experiences || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user.first_name}!</h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: <span className="capitalize">{user.role}</span></p>
            <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
              <p className="text-green-700">
                ✅ Your guide account is verified and ready to create experiences!
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-green-600 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Your Experiences</h3>
            <p className="text-3xl font-bold">{experiences.length}</p>
          </div>
          
          <div className="bg-blue-600 text-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Upcoming Bookings</h3>
            <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
        </div>

        {/* Create Experience Button */}
        <div className="mb-8">
          <Link
            to="/create-experience"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-block"
          >
            + Create New Experience
          </Link>
        </div>

        {/* Experiences List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Experiences</h2>
          {experiences.length > 0 ? (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{experience.title}</h3>
                      <p className="text-gray-600">{experience.location} • ${experience.price_per_person}</p>
                      <p className="text-gray-500 text-sm mt-1">{experience.short_description}</p>
                      <div className="flex space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          experience.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {experience.is_approved ? 'Approved' : 'Pending Approval'}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {experience.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/edit-experience/${experience.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                      >
                        Edit
                      </Link>
                      <button className="text-red-600 hover:text-red-800 text-sm font-semibold">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No experiences yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first experience to start earning as a guide
              </p>
              <Link
                to="/create-experience"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-block"
              >
                Create Your First Experience
              </Link>
            </div>
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
                    {new Date(booking.created_at).toLocaleDateString()} • 
                    {booking.number_of_guests} people • 
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
            <div className="text-center py-4">
              <p className="text-gray-500">No bookings yet. Your bookings will appear here when travelers book your experiences.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;

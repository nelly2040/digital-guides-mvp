import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'bookings') {
        const response = await adminAPI.getAllBookings();
        setBookings(response.bookings || []);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getAllUsers();
        setUsers(response.users || []);
      } else if (activeTab === 'statistics') {
        const response = await adminAPI.getStatistics();
        setStatistics(response);
      }
      
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]); // Add activeTab as dependency

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]); // Now fetchData is properly included

  // Also refetch data when activeTab changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [activeTab, user, fetchData]);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-semibold ${
                activeTab === 'bookings'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              className={`px-6 py-3 font-semibold ${
                activeTab === 'users'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`px-6 py-3 font-semibold ${
                activeTab === 'statistics'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
              onClick={() => setActiveTab('statistics')}
            >
              Statistics
            </button>
          </div>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {booking.experience?.title}
                        </h3>
                        <p className="text-gray-600">
                          Booked by: {booking.user?.first_name} {booking.user?.last_name} ({booking.user?.email})
                        </p>
                        <p className="text-gray-600">
                          Date: {new Date(booking.tour_date).toLocaleDateString()} • 
                          Guests: {booking.number_of_guests} • 
                          Total: ${booking.total_price}
                        </p>
                        {booking.special_requests && (
                          <p className="text-gray-600 mt-2">
                            <strong>Special Requests:</strong> {booking.special_requests}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                          ${booking.total_price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
            {users.length === 0 ? (
              <p className="text-gray-600">No users found.</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">
                          Role: <span className="capitalize">{user.role}</span> • 
                          Bookings: {user.bookings_count || 0}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'guide' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                        {user.is_verified && (
                          <span className="text-green-600 text-sm mt-1">✓ Verified</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && statistics && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-emerald-50 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-bold text-emerald-600 mb-2">{statistics.total_users}</h3>
                <p className="text-emerald-800 font-semibold">Total Users</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-bold text-blue-600 mb-2">{statistics.total_bookings}</h3>
                <p className="text-blue-800 font-semibold">Total Bookings</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-bold text-purple-600 mb-2">${statistics.total_revenue}</h3>
                <p className="text-purple-800 font-semibold">Total Revenue</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-bold text-orange-600 mb-2">{statistics.total_experiences}</h3>
                <p className="text-orange-800 font-semibold">Experiences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Bookings by Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Confirmed:</span>
                    <span className="font-semibold">{statistics.bookings_by_status?.confirmed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-semibold">{statistics.bookings_by_status?.pending || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Users by Role</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Travelers:</span>
                    <span className="font-semibold">{statistics.users_by_role?.travelers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guides:</span>
                    <span className="font-semibold">{statistics.users_by_role?.guides || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins:</span>
                    <span className="font-semibold">{statistics.users_by_role?.admins || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


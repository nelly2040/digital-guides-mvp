import React, { useState, useEffect } from 'react';
import { listGuides, approveGuide, getProfile } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
  const { role } = useAuth();
  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState({ experiences: 0, bookings: 0, revenue: 0 });

  useEffect(() => {
    if (role === 'admin') {
      loadData();
    }
  }, [role]);

  const loadData = async () => {
    try {
      const guidesRes = await listGuides();
      setGuides(guidesRes.data);
      
      // You can add API endpoints for these stats
      setStats({
        experiences: 12, // Mock data - add real API
        bookings: 47,    // Mock data - add real API  
        revenue: 2850    // Mock data - add real API
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleApprove = async (guideId) => {
    try {
      await approveGuide(guideId);
      setGuides(guides.map(g => g.id === guideId ? {...g, is_approved: true} : g));
    } catch (error) {
      alert('Error approving guide: ' + error.response?.data?.error);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-red-600">Access Denied</h1>
        <p>Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Experiences</h3>
          <p className="text-3xl font-bold">{stats.experiences}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">{stats.bookings}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats.revenue}</p>
        </div>
      </div>

      {/* Guides Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Guide Applications</h2>
        {guides.length === 0 ? (
          <p className="text-gray-600">No guide applications pending.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Bio</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map(guide => (
                  <tr key={guide.id} className="border-b">
                    <td className="px-4 py-2">{guide.name}</td>
                    <td className="px-4 py-2">{guide.email}</td>
                    <td className="px-4 py-2">{guide.location}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{guide.bio}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded ${
                        guide.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {guide.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {!guide.is_approved && (
                        <button
                          onClick={() => handleApprove(guide.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mr-2"
                        >
                          Approve
                        </button>
                      )}
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                        Reject
                      </button>
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

export default AdminPanel;
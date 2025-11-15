import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminPanel = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.listGuides();
      setGuides(response.data.guides || []);
    } catch (err) {
      setError('Failed to load guides');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveGuide = async (guideId) => {
    try {
      await adminAPI.approveGuide(guideId);
      // Update the guide status in the local state
      setGuides(guides.map(guide => 
        guide.id === guideId ? { ...guide, is_approved: true } : guide
      ));
      alert('Guide approved successfully!');
    } catch (err) {
      alert('Failed to approve guide');
      console.error('Error approving guide:', err);
    }
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Guides Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Guide Management</h2>
          
          {guides.length === 0 ? (
            <p className="text-gray-600">No guides found.</p>
          ) : (
            <div className="space-y-4">
              {guides.map((guide) => (
                <div key={guide.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{guide.name}</h3>
                      <p className="text-gray-600">{guide.email}</p>
                      <p className="text-gray-600">{guide.phone}</p>
                      <p className="text-gray-600">{guide.location}</p>
                      <p className="text-gray-600 mt-2">{guide.bio}</p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        guide.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {guide.is_approved ? 'Approved' : 'Pending Approval'}
                      </span>
                      
                      {!guide.is_approved && (
                        <button
                          onClick={() => handleApproveGuide(guide.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approve Guide
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Guides</h3>
            <p className="text-3xl font-bold text-green-600">{guides.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Approved Guides</h3>
            <p className="text-3xl font-bold text-blue-600">
              {guides.filter(guide => guide.is_approved).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {guides.filter(guide => !guide.is_approved).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
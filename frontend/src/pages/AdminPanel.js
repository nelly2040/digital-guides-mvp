import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
  const [guides, setGuides] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending guides
      const guidesResponse = await adminAPI.getPendingGuides();
      setGuides(guidesResponse.data?.guides || []);
      
      // Fetch pending experiences
      const experiencesResponse = await adminAPI.getPendingExperiences();
      setExperiences(experiencesResponse.data?.experiences || []);
      
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveGuide = async (guideId) => {
    try {
      await adminAPI.approveGuide(guideId);
      setGuides(guides.filter(guide => guide.id !== guideId));
      alert('Guide approved successfully!');
    } catch (err) {
      alert('Failed to approve guide');
      console.error('Error approving guide:', err);
    }
  };

  const handleApproveExperience = async (experienceId) => {
    try {
      await adminAPI.approveExperience(experienceId);
      setExperiences(experiences.filter(exp => exp.id !== experienceId));
      alert('Experience approved successfully!');
    } catch (err) {
      alert('Failed to approve experience');
      console.error('Error approving experience:', err);
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Guides</h3>
            <p className="text-3xl font-bold text-yellow-600">{guides.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Experiences</h3>
            <p className="text-3xl font-bold text-blue-600">{experiences.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Actions</h3>
            <p className="text-3xl font-bold text-green-600">{guides.length + experiences.length}</p>
          </div>
        </div>

        {/* Guides Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Guide Approvals</h2>
          
          {guides.length === 0 ? (
            <p className="text-gray-600">No guides pending approval.</p>
          ) : (
            <div className="space-y-4">
              {guides.map((guide) => (
                <div key={guide.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{guide.first_name} {guide.last_name}</h3>
                      <p className="text-gray-600">{guide.email}</p>
                      <p className="text-gray-600">{guide.phone}</p>
                      <p className="text-gray-600">{guide.location}</p>
                      <p className="text-gray-600 mt-3">{guide.bio}</p>
                      {guide.guide_license && (
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>License:</strong> {guide.guide_license}
                        </p>
                      )}
                      {guide.years_experience && (
                        <p className="text-sm text-gray-500">
                          <strong>Experience:</strong> {guide.years_experience} years
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-6">
                      <button
                        onClick={() => handleApproveGuide(guide.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Approve Guide
                      </button>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Experiences Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience Approvals</h2>
          
          {experiences.length === 0 ? (
            <p className="text-gray-600">No experiences pending approval.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <div key={experience.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{experience.title}</h3>
                      <p className="text-gray-600">{experience.location} • ${experience.price_per_person} • {experience.duration_hours} hours</p>
                      <p className="text-gray-600 mt-2">{experience.short_description}</p>
                      <div className="mt-3">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                          {experience.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-6">
                      <button
                        onClick={() => handleApproveExperience(experience.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Approve Experience
                      </button>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                        Reject
                      </button>
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

export default AdminPanel;
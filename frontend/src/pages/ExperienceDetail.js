import React, { useState, useEffect } from 'react';
import { getExperience, getReviews } from '../services/api';

const ExperienceDetail = () => {
  const [experience, setExperience] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get experience ID from URL
        const experienceId = window.location.pathname.split('/').pop();
        
        const [expResponse, reviewsResponse] = await Promise.all([
          getExperience(experienceId),
          getReviews(experienceId)
        ]);
        
        setExperience(expResponse.data);
        setReviews(reviewsResponse.data.reviews || []);
      } catch (error) {
        console.error('Error fetching experience details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{experience.title}</h1>
        {/* Rest of your component */}
      </div>
    </div>
  );
};

export default ExperienceDetail;
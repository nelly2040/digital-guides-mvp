import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExperience } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ExperienceDetail = () => {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth();

  useEffect(() => {
    getExperience(id).then(res => setExp(res.data));
  }, [id]);

  if (!exp) return <div>Loading...</div>;

  const handleBook = () => {
    if (!isAuthenticated) return navigate('/');  // Redirect to login
    navigate(`/experiences/${id}/book`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={exp.photos[0]} alt={exp.title} className="w-full h-96 object-cover rounded-lg" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {exp.photos.slice(1).map((photo, i) => (
              <img key={i} src={photo} alt="" className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{exp.title}</h1>
          <p className="text-2xl text-blue-600 mb-4">${exp.price} / person</p>
          <p className="text-gray-600 mb-2">{exp.location} • {exp.duration_hours}h • {exp.category}</p>
          <div className="mb-4">
            <h3 className="font-semibold">Guide: {exp.guide.name}</h3>
            <p>{exp.guide.bio}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Description</h3>
            <p>{exp.description}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Itinerary</h3>
            <p>{exp.itinerary}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Available Dates</h3>
            <ul>{exp.available_dates.map(date => <li key={date}>{date}</li>)}</ul>
          </div>
          <button onClick={handleBook} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
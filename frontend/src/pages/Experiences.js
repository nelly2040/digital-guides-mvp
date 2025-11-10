import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { browseExperiences } from '../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [filters, setFilters] = useState({ location: '', min_price: '', category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    browseExperiences(filters).then(res => setExperiences(res.data));
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <input name="location" placeholder="Location" onChange={handleFilterChange} className="w-full p-2 border rounded mb-2" />
          <input name="min_price" type="number" placeholder="Min Price" onChange={handleFilterChange} className="w-full p-2 border rounded mb-2" />
          <select name="category" onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="culture">Culture</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map(exp => (
              <div key={exp.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={exp.photos[0] || 'placeholder.jpg'} alt={exp.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <p className="text-gray-600">{exp.location} • ${exp.price}</p>
                  <button onClick={() => navigate(`/experiences/${exp.id}`)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiences;
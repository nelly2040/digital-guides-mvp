import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// Assume api.createExperience(data, token)

const CreateExperience = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', duration_hours: '', category: 'food',
    location: '', itinerary: '', photos: [], available_dates: []
  });
  const { jwtToken } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // api.createExperience(formData, jwtToken).then(() => alert('Created!'));
    console.log('Submit:', formData);  // Placeholder
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Experience</h2>
      <input name="title" placeholder="Title" onChange={handleChange} required className="w-full p-3 border rounded mb-4" />
      <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full p-3 border rounded mb-4" rows="4" />
      <input name="price" type="number" placeholder="Price ($)" onChange={handleChange} required className="w-full p-3 border rounded mb-4" />
      <input name="duration_hours" type="number" placeholder="Duration (hours)" onChange={handleChange} className="w-full p-3 border rounded mb-4" />
      <select name="category" onChange={handleChange} className="w-full p-3 border rounded mb-4">
        <option value="food">Food</option>
        <option value="culture">Culture</option>
        <option value="adventure">Adventure</option>
      </select>
      <input name="location" placeholder="Location" onChange={handleChange} required className="w-full p-3 border rounded mb-4" />
      <textarea name="itinerary" placeholder="Itinerary" onChange={handleChange} className="w-full p-3 border rounded mb-4" rows="3" />
      <input name="available_dates" placeholder="Dates (comma-separated, YYYY-MM-DD)" onChange={handleChange} className="w-full p-3 border rounded mb-4" />
      {/* Photo upload: Use <input type="file" multiple /> and handle upload to e.g., Cloudinary */}
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Create</button>
    </form>
  );
};

export default CreateExperience;
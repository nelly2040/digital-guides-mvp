import React, { useState } from 'react';
import { experiencesAPI } from '../services/api';

const CreateExperience = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'safari',
    duration: '',
    max_people: 10,
    includes: '',
    excludes: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login first');
        return;
      }

      const response = await experiencesAPI.create(formData);
      setMessage('Experience created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        category: 'safari',
        duration: '',
        max_people: 10,
        includes: '',
        excludes: '',
        image_url: ''
      });
    } catch (error) {
      setMessage('Error creating experience: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Experience</h1>
          
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Experience Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Maasai Mara Safari Adventure"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your experience in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="150"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="safari">Safari</option>
                  <option value="cultural">Cultural</option>
                  <option value="adventure">Adventure</option>
                  <option value="beach">Beach</option>
                  <option value="mountain">Mountain</option>
                  <option value="food">Food</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Maasai Mara, Nairobi"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 3 hours, 2 days"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">What's Included</label>
                <textarea
                  name="includes"
                  value={formData.includes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Transport, meals, guide, etc."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">What's Not Included</label>
                <textarea
                  name="excludes"
                  value={formData.excludes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Personal expenses, tips, etc."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 mt-6 font-semibold"
            >
              {loading ? 'Creating Experience...' : 'Create Experience'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExperience;
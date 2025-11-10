import React from 'react';

const Homepage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-center mb-8">Discover Authentic Kenyan Experiences</h1>
    <p className="text-lg text-gray-600 text-center mb-8">
      Skip the generic tours. Book directly with local guides for unique adventures.
    </p>
    <a href="/experiences" className="block mx-auto w-48 bg-blue-600 text-white py-3 text-center rounded-lg hover:bg-blue-700">
      Browse Experiences
    </a>
  </div>
);

export default Homepage;
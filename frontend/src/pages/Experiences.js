import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experiencesAPI } from '../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experiencesAPI.getAll();
        console.log('Experiences response:', response);
        setExperiences(response.experiences || []);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        // The API will automatically use mock data, so no error needed
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover <span className="text-amber-300">Kenyan Adventures</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-emerald-100">
              Book unique experiences directly with local Kenyan guides. From wildlife safaris to cultural immersions, find your perfect adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Featured <span className="text-emerald-600">Experiences</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Handpicked adventures curated by our local expert guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <div 
                key={experience.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title} 
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-emerald-600 font-bold">${experience.price_per_person}</span>
                    <span className="text-neutral-500 text-sm">/person</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ {experience.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {experience.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 mb-4 flex items-center space-x-2">
                    <span>📍</span>
                    <span>{experience.location}</span>
                  </p>
                  <p className="text-neutral-500 mb-4 leading-relaxed">
                    {experience.short_description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {experience.category}
                    </span>
                    <span className="text-neutral-500">
                      {experience.duration_hours >= 24 
                        ? `${Math.floor(experience.duration_hours / 24)} days` 
                        : `${experience.duration_hours} hours`}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/experience/${experience.id}`}
                      className="flex-1 bg-emerald-100 text-emerald-700 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-emerald-200 text-center"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/booking/${experience.id}`}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                Ready for Your Kenyan Adventure?
              </h3>
              <p className="text-xl text-neutral-600 mb-6 max-w-2xl mx-auto">
                Join thousands of travelers who have discovered the real Kenya with our local guides.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  Create Account to Book
                </Link>
                <Link 
                  to="/safari-calculator"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
                >
                  Plan Your Safari Budget
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experiences;
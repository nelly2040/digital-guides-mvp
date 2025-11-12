import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { setUserRole } from '../services/api';

const Homepage = () => {
  const { loginWithRedirect, isAuthenticated, role, setRole, user } = useAuth();

  const handleBecomeGuide = async () => {
    try {
      await setUserRole('guide');
      setRole('guide');
      alert('Guide application submitted! Await admin approval.');
    } catch (error) {
      alert('Error submitting application: ' + error.message);
    }
  };

  const features = [
    {
      icon: '🏔️',
      title: 'Authentic Kenyan Experiences',
      description: 'Discover hidden gems and cultural treasures with local experts who know Kenya best.'
    },
    {
      icon: '🦁',
      title: 'Wildlife & Adventure',
      description: 'From safari adventures to cultural immersions, experience the real Kenya.'
    },
    {
      icon: '💫',
      title: 'Direct Local Connection',
      description: 'Book directly with verified local guides, no middlemen, better prices.'
    },
    {
      icon: '🛡️',
      title: 'Vetted & Verified',
      description: 'Every guide is carefully vetted to ensure quality and authenticity.'
    }
  ];

  const popularExperiences = [
    {
      title: 'Maasai Mara Safari',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 120,
      location: 'Maasai Mara'
    },
    {
      title: 'Lamu Island Culture',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 85,
      location: 'Lamu'
    },
    {
      title: 'Mount Kenya Trek',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 200,
      location: 'Mount Kenya'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-blue to-acacia-green">
      {/* Hero Section */}
      <section 
        className="relative bg-wildlife-hero bg-cover bg-center bg-fixed py-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold font-safari mb-6">
            Discover <span className="text-safari-gold">Authentic Kenya</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Skip the tourist traps. Book unique experiences directly with local Kenyan guides who share their culture, wildlife, and hidden gems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/experiences" 
              className="bg-safari-gold text-kenya-green hover:bg-yellow-500 px-8 py-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-105 shadow-lg"
            >
              🦁 Explore Experiences
            </Link>
            {!isAuthenticated && (
              <button 
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })} 
                className="border-2 border-white text-white hover:bg-white hover:text-kenya-green px-8 py-4 rounded-xl text-lg font-bold transition duration-300"
              >
                Join the Adventure
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-kenya-green mb-12 font-safari">
            Why Choose Digital Guides?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-savanna-tan rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-kenya-green mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Experiences */}
      <section className="py-16 bg-kenya-green text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 font-safari">
            Popular Kenyan Experiences
          </h2>
          <p className="text-xl text-center text-savanna-tan mb-12 max-w-2xl mx-auto">
            Discover what makes Kenya one of the world's most incredible travel destinations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {popularExperiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <img src={exp.image} alt={exp.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-kenya-green mb-2">{exp.title}</h3>
                  <p className="text-gray-600 mb-4">{exp.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-safari-gold">${exp.price}</span>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/experiences" 
              className="inline-block bg-safari-gold text-kenya-green hover:bg-yellow-500 px-8 py-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-105"
            >
              View All Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section for Guides */}
      <section className="py-16 bg-gradient-to-r from-sunset-orange to-safari-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-safari">
            Are You a Local Guide?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join our platform and share your unique Kenyan experiences with travelers from around the world. Earn directly from your expertise.
          </p>
          {isAuthenticated ? (
            <div className="space-y-4">
              {role === 'traveler' && (
                <button 
                  onClick={handleBecomeGuide}
                  className="bg-kenya-green hover:bg-green-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition duration-300"
                >
                  🦒 Become a Guide
                </button>
              )}
              {role === 'guide' && (
                <Link 
                  to="/guide/dashboard"
                  className="inline-block bg-kenya-green hover:bg-green-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition duration-300"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          ) : (
            <button 
              onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              className="bg-kenya-green hover:bg-green-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition duration-300"
            >
              Join as Guide
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
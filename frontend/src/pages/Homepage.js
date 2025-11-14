import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { setUserRole } from '../services/api';

const Homepage = () => {
  const { loginWithRedirect, isAuthenticated, role, setRole } = useAuth();

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
      icon: '🌍',
      title: 'Authentic Local Experiences',
      description: 'Discover hidden gems and cultural treasures with local experts who know Kenya best.'
    },
    {
      icon: '🦁',
      title: 'Wildlife & Adventure',
      description: 'From safari adventures to cultural immersions, experience the real Kenya beyond the tourist trails.'
    },
    {
      icon: '💫',
      title: 'Direct Local Connection',
      description: 'Book directly with verified local guides, no middlemen, better prices for authentic experiences.'
    },
    {
      icon: '🛡️',
      title: 'Vetted & Verified',
      description: 'Every guide is carefully vetted to ensure quality, safety, and authentic cultural experiences.'
    },
    {
      icon: '🧮',
      title: 'Safari Cost Calculator',
      description: 'Use our interactive calculator to plan your safari budget and find the perfect experience for your needs.'
    }
  ];

  const popularExperiences = [
    {
      title: 'Maasai Mara Safari',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 450,
      location: 'Maasai Mara',
      duration: '3 days',
      category: 'Adventure'
    },
    {
      title: 'Lamu Island Culture',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 120,
      location: 'Lamu',
      duration: '8 hours',
      category: 'Culture'
    },
    {
      title: 'Mount Kenya Trek',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 320,
      location: 'Mount Kenya',
      duration: '4 days',
      category: 'Adventure'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-safari-hero bg-cover bg-center py-24 lg:py-32"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover <span className="text-accent-500">Authentic Kenya</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Skip the tourist traps. Book unique experiences directly with local Kenyan guides who share their culture, wildlife, and hidden gems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/experiences" 
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🦁 Explore Experiences
            </Link>
            {!isAuthenticated && (
              <button 
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })} 
                className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                Join the Adventure
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Digital Guides?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We connect travelers with authentic local experiences that go beyond typical tourist activities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-neutral-100">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Experiences */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Popular Kenyan Experiences
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover what makes Kenya one of the world's most incredible travel destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {popularExperiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100">
                <img src={exp.image} alt={exp.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900">{exp.title}</h3>
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {exp.category}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4">{exp.location} • {exp.duration}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-accent-600">${exp.price}</span>
                    <span className="text-sm text-neutral-500">per person</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/experiences" 
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-300"
            >
              View All Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section for Guides */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Are You a Local Guide?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our platform and share your unique Kenyan experiences with travelers from around the world. Earn directly from your expertise and passion.
          </p>
          {isAuthenticated ? (
            <div className="space-y-4">
              {role === 'traveler' && (
                <button 
                  onClick={handleBecomeGuide}
                  className="bg-white hover:bg-neutral-100 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-300"
                >
                  🦒 Become a Guide
                </button>
              )}
              {role === 'guide' && (
                <Link 
                  to="/guide/dashboard"
                  className="inline-block bg-white hover:bg-neutral-100 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-300"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          ) : (
            <button 
              onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              className="bg-white hover:bg-neutral-100 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-300"
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


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Homepage = () => {
  const { isAuthenticated, user } = useAuth();

  const handleBrowseExperiences = () => {
    window.location.href = '/experiences';
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
    },
    {
      icon: '💰',
      title: 'Best Price Guarantee',
      description: 'Get the best rates by booking directly with local guides, cutting out expensive middlemen.'
    }
  ];

  const popularExperiences = [
    {
      title: 'Maasai Mara Safari',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price: 450,
      location: 'Maasai Mara',
      duration: '3 days',
      category: 'Wildlife Safari',
      rating: 4.9
    },
    {
      title: 'Lamu Island Culture',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price: 120,
      location: 'Lamu Archipelago',
      duration: '8 hours',
      category: 'Cultural Tour',
      rating: 4.8
    },
    {
      title: 'Mount Kenya Trek',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price: 320,
      location: 'Mount Kenya',
      duration: '4 days',
      category: 'Adventure',
      rating: 4.7
    }
  ];

  const stats = [
    { number: '500+', label: 'Local Guides' },
    { number: '2,000+', label: 'Happy Travelers' },
    { number: '150+', label: 'Unique Experiences' },
    { number: '4.9★', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-green-800/20"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="text-sm font-semibold">🎯 Authentic Kenyan Experiences</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover <span className="text-amber-400">Real Kenya</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-white/90">
              Skip the tourist traps. Book unique experiences directly with local Kenyan guides who share their culture, wildlife, and hidden gems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleBrowseExperiences}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center space-x-2"
              >
                <span>🦁</span>
                <span>Explore Experiences</span>
              </button>
              {!isAuthenticated && (
                <Link 
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm text-center"
                >
                  Join as Local Guide/Traveler
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">{stat.number}</div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Why Choose <span className="text-emerald-600">Digital Guides</span>?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing travel in Kenya by connecting you directly with local experts for authentic, unforgettable experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100 hover:border-emerald-200 hover:scale-105"
              >
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Experiences */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Featured <span className="text-emerald-600">Kenyan Adventures</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover what makes Kenya one of the world's most incredible travel destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {popularExperiences.map((exp, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={exp.image} 
                    alt={exp.title} 
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-emerald-600 font-bold">${exp.price}</span>
                    <span className="text-neutral-500 text-sm">/person</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ {exp.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {exp.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 mb-4 flex items-center space-x-2">
                    <span>📍</span>
                    <span>{exp.location}</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {exp.category}
                    </span>
                    <span className="text-neutral-500">{exp.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleBrowseExperiences}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              Discover All Adventures
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section for Guides */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Are You a <span className="text-amber-300">Local Guide</span>?
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-emerald-100">
              Join our platform and share your unique Kenyan experiences with travelers from around the world. Earn directly from your expertise and passion.
            </p>
            {isAuthenticated ? (
              <div className="space-y-4">
                {user?.role === 'traveler' && (
                  <Link 
                    to="/guide-registration"
                    className="inline-block bg-white hover:bg-neutral-100 text-emerald-600 px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    🦒 Start Your Guide Journey
                  </Link>
                )}
                {user?.role === 'guide' && (
                  <Link 
                    to="/guide-dashboard"
                    className="inline-block bg-white hover:bg-neutral-100 text-emerald-600 px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <Link 
                to="/register?role=guide"
                className="inline-block bg-white hover:bg-neutral-100 text-emerald-600 px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Join as Local Guide
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
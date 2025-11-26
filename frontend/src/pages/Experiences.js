import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { experiencesAPI } from '../services/api';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Complete sample experiences data (fallback if API fails)
  const getSampleExperiences = () => [
    {
      id: 1,
      title: 'Maasai Mara Safari Adventure',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 450,
      location: 'Maasai Mara',
      duration_hours: 72,
      category: 'Wildlife Safari',
      rating: 4.9,
      short_description: 'Witness the Great Migration and spot the Big Five in Africa\'s most famous wildlife reserve.'
    },
    {
      id: 2,
      title: 'Lamu Island Cultural Journey',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 120,
      location: 'Lamu Archipelago',
      duration_hours: 8,
      category: 'Cultural Tour',
      rating: 4.8,
      short_description: 'Explore ancient Swahili architecture and rich coastal culture in this UNESCO World Heritage site.'
    },
    {
      id: 3,
      title: 'Mount Kenya Summit Trek',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 320,
      location: 'Mount Kenya',
      duration_hours: 96,
      category: 'Adventure',
      rating: 4.7,
      short_description: 'Conquer Africa\'s second highest peak with experienced mountain guides through diverse ecosystems.'
    },
    {
      id: 4,
      title: 'Nairobi Food & Market Tour',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 75,
      location: 'Nairobi',
      duration_hours: 4,
      category: 'Food Tour',
      rating: 4.9,
      short_description: 'Taste authentic Kenyan cuisine and explore vibrant local markets with a food expert.'
    },
    {
      id: 5,
      title: 'Diani Beach Water Sports',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 150,
      location: 'Diani Beach',
      duration_hours: 6,
      category: 'Beach & Water Sports',
      rating: 4.8,
      short_description: 'Enjoy snorkeling, kite surfing, and beach relaxation on Kenya\'s most beautiful coastline.'
    },
    {
      id: 6,
      title: 'Samburu Cultural Immersion',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 200,
      location: 'Samburu',
      duration_hours: 48,
      category: 'Cultural Immersion',
      rating: 4.9,
      short_description: 'Live with the Samburu tribe and learn about their ancient traditions and nomadic lifestyle.'
    },
    {
      id: 7,
      title: 'Amboseli Elephant Safari',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 280,
      location: 'Amboseli National Park',
      duration_hours: 48,
      category: 'Wildlife Safari',
      rating: 4.8,
      short_description: 'Get up close with massive elephant herds with Mount Kilimanjaro as your backdrop.'
    },
    {
      id: 8,
      title: 'Lake Nakuru Flamingo Tour',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 180,
      location: 'Lake Nakuru',
      duration_hours: 24,
      category: 'Bird Watching',
      rating: 4.6,
      short_description: 'Witness millions of flamingos painting the lake pink and spot rare white rhinos.'
    },
    {
      id: 9,
      title: 'Tsavo East & West Combo Safari',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 350,
      location: 'Tsavo National Parks',
      duration_hours: 72,
      category: 'Wildlife Safari',
      rating: 4.7,
      short_description: 'Explore Kenya\'s largest national park and its diverse landscapes and wildlife.'
    },
    {
      id: 10,
      title: 'Hell\'s Gate Cycling Adventure',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 90,
      location: 'Hell\'s Gate National Park',
      duration_hours: 8,
      category: 'Adventure',
      rating: 4.8,
      short_description: 'Cycle among wildlife in the only Kenyan park where walking and cycling are permitted.'
    },
    {
      id: 11,
      title: 'Mombasa Old Town Walking Tour',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 60,
      location: 'Mombasa',
      duration_hours: 3,
      category: 'Cultural Tour',
      rating: 4.5,
      short_description: 'Discover 800 years of history in the ancient streets of Mombasa\'s Old Town.'
    },
    {
      id: 12,
      title: 'Lake Naivasha Boat Safari',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 110,
      location: 'Lake Naivasha',
      duration_hours: 6,
      category: 'Wildlife Safari',
      rating: 4.7,
      short_description: 'Cruise among hippos and diverse birdlife on this freshwater lake safari.'
    },
    {
      id: 13,
      title: 'Aberdare Mountain Forest Hike',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 130,
      location: 'Aberdare Range',
      duration_hours: 10,
      category: 'Hiking',
      rating: 4.6,
      short_description: 'Trek through misty mountain forests and discover hidden waterfalls and wildlife.'
    },
    {
      id: 14,
      title: 'Malindi Marine Park Snorkeling',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 85,
      location: 'Malindi',
      duration_hours: 5,
      category: 'Water Sports',
      rating: 4.8,
      short_description: 'Explore vibrant coral reefs and tropical fish in this protected marine park.'
    },
    {
      id: 15,
      title: 'Ol Pejeta Rhino Sanctuary',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 220,
      location: 'Laikipia Plateau',
      duration_hours: 24,
      category: 'Conservation',
      rating: 4.9,
      short_description: 'Meet the last two northern white rhinos and support conservation efforts.'
    },
    {
      id: 16,
      title: 'Saiwa Swamp Monkey Trek',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 95,
      location: 'Saiwa Swamp',
      duration_hours: 6,
      category: 'Wildlife Safari',
      rating: 4.5,
      short_description: 'Spot rare semi-aquatic sitatunga antelopes in Kenya\'s smallest national park.'
    },
    {
      id: 17,
      title: 'Kakamega Rainforest Exploration',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 140,
      location: 'Kakamega Forest',
      duration_hours: 8,
      category: 'Nature Walk',
      rating: 4.7,
      short_description: 'Discover Kenya\'s only tropical rainforest with its unique flora and fauna.'
    },
    {
      id: 18,
      title: 'Watamu Turtle Conservation',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 70,
      location: 'Watamu',
      duration_hours: 4,
      category: 'Conservation',
      rating: 4.9,
      short_description: 'Participate in turtle conservation and witness these magnificent creatures.'
    },
    {
      id: 19,
      title: 'Meru National Park Safari',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 260,
      location: 'Meru National Park',
      duration_hours: 48,
      category: 'Wildlife Safari',
      rating: 4.6,
      short_description: 'Explore the wilderness that inspired Joy Adamson\'s "Born Free" story.'
    },
    {
      id: 20,
      title: 'Chyulu Hills Green Safari',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      price_per_person: 190,
      location: 'Chyulu Hills',
      duration_hours: 24,
      category: 'Eco Tourism',
      rating: 4.8,
      short_description: 'Hike through "green hills of Africa" with stunning views of Kilimanjaro.'
    }
  ];

  const fetchExperiences = async () => {
    try {
      const response = await experiencesAPI.getAll();
      console.log('Experiences response:', response);
      setExperiences(response.experiences || getSampleExperiences());
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences. Showing sample experiences instead.');
      setExperiences(getSampleExperiences());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleViewDetails = (experienceId) => {
    navigate(`/experience/${experienceId}`);
  };

  const handleBookNow = (experienceId) => {
    navigate(`/booking/${experienceId}`);
  };

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
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              {experiences.length} Amazing <span className="text-emerald-600">Experiences</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Handpicked adventures curated by our local expert guides across Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {experiences.map((experience) => (
              <div 
                key={experience.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title} 
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                    }}
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
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                      {experience.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 mb-3 flex items-center space-x-2">
                    <span>📍</span>
                    <span className="text-sm">{experience.location}</span>
                  </p>
                  <p className="text-neutral-500 mb-4 leading-relaxed text-sm line-clamp-2">
                    {experience.short_description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {experience.category}
                    </span>
                    <span className="text-neutral-500 text-sm">
                      {experience.duration_hours >= 24 
                        ? `${Math.floor(experience.duration_hours / 24)} days` 
                        : `${experience.duration_hours} hours`}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(experience.id)}
                      className="flex-1 bg-emerald-100 text-emerald-700 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-emerald-200 text-center text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookNow(experience.id)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border border-gray-200">
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

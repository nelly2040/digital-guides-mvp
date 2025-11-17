import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { experiencesAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [experience, setExperience] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Complete sample experiences data for all IDs
  const sampleExperiences = {
    1: {
      id: 1,
      title: 'Maasai Mara Safari Adventure',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 450,
      location: 'Maasai Mara National Reserve',
      duration_hours: 72,
      category: 'Wildlife Safari',
      rating: 4.9,
      description: 'Embark on an unforgettable safari adventure in the world-famous Maasai Mara. Witness the Great Migration where millions of wildebeest and zebras cross the Mara River, and spot the Big Five in their natural habitat. Our experienced Maasai guides will share their deep knowledge of the ecosystem and local culture.',
      short_description: 'Witness the Great Migration and spot the Big Five in Africa\'s most famous wildlife reserve.',
      includes: 'All park fees, professional guide, 4x4 safari vehicle, accommodation (2 nights), all meals, bottled water',
      excludes: 'International flights, travel insurance, tips, personal expenses, alcoholic beverages',
      itinerary: 'Day 1: Arrival and afternoon game drive | Day 2: Full day safari with picnic lunch | Day 3: Morning game drive and departure',
      requirements: 'Valid passport, comfortable clothing, binoculars, camera, sunscreen, hat',
      max_group_size: 6,
      guide: {
        name: 'John ole Sankori',
        experience: '8 years',
        languages: ['English', 'Swahili', 'Maa'],
        rating: 4.9
      }
    },
    2: {
      id: 2,
      title: 'Lamu Island Cultural Journey',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 120,
      location: 'Lamu Archipelago',
      duration_hours: 8,
      category: 'Cultural Tour',
      rating: 4.8,
      description: 'Step back in time and explore the ancient Swahili settlement of Lamu, a UNESCO World Heritage site. Wander through narrow streets unchanged for centuries, visit historical mosques and museums, and experience the unique blend of Arabic, Indian, and African influences that define Swahili culture.',
      short_description: 'Explore ancient Swahili architecture and rich coastal culture in this UNESCO World Heritage site.',
      includes: 'Professional guide, boat transfers, museum entrance fees, traditional Swahili lunch',
      excludes: 'Accommodation, personal shopping, tips',
      itinerary: 'Morning: Lamu Old Town walking tour | Afternoon: Museum visits and dhow boat ride | Evening: Traditional Swahili dinner',
      requirements: 'Comfortable walking shoes, modest clothing, camera',
      max_group_size: 8,
      guide: {
        name: 'Aisha Mohamed',
        experience: '6 years',
        languages: ['English', 'Swahili', 'Arabic'],
        rating: 4.8
      }
    },
    3: {
      id: 3,
      title: 'Mount Kenya Summit Trek',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 320,
      location: 'Mount Kenya',
      duration_hours: 96,
      category: 'Adventure',
      rating: 4.7,
      description: 'Challenge yourself with a trek to the summit of Mount Kenya, Africa\'s second highest peak. Experience diverse ecosystems from rainforest to alpine zones, and witness breathtaking views from Point Lenana. Our certified mountain guides ensure your safety while sharing their knowledge of the mountain\'s unique flora and fauna.',
      short_description: 'Conquer Africa\'s second highest peak with experienced mountain guides through diverse ecosystems.',
      includes: 'Professional mountain guide, park fees, accommodation in mountain huts, all meals, porter services',
      excludes: 'Personal trekking gear, travel insurance, tips, extra snacks',
      itinerary: 'Day 1: Nairobi to Sirimon Gate to Old Moses Camp | Day 2: Old Moses to Shiptons Camp | Day 3: Summit attempt and descend | Day 4: Return to Nairobi',
      requirements: 'Good physical fitness, warm clothing, hiking boots, daypack, water bottles',
      max_group_size: 8,
      guide: {
        name: 'David Kiprono',
        experience: '10 years',
        languages: ['English', 'Swahili', 'Kikuyu'],
        rating: 4.9
      }
    },
    4: {
      id: 4,
      title: 'Nairobi Food & Market Tour',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 75,
      location: 'Nairobi',
      duration_hours: 4,
      category: 'Food Tour',
      rating: 4.9,
      description: 'Embark on a culinary journey through Nairobi\'s vibrant food scene. Taste authentic Kenyan dishes, explore local markets, and learn about the diverse culinary influences that shape modern Kenyan cuisine. From street food stalls to hidden gems, discover why Nairobi is East Africa\'s food capital.',
      short_description: 'Taste authentic Kenyan cuisine and explore vibrant local markets with a food expert.',
      includes: 'Professional food guide, all food tastings, market visits, bottled water',
      excludes: 'Additional food purchases, souvenirs, tips',
      itinerary: 'Visit Toi Market for street food | Sample traditional dishes at local eateries | Explore city market for spices | Coffee tasting experience',
      requirements: 'Comfortable shoes, appetite for adventure, camera',
      max_group_size: 6,
      guide: {
        name: 'Grace Wanjiku',
        experience: '5 years',
        languages: ['English', 'Swahili'],
        rating: 4.9
      }
    },
    5: {
      id: 5,
      title: 'Diani Beach Water Sports',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 150,
      location: 'Diani Beach',
      duration_hours: 6,
      category: 'Beach & Water Sports',
      rating: 4.8,
      description: 'Experience the crystal-clear waters of Diani Beach with a full day of water sports activities. Go snorkeling in the coral reef, try kite surfing with professional instructors, or simply relax on the pristine white sand beaches. Perfect for both adventure seekers and those looking to unwind by the Indian Ocean.',
      short_description: 'Enjoy snorkeling, kite surfing, and beach relaxation on Kenya\'s most beautiful coastline.',
      includes: 'Snorkeling gear, kite surfing lesson, beach equipment, lunch, refreshments',
      excludes: 'Accommodation, additional activities, tips',
      itinerary: 'Morning: Snorkeling at coral reef | Midday: Kite surfing lessons | Afternoon: Beach relaxation and swimming',
      requirements: 'Swimwear, towel, sunscreen, change of clothes',
      max_group_size: 10,
      guide: {
        name: 'Ali Hassan',
        experience: '7 years',
        languages: ['English', 'Swahili', 'Arabic'],
        rating: 4.8
      }
    },
    6: {
      id: 6,
      title: 'Samburu Cultural Immersion',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 200,
      location: 'Samburu',
      duration_hours: 48,
      category: 'Cultural Immersion',
      rating: 4.9,
      description: 'Immerse yourself in the ancient traditions of the Samburu people, cousins of the Maasai. Live in a traditional manyatta, learn about nomadic pastoralism, participate in cultural ceremonies, and understand the deep connection between the Samburu and their environment in Kenya\'s arid north.',
      short_description: 'Live with the Samburu tribe and learn about their ancient traditions and nomadic lifestyle.',
      includes: 'Cultural guide, traditional accommodation, all meals, cultural activities, community fees',
      excludes: 'Personal shopping, tips, additional donations',
      itinerary: 'Day 1: Welcome ceremony and village tour | Day 2: Livestock herding experience and beadwork lessons | Traditional dance performance',
      requirements: 'Respectful attitude, comfortable clothing, open mind, camera',
      max_group_size: 6,
      guide: {
        name: 'Lekatoo Lesan',
        experience: '12 years',
        languages: ['English', 'Swahili', 'Samburu'],
        rating: 4.9
      }
    },
    7: {
      id: 7,
      title: 'Amboseli Elephant Safari',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 280,
      location: 'Amboseli National Park',
      duration_hours: 48,
      category: 'Wildlife Safari',
      rating: 4.8,
      description: 'Witness the majestic elephants of Amboseli against the stunning backdrop of Mount Kilimanjaro. This park is renowned for its large elephant herds and incredible photographic opportunities. Our guides will help you capture the perfect shot while learning about elephant behavior and conservation efforts.',
      short_description: 'Get up close with massive elephant herds with Mount Kilimanjaro as your backdrop.',
      includes: 'Park fees, professional guide, 4x4 vehicle, accommodation, all meals, photography guidance',
      excludes: 'Camera equipment, tips, personal expenses',
      itinerary: 'Day 1: Afternoon game drive focusing on elephants | Day 2: Sunrise and sunset game drives | Visit observation hill',
      requirements: 'Camera, binoculars, comfortable clothing, sunscreen',
      max_group_size: 6,
      guide: {
        name: 'Samuel Kipkeu',
        experience: '9 years',
        languages: ['English', 'Swahili', 'Maasai'],
        rating: 4.8
      }
    },
    8: {
      id: 8,
      title: 'Lake Nakuru Flamingo Tour',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 180,
      location: 'Lake Nakuru',
      duration_hours: 24,
      category: 'Bird Watching',
      rating: 4.6,
      description: 'Experience the breathtaking spectacle of millions of flamingos painting Lake Nakuru pink. This world-renowned bird sanctuary is also home to rhinos, giraffes, and other wildlife. Perfect for bird enthusiasts and photographers seeking that iconic African wildlife shot.',
      short_description: 'Witness millions of flamingos painting the lake pink and spot rare white rhinos.',
      includes: 'Park fees, professional bird guide, binoculars, accommodation, meals',
      excludes: 'Camera equipment, tips, personal shopping',
      itinerary: 'Afternoon: Game drive and flamingo viewing | Evening: Sunset at the lake | Morning: Rhino tracking and bird watching',
      requirements: 'Binoculars, camera, comfortable shoes, bird guide book',
      max_group_size: 8,
      guide: {
        name: 'Paul Mwangi',
        experience: '8 years',
        languages: ['English', 'Swahili'],
        rating: 4.7
      }
    },
    9: {
      id: 9,
      title: 'Tsavo East & West Combo Safari',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 350,
      location: 'Tsavo National Parks',
      duration_hours: 72,
      category: 'Wildlife Safari',
      rating: 4.7,
      description: 'Explore Kenya\'s largest national park complex, spanning over 20,000 square kilometers. Tsavo East offers vast open plains and the famous "red elephants," while Tsavo West features dramatic landscapes, volcanic formations, and Mzima Springs. A comprehensive safari experience for true wilderness lovers.',
      short_description: 'Explore Kenya\'s largest national park and its diverse landscapes and wildlife.',
      includes: 'All park fees, professional guide, 4x4 vehicle, accommodation (2 nights), all meals',
      excludes: 'International flights, travel insurance, tips',
      itinerary: 'Day 1: Tsavo East game drives | Day 2: Transfer to Tsavo West and afternoon drive | Day 3: Mzima Springs and return',
      requirements: 'Comfortable clothing, camera, binoculars, sunscreen',
      max_group_size: 6,
      guide: {
        name: 'Robert Mwadime',
        experience: '11 years',
        languages: ['English', 'Swahili', 'Taita'],
        rating: 4.8
      }
    },
    10: {
      id: 10,
      title: 'Hell\'s Gate Cycling Adventure',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 90,
      location: 'Hell\'s Gate National Park',
      duration_hours: 8,
      category: 'Adventure',
      rating: 4.8,
      description: 'Experience the thrill of cycling among wildlife in the only Kenyan national park that allows walking and cycling without guides. Pedal through dramatic gorges, past towering cliffs, and among zebras, giraffes, and antelopes. Includes a visit to the geothermal spa for a relaxing dip in natural hot springs.',
      short_description: 'Cycle among wildlife in the only Kenyan park where walking and cycling are permitted.',
      includes: 'Mountain bike rental, helmet, park fees, guide, lunch, spa entrance',
      excludes: 'Personal insurance, tips, additional snacks',
      itinerary: 'Morning: Cycling through park | Midday: Gorge walking | Afternoon: Geothermal spa visit',
      requirements: 'Comfortable athletic clothing, closed shoes, water bottle, sunscreen',
      max_group_size: 12,
      guide: {
        name: 'James Kariuki',
        experience: '6 years',
        languages: ['English', 'Swahili'],
        rating: 4.8
      }
    },
    11: {
      id: 11,
      title: 'Mombasa Old Town Walking Tour',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 60,
      location: 'Mombasa',
      duration_hours: 3,
      category: 'Cultural Tour',
      rating: 4.5,
      description: 'Discover 800 years of history in the ancient streets of Mombasa\'s Old Town. Explore Arabic architecture, visit the famous Fort Jesus, and learn about the Swahili coast\'s rich trading history. Experience the blend of cultures that makes Mombasa one of Africa\'s most historic port cities.',
      short_description: 'Discover 800 years of history in the ancient streets of Mombasa\'s Old Town.',
      includes: 'Professional guide, Fort Jesus entrance, refreshments',
      excludes: 'Personal shopping, additional museum fees, tips',
      itinerary: 'Fort Jesus Museum | Old Town architecture walk | Market visit | Traditional Swahili house tour',
      requirements: 'Comfortable walking shoes, hat, camera, modest clothing',
      max_group_size: 15,
      guide: {
        name: 'Fatima Ali',
        experience: '8 years',
        languages: ['English', 'Swahili', 'Arabic'],
        rating: 4.6
      }
    },
    12: {
      id: 12,
      title: 'Lake Naivasha Boat Safari',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 110,
      location: 'Lake Naivasha',
      duration_hours: 6,
      category: 'Wildlife Safari',
      rating: 4.7,
      description: 'Cruise on the tranquil waters of Lake Naivasha, getting up close with hippos, giraffes, and over 400 species of birds. This freshwater lake offers a unique perspective on Kenyan wildlife from the water. Includes a walking safari on Crescent Island where you can walk among giraffes and zebras.',
      short_description: 'Cruise among hippos and diverse birdlife on this freshwater lake safari.',
      includes: 'Boat safari, professional guide, Crescent Island walking safari, lunch',
      excludes: 'Accommodation, tips, additional activities',
      itinerary: 'Morning boat safari | Crescent Island walking tour | Lunch by the lake | Afternoon bird watching',
      requirements: 'Comfortable shoes, binoculars, camera, light jacket',
      max_group_size: 8,
      guide: {
        name: 'Peter Ondieki',
        experience: '7 years',
        languages: ['English', 'Swahili'],
        rating: 4.7
      }
    },
    13: {
      id: 13,
      title: 'Aberdare Mountain Forest Hike',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 130,
      location: 'Aberdare Range',
      duration_hours: 10,
      category: 'Hiking',
      rating: 4.6,
      description: 'Trek through the misty mountain forests of the Aberdare Range, home to rare wildlife and stunning waterfalls. This high-altitude adventure takes you through bamboo forests, past hidden waterfalls, and offers opportunities to spot forest elephants, bongo antelopes, and diverse bird species.',
      short_description: 'Trek through misty mountain forests and discover hidden waterfalls and wildlife.',
      includes: 'Professional guide, park fees, picnic lunch, hiking poles',
      excludes: 'Hiking boots, rain gear, personal insurance',
      itinerary: 'Morning: Forest trek to Karuru Falls | Afternoon: Wildlife spotting and ridge walk | Return via different trail',
      requirements: 'Hiking boots, rain jacket, warm layers, water, snacks',
      max_group_size: 8,
      guide: {
        name: 'Simon Gitonga',
        experience: '9 years',
        languages: ['English', 'Swahili', 'Kikuyu'],
        rating: 4.7
      }
    },
    14: {
      id: 14,
      title: 'Malindi Marine Park Snorkeling',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 85,
      location: 'Malindi',
      duration_hours: 5,
      category: 'Water Sports',
      rating: 4.8,
      description: 'Discover the underwater wonders of Malindi Marine Park, Kenya\'s first marine protected area. Snorkel among vibrant coral gardens, tropical fish, and maybe even spot sea turtles. Perfect for families and first-time snorkelers with our patient instructors and calm, clear waters.',
      short_description: 'Explore vibrant coral reefs and tropical fish in this protected marine park.',
      includes: 'Snorkeling gear, boat transfer, marine park fees, instructor, refreshments',
      excludes: 'Underwater camera, tips, additional water activities',
      itinerary: 'Boat ride to best snorkeling spots | Guided snorkeling sessions | Marine life education | Beach relaxation',
      requirements: 'Swimwear, towel, sunscreen, underwater camera',
      max_group_size: 12,
      guide: {
        name: 'Mohammed Bakari',
        experience: '6 years',
        languages: ['English', 'Swahili', 'Italian'],
        rating: 4.8
      }
    },
    15: {
      id: 15,
      title: 'Ol Pejeta Rhino Sanctuary',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 220,
      location: 'Laikipia Plateau',
      duration_hours: 24,
      category: 'Conservation',
      rating: 4.9,
      description: 'Visit the largest black rhino sanctuary in East Africa and meet the last two northern white rhinos on Earth. This conservation-focused experience includes behind-the-scenes access to wildlife protection efforts, chimpanzee sanctuary visit, and learning about cutting-edge conservation technology.',
      short_description: 'Meet the last two northern white rhinos and support conservation efforts.',
      includes: 'Conservation fees, expert guide, accommodation, all meals, conservation experience',
      excludes: 'Additional donations, tips, personal shopping',
      itinerary: 'Rhino tracking | Chimpanzee sanctuary visit | Conservation technology demo | Night game drive',
      requirements: 'Respect for wildlife, camera, comfortable clothing',
      max_group_size: 6,
      guide: {
        name: 'Dr. Emma Ndirangu',
        experience: '15 years',
        languages: ['English', 'Swahili'],
        rating: 4.9
      }
    },
    16: {
      id: 16,
      title: 'Saiwa Swamp Monkey Trek',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 95,
      location: 'Saiwa Swamp',
      duration_hours: 6,
      category: 'Wildlife Safari',
      rating: 4.5,
      description: 'Explore Kenya\'s smallest national park in search of the rare semi-aquatic sitatunga antelope and other unique swamp wildlife. This specialized trek takes you along raised boardwalks through the swamp, offering excellent opportunities for wildlife photography and bird watching in a unique ecosystem.',
      short_description: 'Spot rare semi-aquatic sitatunga antelopes in Kenya\'s smallest national park.',
      includes: 'Park fees, specialized guide, binoculars, picnic lunch',
      excludes: 'Camera equipment, tips, transportation to park',
      itinerary: 'Morning wildlife tracking | Boardwalk exploration | Bird watching session | Picnic lunch in park',
      requirements: 'Waterproof shoes, binoculars, camera, insect repellent',
      max_group_size: 6,
      guide: {
        name: 'Daniel Kiptoo',
        experience: '8 years',
        languages: ['English', 'Swahili', 'Kalenjin'],
        rating: 4.6
      }
    },
    17: {
      id: 17,
      title: 'Kakamega Rainforest Exploration',
      image: 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 140,
      location: 'Kakamega Forest',
      duration_hours: 8,
      category: 'Nature Walk',
      rating: 4.7,
      description: 'Discover Kenya\'s only tropical rainforest, a remnant of the ancient Guineo-Congolian rainforest that once stretched across Africa. Home to unique primates, rare birds, and incredible biodiversity. Our expert guides will help you spot colobus monkeys, identify medicinal plants, and understand this fragile ecosystem.',
      short_description: 'Discover Kenya\'s only tropical rainforest with its unique flora and fauna.',
      includes: 'Expert guide, park fees, picnic lunch, binoculars',
      excludes: 'Rain gear, camera, tips, accommodation',
      itinerary: 'Morning primate tracking | Medicinal plant walk | Bird watching | Forest canopy exploration',
      requirements: 'Sturdy shoes, rain jacket, insect repellent, camera',
      max_group_size: 8,
      guide: {
        name: 'Professor William Luhanga',
        experience: '20 years',
        languages: ['English', 'Swahili', 'Luhya'],
        rating: 4.9
      }
    },
    18: {
      id: 18,
      title: 'Watamu Turtle Conservation',
      image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 70,
      location: 'Watamu',
      duration_hours: 4,
      category: 'Conservation',
      rating: 4.9,
      description: 'Participate in hands-on turtle conservation efforts on the beautiful Watamu beaches. Learn about sea turtle biology, assist with nest monitoring, and if you\'re lucky, witness turtle hatchlings making their way to the ocean. A meaningful experience that contributes directly to marine conservation.',
      short_description: 'Participate in turtle conservation and witness these magnificent creatures.',
      includes: 'Conservation expert, educational materials, conservation fees, refreshments',
      excludes: 'Beachwear, sunscreen, camera, tips',
      itinerary: 'Turtle conservation briefing | Beach patrol for nests | Educational session | Possible hatchling release',
      requirements: 'Beach clothing, sunscreen, camera, enthusiasm for conservation',
      max_group_size: 10,
      guide: {
        name: 'Marine Biologist Sarah Okello',
        experience: '8 years',
        languages: ['English', 'Swahili', 'Italian'],
        rating: 4.9
      }
    },
    19: {
      id: 19,
      title: 'Meru National Park Safari',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 260,
      location: 'Meru National Park',
      duration_hours: 48,
      category: 'Wildlife Safari',
      rating: 4.6,
      description: 'Explore the wilderness that inspired Joy Adamson\'s "Born Free" story. Meru National Park offers diverse landscapes from savannah to rainforest, and is home to all the Big Five. Less crowded than other parks, it provides an intimate safari experience with excellent wildlife viewing opportunities.',
      short_description: 'Explore the wilderness that inspired Joy Adamson\'s "Born Free" story.',
      includes: 'Park fees, professional guide, 4x4 vehicle, accommodation, all meals',
      excludes: 'Drinks, tips, personal expenses',
      itinerary: 'Day 1: Afternoon game drive | Day 2: Full day exploring diverse ecosystems | Visit Adamson\'s Falls',
      requirements: 'Comfortable clothing, camera, binoculars, safari spirit',
      max_group_size: 6,
      guide: {
        name: 'Joseph Kariuki',
        experience: '12 years',
        languages: ['English', 'Swahili', 'Meru'],
        rating: 4.7
      }
    },
    20: {
      id: 20,
      title: 'Chyulu Hills Green Safari',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      price_per_person: 190,
      location: 'Chyulu Hills',
      duration_hours: 24,
      category: 'Eco Tourism',
      rating: 4.8,
      description: 'Hike through the "Green Hills of Africa" made famous by Ernest Hemingway, with stunning views of Mount Kilimanjaro. This eco-friendly safari focuses on conservation and community involvement. Explore volcanic caves, spot wildlife, and learn about Maasai conservation efforts in this beautiful landscape.',
      short_description: 'Hike through "green hills of Africa" with stunning views of Kilimanjaro.',
      includes: 'Community guide, conservation fees, cave exploration, meals, community contribution',
      excludes: 'Accommodation, tips, personal gear',
      itinerary: 'Morning hike with Kilimanjaro views | Volcanic cave exploration | Community visit | Conservation talk',
      requirements: 'Hiking shoes, camera, light backpack, water',
      max_group_size: 8,
      guide: {
        name: 'Nelson ole Tipanko',
        experience: '10 years',
        languages: ['English', 'Swahili', 'Maa'],
        rating: 4.8
      }
    }
  };

  // Sample reviews for each experience
  const sampleReviews = {
    1: [
      {
        id: 1,
        rating: 5,
        comment: 'Absolutely incredible experience! Our guide John was extremely knowledgeable about the wildlife and Maasai culture. Saw all the Big Five!',
        user: { name: 'Sarah Johnson' },
        created_at: '2024-01-15'
      },
      {
        id: 2,
        rating: 4,
        comment: 'Amazing safari, great accommodation and food. The migration was spectacular. Would recommend to anyone visiting Kenya.',
        user: { name: 'Michael Chen' },
        created_at: '2024-01-10'
      }
    ],
    2: [
      {
        id: 1,
        rating: 5,
        comment: 'Aisha was an amazing guide! Learned so much about Swahili culture and the food was delicious.',
        user: { name: 'Emma Wilson' },
        created_at: '2024-01-12'
      }
    ],
    // Add reviews for other experiences as needed...
  };

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const [expResponse, reviewsResponse] = await Promise.all([
          experiencesAPI.getById(id),
          reviewsAPI.getByExperience(id)
        ]);
        
        // Use API data if available, otherwise use sample data
        const expData = expResponse.experience || sampleExperiences[id];
        const revData = reviewsResponse.reviews || sampleReviews[id] || [];
        
        setExperience(expData);
        setReviews(revData);
        
        if (!expResponse.experience) {
          setError('Using sample data - API connection failed');
        }
        
      } catch (err) {
        console.error('Error fetching experience details:', err);
        // Use sample data as fallback
        setExperience(sampleExperiences[id]);
        setReviews(sampleReviews[id] || []);
        setError('Using sample data - API connection failed');
      } finally {
        setLoading(false);
      }
    };

    if (id && sampleExperiences[id]) {
      fetchExperienceDetails();
    } else {
      setError('Experience not found');
      setLoading(false);
    }
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=booking');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Experience not found</div>
          <Link 
            to="/experiences"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Experience Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="h-96 bg-gray-200 relative">
            <img 
              src={experience.image} 
              alt={experience.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {experience.category}
              </span>
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-emerald-600 font-bold">${experience.price_per_person}</span>
              <span className="text-neutral-500 text-sm">/person</span>
            </div>
          </div>
          
          <div className="p-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{experience.title}</h1>
            <p className="text-xl text-neutral-600 mb-6 leading-relaxed">{experience.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-emerald-600">${experience.price_per_person}</span>
                <span className="text-neutral-500">per person</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span className="text-neutral-700 font-semibold">{experience.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span>⏱️</span>
                <span className="text-neutral-700 font-semibold">{Math.floor(experience.duration_hours / 24)} days</span>
              </div>

              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span className="text-neutral-700 font-semibold">{experience.rating} rating</span>
              </div>
            </div>

            {/* Guide Information */}
            {experience.guide && (
              <div className="bg-emerald-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Your Guide</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {experience.guide.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{experience.guide.name}</h4>
                    <p className="text-neutral-600">{experience.guide.experience} experience • ⭐ {experience.guide.rating}</p>
                    <p className="text-sm text-neutral-500">Languages: {experience.guide.languages.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleBookNow}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>
              <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Contact Guide
              </button>
              <Link 
                to="/experiences"
                className="border-2 border-neutral-300 text-neutral-600 hover:bg-neutral-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Back to Experiences
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* What's Included */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Experience Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experience.includes && (
                  <div>
                    <h3 className="font-semibold text-emerald-600 mb-3 flex items-center">
                      <span className="text-xl mr-2">✅</span>
                      What's Included
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">{experience.includes}</p>
                  </div>
                )}
                {experience.excludes && (
                  <div>
                    <h3 className="font-semibold text-red-600 mb-3 flex items-center">
                      <span className="text-xl mr-2">❌</span>
                      Not Included
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">{experience.excludes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary */}
            {experience.itinerary && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Itinerary</h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{experience.itinerary}</p>
              </div>
            )}

            {/* Requirements */}
            {experience.requirements && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">What to Bring</h2>
                <p className="text-neutral-600 leading-relaxed">{experience.requirements}</p>
              </div>
            )}
          </div>

          {/* Right Column - Reviews */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="ml-2 text-neutral-600">{review.rating}/5</span>
                      </div>
                      <p className="text-neutral-700 mb-2">{review.comment}</p>
                      <p className="text-neutral-500 text-sm">
                        By {review.user?.name || 'Anonymous'} • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">No reviews yet. Be the first to review this experience!</p>
              )}
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Quick Facts</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Duration:</span>
                  <span className="font-semibold">{Math.floor(experience.duration_hours / 24)} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Group Size:</span>
                  <span className="font-semibold">Up to {experience.max_group_size} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Category:</span>
                  <span className="font-semibold">{experience.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Rating:</span>
                  <span className="font-semibold">⭐ {experience.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
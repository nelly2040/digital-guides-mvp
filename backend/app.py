from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, User, Profile, Experience, Category, UserRole, Booking, Review
from routes import auth, experiences, bookings, admin, reviews
import json
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
db.init_app(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(experiences.bp, url_prefix='/api/experiences')
app.register_blueprint(bookings.bp, url_prefix='/api/bookings')
app.register_blueprint(admin.bp, url_prefix='/api/admin')
app.register_blueprint(reviews.bp, url_prefix='/api/reviews')

@app.route('/')
def home():
    return jsonify({'message': 'Digital Guides API - Authentic Kenyan Experiences'})

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

def seed_database():
    """Seed the database with 20+ real Kenyan experiences"""
    print("Creating seed data...")
    
    # Check if we already have data
    if User.query.first():
        print("Database already seeded, skipping...")
        return
    
    try:
        # Create users
        admin_user = User(
            auth0_id='admin-digitalguides-com', 
            email='admin@digitalguides.com', 
            role=UserRole.ADMIN
        )
        guide1 = User(
            auth0_id='guide-john-kenyanguides-com', 
            email='john@kenyanguides.com', 
            role=UserRole.GUIDE
        )
        guide2 = User(
            auth0_id='guide-sarah-coastguides-com', 
            email='sarah@coastguides.com', 
            role=UserRole.GUIDE
        )
        guide3 = User(
            auth0_id='guide-david-adventurekenya-com', 
            email='david@adventurekenya.com', 
            role=UserRole.GUIDE
        )
        traveler_user = User(
            auth0_id='traveler-test-com', 
            email='traveler@test.com', 
            role=UserRole.TRAVELER
        )
        
        db.session.add_all([admin_user, guide1, guide2, guide3, traveler_user])
        db.session.commit()
        print("✅ Created users")
        
        # Create profiles
        admin_profile = Profile(
            user_id=admin_user.id, 
            name='System Admin', 
            location='Nairobi, Kenya', 
            is_approved=True
        )
        
        guide1_profile = Profile(
            user_id=guide1.id, 
            name='John Mwangi', 
            bio='5th generation Kenyan with 15+ years experience in tourism. Certified safari guide with deep knowledge of Maasai culture and wildlife behavior. Fluent in English, Swahili, and Maa.',
            location='Nairobi, Kenya', 
            is_approved=True,
            avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        )
        
        guide2_profile = Profile(
            user_id=guide2.id,
            name='Sarah Achieng',
            bio='Coastal specialist born and raised in Mombasa. Expert in Swahili culture, coastal cuisine, and marine ecosystems. Certified dive instructor and culinary guide.',
            location='Mombasa, Kenya',
            is_approved=True,
            avatar_url='https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        )
        
        guide3_profile = Profile(
            user_id=guide3.id,
            name='David Kimani',
            bio='Adventure guide and mountaineering expert. Certified in wilderness first aid with extensive knowledge of Kenyan highlands. 10+ years experience guiding treks and outdoor adventures.',
            location='Nanyuki, Kenya',
            is_approved=True,
            avatar_url='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        )
        
        traveler_profile = Profile(
            user_id=traveler_user.id, 
            name='Sarah Johnson', 
            location='New York, USA',
            bio='Travel enthusiast exploring authentic cultural experiences around the world.'
        )
        
        db.session.add_all([admin_profile, guide1_profile, guide2_profile, guide3_profile, traveler_profile])
        db.session.commit()
        print("✅ Created profiles")
        
        # Comprehensive Kenyan Experiences (20+ real experiences)
        experiences_data = [
            # Safari Experiences
            {
                'title': 'Maasai Mara Great Migration Safari - 3 Days',
                'description': '''Witness one of nature's greatest spectacles - the Great Migration in the Maasai Mara. See millions of wildebeest and zebra cross the Mara River in a dramatic survival journey. Our expert guides ensure optimal viewing opportunities while sharing deep insights into predator-prey dynamics and Maasai Mara's ecosystem.

INCLUDES:
• Luxury tented accommodation with en-suite facilities
• Professional safari guide with 10+ years experience
• All game drives in custom 4x4 safari vehicles
• Gourmet bush meals prepared by camp chef
• Park fees and conservation charges
• Maasai cultural village visit

HIGHLIGHTS:
• Front-row seats to river crossings (seasonal)
• Big Five sightings guarantee
• Photography guidance for perfect shots
• Sundowner drinks at scenic viewpoints
• Night game drives (where permitted)''',
                'price': 450.00,
                'duration_hours': 72,
                'category': Category.ADVENTURE,
                'location': 'Maasai Mara National Reserve',
                'itinerary': '''DAY 1: NAIROBI TO MAASAI MARA
06:00 - Hotel pickup in Nairobi
06:30 - Scenic drive through Great Rift Valley
10:30 - Arrive at Maasai Mara, welcome drinks
11:30 - Lunch and camp orientation
15:00 - Afternoon game drive until sunset
19:00 - Dinner under the stars, wildlife briefing

DAY 2: GREAT MIGRATION VIEWING
05:30 - Early morning game drive (predator activity peak)
08:30 - Bush breakfast at scenic location
10:00 - Migration viewing at Mara River
13:00 - Lunch at camp, rest period
16:00 - Evening game drive focusing on big cats
19:30 - Traditional Maasai cultural evening

DAY 3: FINAL GAME DRIVE & RETURN
06:30 - Final morning game drive
09:00 - Breakfast and pack-up
10:00 - Depart for Nairobi with picnic lunch
15:00 - Arrive back in Nairobi, drop-off''',
                'photos': [
                    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-07-15', '2025-07-22', '2025-08-05', '2025-08-12', '2025-08-19', '2025-08-26'],
                'guide_id': guide1.id
            },
            {
                'title': 'Amboseli Elephant Safari with Kilimanjaro Views',
                'description': '''Experience Amboseli National Park, famous for its large elephant herds and stunning backdrop of Mount Kilimanjaro. This photographer\'s paradise offers incredible wildlife viewing and the iconic African landscape that has inspired generations.

SPECIAL FEATURES:
• Elephant behavior and conservation education
• Photography tips for capturing Kilimanjaro
• Visit to observation hill for panoramic views
• Cultural interaction with local Maasai community
• Sunset viewing at swamp areas

WILDLIFE FOCUS:
• Large elephant herds (up to 100+ individuals)
• Lion prides and cheetah sightings
• Buffalo, giraffe, and zebra populations
• 400+ bird species including flamingos
• Hippo pools and crocodile sightings''',
                'price': 280.00,
                'duration_hours': 48,
                'category': Category.ADVENTURE,
                'location': 'Amboseli National Park',
                'itinerary': '''DAY 1: NAIROBI TO AMBOSELI
07:00 - Depart Nairobi
10:30 - Arrive Amboseli, game drive en route to lodge
12:30 - Lunch and check-in
16:00 - Evening game drive at swamp areas
19:00 - Dinner and elephant behavior talk

DAY 2: FULL DAY ELEPHANT FOCUS
06:00 - Sunrise game drive for photography
08:30 - Breakfast at observation point
10:00 - Elephant tracking and behavior study
13:00 - Lunch at lodge
15:30 - Cultural visit to Maasai village
18:00 - Sunset game drive
19:30 - Farewell dinner

DAY 3: MORNING DRIVE & RETURN
06:30 - Final morning game drive
09:00 - Breakfast and check-out
10:00 - Return to Nairobi
13:30 - Arrive Nairobi''',
                'photos': [
                    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-20', '2025-01-27', '2025-02-03', '2025-02-10'],
                'guide_id': guide1.id
            },
            {
                'title': 'Samburu Special Five Safari Adventure',
                'description': '''Discover the unique wildlife of northern Kenya in Samburu National Reserve, home to the "Special Five" - rare species found only in this arid ecosystem. Experience authentic wilderness away from crowds with expert guides who know this terrain intimately.

THE SPECIAL FIVE:
• Grevy\'s zebra (world's most endangered zebra species)
• Somali ostrich (distinct blue-legged variety)
• Reticulated giraffe (beautiful net-like pattern)
• Gerenuk (long-necked antelope that stands upright)
• Beisa oryx (elegant desert antelope with long horns)

ADDITIONAL HIGHLIGHTS:
• Ewaso Ng'iro river ecosystem
• Lion and leopard sightings
• Over 450 bird species
• Cultural visits to Samburu villages
• Stunning desert landscapes and rock formations''',
                'price': 320.00,
                'duration_hours': 60,
                'category': Category.ADVENTURE,
                'location': 'Samburu National Reserve',
                'itinerary': '''DAY 1: NAIROBI TO SAMBURU
07:00 - Depart Nairobi
12:30 - Arrive Samburu, lunch at camp
15:00 - Afternoon game drive along Ewaso Ng'iro river
18:30 - Sundowner at scenic viewpoint
19:30 - Dinner and orientation

DAY 2: SPECIAL FIVE TRACKING
06:00 - Early morning game drive
09:00 - Bush breakfast
10:30 - Special Five tracking session
13:00 - Lunch and rest
16:00 - Evening game drive focusing on predators
19:00 - Cultural evening with Samburu community

DAY 3: RIVER ECOSYSTEM EXPLORATION
06:30 - Bird watching along river
08:30 - Breakfast
10:00 - Nature walk with armed guard
13:00 - Lunch
15:30 - Final game drive
19:00 - Farewell dinner

DAY 4: RETURN TO NAIROBI
06:00 - Morning game drive
08:30 - Breakfast and check-out
09:30 - Return journey to Nairobi
14:00 - Arrive Nairobi''',
                'photos': [
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-03-10', '2025-03-17', '2025-03-24', '2025-03-31'],
                'guide_id': guide1.id
            },
            {
                'title': 'Lake Nakuru Flamingo & Rhino Sanctuary Experience',
                'description': '''Visit the bird watcher\'s paradise of Lake Nakuru National Park, famous for its flamingo populations and successful rhino conservation program. This compact park offers incredible wildlife density and varied ecosystems in a single location.

PARK HIGHLIGHTS:
• Thousands of flamingos (seasonal) and pelicans
• White and black rhino sightings guaranteed
• Rothschild giraffe sanctuary
• Lion, leopard, and hyena populations
• Baboon cliff panoramic views
• Makalia waterfall and yellow acacia forests

CONSERVATION FOCUS:
• Learn about rhino conservation efforts
• Understand lake ecosystem dynamics
• Bird identification and behavior
• Wildlife photography opportunities''',
                'price': 180.00,
                'duration_hours': 24,
                'category': Category.ADVENTURE,
                'location': 'Lake Nakuru National Park',
                'itinerary': '''DAY TRIP ITINERARY:
06:00 - Nairobi hotel pickup
08:30 - Arrive Lake Nakuru, enter park
09:00 - Morning game drive focusing on rhinos
11:00 - Flamingo viewing at lake shore
12:30 - Picnic lunch at designated site
14:00 - Afternoon game drive and baboon cliff
16:00 - Depart park
18:30 - Return to Nairobi

ALTERNATIVE OPTIONS:
• Overnight option available
• Photography-focused itinerary
• Bird watching specialization
• Family-friendly version''',
                'photos': [
                    'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-15', '2025-01-22', '2025-01-29', '2025-02-05', '2025-02-12'],
                'guide_id': guide1.id
            },
            {
                'title': 'Tsavo East & West Combined Wilderness Safari',
                'description': '''Explore Kenya\'s largest protected area spanning Tsavo East and West National Parks. Experience diverse landscapes from arid plains to lush springs, and encounter the famous "red elephants" of Tsavo in their natural habitat.

TSAVO EAST FEATURES:
• Vast open plains perfect for game viewing
• Mudanda Rock and Yatta Plateau
• Aruba Dam wildlife concentration area
• Red elephant herds dust-bathing
• Diverse birdlife including migratory species

TSAVO WEST HIGHLIGHTS:
• Mzima Springs with underwater hippo viewing
• Shetani lava flows and volcanic features
• Rhino sanctuary and conservation area
• Ngulia safari walking trails
• Diverse landscapes from savanna to woodland''',
                'price': 380.00,
                'duration_hours': 72,
                'category': Category.ADVENTURE,
                'location': 'Tsavo East & West National Parks',
                'itinerary': '''DAY 1: NAIROBI TO TSAVO EAST
06:30 - Depart Nairobi
10:00 - Enter Tsavo East, game drive to lodge
12:30 - Lunch and check-in
16:00 - Evening game drive at Aruba Dam
19:00 - Dinner and Tsavo history talk

DAY 2: TSAVO EAST EXPLORATION
06:00 - Sunrise game drive at Mudanda Rock
08:30 - Bush breakfast
10:00 - Elephant behavior observation
13:00 - Lunch at lodge
15:30 - Game drive to Lugard Falls
18:30 - Sundowner at scenic location
19:30 - Dinner under the stars

DAY 3: TSAVO WEST DISCOVERY
06:30 - Morning game drive en route to Tsavo West
09:00 - Breakfast at Tsavo West gate
10:30 - Enter Tsavo West, game drive to springs
12:30 - Lunch at lodge
15:00 - Visit Mzima Springs and hippo pools
17:00 - Rhino sanctuary visit
19:00 - Farewell dinner

DAY 4: RETURN JOURNEY
06:00 - Final morning game drive
08:30 - Breakfast and check-out
09:30 - Return to Nairobi
14:00 - Arrive Nairobi''',
                'photos': [
                    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-02-05', '2025-02-12', '2025-02-19', '2025-02-26'],
                'guide_id': guide1.id
            },
            
            # Cultural Experiences
            {
                'title': 'Maasai Village Cultural Immersion Experience',
                'description': '''Spend a day living as the Maasai do in an authentic village experience. Learn ancient traditions, participate in daily activities, and gain deep insights into one of Africa\'s most famous pastoral communities.

CULTURAL ACTIVITIES:
• Traditional welcome ceremony and blessings
• Warrior training and spear throwing
• Beadwork workshop and jewelry making
• Traditional fire making demonstration
• Herding and livestock management lessons
• Medicinal plant identification and uses

AUTHENTIC EXPERIENCES:
• Share traditional meals with families
• Learn Maa language basics and greetings
• Participate in songs and dances
• Understand social structure and elder system
• Photography opportunities with consent''',
                'price': 75.00,
                'duration_hours': 6,
                'category': Category.CULTURE,
                'location': 'Maasai Mara Region',
                'itinerary': '''FULL DAY IMMERSION:
08:00 - Pickup from designated meeting point
09:30 - Arrive at Maasai village, traditional welcome
10:00 - Village tour and family introductions
11:00 - Warrior training session
12:30 - Traditional lunch preparation and meal
14:00 - Beadwork and craft workshop
15:30 - Herding demonstration and livestock care
16:30 - Cultural performances and dances
17:30 - Farewell ceremony and depart
19:00 - Return to drop-off point

OPTIONAL ADD-ONS:
• Overnight homestay experience
• Extended 2-day cultural immersion
• Photography-focused cultural tour
• Market day experience''',
                'photos': [
                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1551818250-22ac6d1a16d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-18', '2025-01-25', '2025-02-01', '2025-02-08', '2025-02-15'],
                'guide_id': guide1.id
            },
            {
                'title': 'Lamu Island Swahili Heritage Experience',
                'description': '''Step back in time on the magical island of Lamu, a UNESCO World Heritage site. Experience centuries-old Swahili culture, ancient architecture, and tranquil island life in one of the best-preserved Swahili settlements.

SWAHILI CULTURE IMMERSION:
• Lamu Old Town guided walking tour
• Traditional dhow sailing experience
• Swahili architecture and history
• Henna art and traditional dress
• Swahili cuisine cooking class
• Historical sites and museum visits

ISLAND LIFE EXPERIENCES:
• Donkey rides through narrow streets
• Local market exploration
• Fishing with local fishermen
• Sunset dhow cruise with music
• Visit to nearby Manda Island
• Traditional wood carving demonstration''',
                'price': 120.00,
                'duration_hours': 8,
                'category': Category.CULTURE,
                'location': 'Lamu Island',
                'itinerary': '''FULL DAY LAMU EXPERIENCE:
08:00 - Morning dhow sailing to Manda Island
09:30 - Explore Takwa Ruins with historian
11:00 - Snorkeling in crystal-clear waters
12:30 - Beachside Swahili lunch preparation
14:00 - Lamu Old Town comprehensive walking tour
16:00 - Swahili cooking class with local family
18:00 - Sunset dhow cruise with traditional music
19:30 - Evening market visit and return

EXTENDED OPTIONS:
• 3-day Lamu cultural immersion
• Photography and architecture focus
• Festival timing experiences
• Private family homestay''',
                'photos': [
                    'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1573848953218-44c310bc6bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-20', '2025-01-27', '2025-02-03', '2025-02-10'],
                'guide_id': guide2.id
            },
            {
                'title': 'Kikuyu Traditional Ceremonies & Cultural Exchange',
                'description': '''Participate in authentic Kikuyu traditional ceremonies and learn about Kenya\'s largest ethnic group\'s rich customs, beliefs, and way of life. This immersive experience offers genuine cultural exchange in rural central Kenya.

TRADITIONAL ACTIVITIES:
• Welcome ceremony and elder blessings
• Traditional beer brewing demonstration
• Gourd carving and calabash decoration
• Storytelling under the mugumo tree
• Traditional food preparation methods
• Music and dance performances

CULTURAL LEARNING:
• Kikuyu social structure understanding
• Traditional marriage customs
• Agricultural practices and seasons
• Medicinal plant knowledge
• Language and proverbs learning
• Circumcision ceremony insights (observational)''',
                'price': 60.00,
                'duration_hours': 5,
                'category': Category.CULTURE,
                'location': 'Central Kenya Highlands',
                'itinerary': '''CULTURAL DAY PROGRAM:
09:00 - Pickup from designated location
10:30 - Arrive at village, traditional welcome
11:00 - Village tour and family introductions
12:00 - Traditional food preparation workshop
13:30 - Shared traditional lunch
14:30 - Craft demonstrations and participation
15:30 - Storytelling and cultural education
16:30 - Music, dance, and celebration
17:30 - Farewell ceremony
19:00 - Return to drop-off point

SPECIAL EXPERIENCES:
• Overnight homestead stay
• Market day participation
• Farming activity involvement
• Special ceremony timing''',
                'photos': [
                    'https://images.unsplash.com/photo-1551818250-22ac6d1a16d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-22', '2025-01-29', '2025-02-05', '2025-02-12'],
                'guide_id': guide1.id
            },
            
            # Food Experiences
            {
                'title': 'Nairobi Street Food & Market Adventure Tour',
                'description': '''Discover the vibrant flavors of Nairobi through its bustling markets and hidden street food gems. This culinary journey takes you through the heart of the city\'s food scene, from traditional Kenyan dishes to modern fusion cuisine.

FOOD TASTING INCLUDES:
• Nyama Choma (Kenyan barbecue) experience
• Samosas and mandazi from local vendors
• Fresh tropical fruits at City Market
• Traditional ugali and sukuma wiki
• Kenyan tea and coffee tasting
• Street snacks like mutura and grilled maize
• Local desserts and sweets

MARKET EXPLORATION:
• City Market spice and craft section
• Toi Market local produce area
• Kariakor Market authentic experience
• Meeting food artisans and vendors
• Learning ingredient origins and uses''',
                'price': 45.00,
                'duration_hours': 3,
                'category': Category.FOOD,
                'location': 'Nairobi',
                'itinerary': '''EVENING FOOD TOUR:
14:00 - Meet at central Nairobi location
14:30 - City Market exploration and fruit tasting
15:30 - Toi Market street food sampling
16:30 - Local restaurant for traditional dishes
17:30 - Street food alley experience
18:00 - Traditional tea house visit
18:30 - Dessert and sweet treats
19:00 - Local craft beer tasting (optional)
19:30 - Tour concludes

ALTERNATIVE OPTIONS:
• Morning market tour
• Vegetarian-focused experience
• Family-friendly food tour
• Photography food tour''',
                'photos': [
                    'https://images.unsplash.com/photo-1562569633-622763f96b85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1576867755383-5df3ac5d32b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-16', '2025-01-18', '2025-01-23', '2025-01-25', '2025-01-30'],
                'guide_id': guide1.id
            },
            {
                'title': 'Coastal Swahili Cooking Class & Spice Farm Visit',
                'description': '''Learn to cook authentic Swahili dishes in a traditional coastal setting. This hands-on experience includes a spice farm visit where you\'ll discover the aromatic ingredients that define Swahili cuisine.

COOKING CLASS INCLUDES:
• Spice farm tour and identification
• Traditional cooking methods demonstration
• Hands-on preparation of 3 main dishes
• Swahili cooking techniques learning
• Recipe booklet to take home
• Enjoyment of prepared meal

DISHES YOU\'LL LEARN:
• Coconut fish (Samaki wa kupaka)
• Pilau rice with traditional spices
• Chapati making from scratch
• Swahili vegetable curry
• Fresh coconut chutney
• Traditional desserts like mahamri''',
                'price': 55.00,
                'duration_hours': 4,
                'category': Category.FOOD,
                'location': 'Mombasa',
                'itinerary': '''COOKING EXPERIENCE SCHEDULE:
09:00 - Hotel pickup in Mombasa
09:30 - Arrive at spice farm, guided tour
10:30 - Ingredient selection and preparation
11:00 - Cooking class part 1: Main dishes
12:30 - Cooking class part 2: Side dishes and bread
13:30 - Enjoy the meal you prepared
14:30 - Recipe sharing and Q&A session
15:00 - Return to hotels
15:30 - Tour concludes

SPECIAL FEATURES:
• Family cooking sessions available
• Vegetarian and vegan options
• Market tour add-on available
• Private group classes''',
                'photos': [
                    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-19', '2025-01-26', '2025-02-02', '2025-02-09'],
                'guide_id': guide2.id
            },
            {
                'title': 'Kenyan Coffee Farm Tour & Premium Tasting Experience',
                'description': '''Visit a coffee farm in the fertile Kenyan highlands and learn about coffee production from bean to cup. Experience the journey of some of the world\'s best coffee and enjoy premium tasting sessions.

FARM EXPERIENCE INCLUDES:
• Coffee plantation walking tour
• Cherry picking demonstration (seasonal)
• Processing methods explanation
• Traditional and modern roasting
• Cupping and tasting session
• Coffee preparation techniques

LEARNING OUTCOMES:
• Understanding coffee grading system
• Different brewing methods compared
• Flavor profile identification
• Kenyan coffee characteristics
• Sustainable farming practices
• Direct trade and fair trade insights''',
                'price': 40.00,
                'duration_hours': 4,
                'category': Category.FOOD,
                'location': 'Kiambu County',
                'itinerary': '''COFFEE TOUR SCHEDULE:
08:00 - Nairobi hotel pickup
09:00 - Arrive at coffee farm, welcome
09:30 - Plantation tour and cultivation insights
10:30 - Processing facility demonstration
11:30 - Roasting experience and techniques
12:30 - Cupping and tasting session
13:30 - Lunch with coffee-themed dishes
14:30 - Brewing methods workshop
15:30 - Return to Nairobi
16:30 - Tour concludes

ADDITIONAL OPTIONS:
• Barista training add-on
• Coffee packaging workshop
• Extended farm stay experience
• Private group tours''',
                'photos': [
                    'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-21', '2025-01-28', '2025-02-04', '2025-02-11'],
                'guide_id': guide1.id
            },
            
            # Adventure Experiences
            {
                'title': 'Mount Kenya Summit Trek to Point Lenana - 5 Days',
                'description': '''Conquer the second-highest peak in Africa on this exhilarating 5-day trek to Point Lenana (4,985m). Experience diverse ecosystems from rainforest to alpine desert and witness stunning sunrise from the summit.

TREK HIGHLIGHTS:
• Professional mountain guide and support team
• All camping equipment and mess tent provided
• Nutritious meals designed for high altitude
• Small group size (max 6 people)
• Comprehensive safety equipment
• Summit certificate upon completion

ROUTE FEATURES:
• Sirimon route ascent for best acclimatization
• Diverse flora and fauna sightings
• Alpine zone and glacier views
• High altitude challenge achievement
• Breathtaking summit sunrise''',
                'price': 520.00,
                'duration_hours': 120,
                'category': Category.ADVENTURE,
                'location': 'Mount Kenya National Park',
                'itinerary': '''DAY 1: NAIROBI TO OLD MOSES CAMP
08:00 - Meet in Nanyuki, gear check
10:00 - Start trek through rainforest
16:00 - Arrive Old Moses Camp (3,300m)
18:00 - Dinner and altitude briefing

DAY 2: TO SHIPTON\'S CAMP
07:00 - Breakfast and pack-up
08:00 - Trek through moorland
15:00 - Arrive Shipton\'s Camp (4,200m)
18:00 - Dinner, summit preparation

DAY 3: ACCLIMATIZATION DAY
07:00 - Breakfast
08:00 - Acclimatization hike
12:00 - Lunch at camp
14:00 - Rest and preparation
18:00 - Dinner, early bedtime

DAY 4: SUMMIT DAY
02:00 - Early start for summit
06:30 - Reach Point Lenana for sunrise
08:00 - Descend to Shipton\'s Camp
12:00 - Lunch and rest
14:00 - Optional exploration

DAY 5: DESCENT AND RETURN
07:00 - Breakfast and descend
14:00 - Reach park gate, certificate
15:00 - Return to Nanyuki''',
                'photos': [
                    'https://images.unsplash.com/photo-1464822759849-e2c4e21dc5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates':
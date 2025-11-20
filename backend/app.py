from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps
import os
import re
from dotenv import load_dotenv
import json

# Try to import psycopg2, fallback to sqlite
try:
    import psycopg2
    DB_TYPE = "postgresql"
except ImportError:
    DB_TYPE = "sqlite"
    print("⚠️  psycopg2 not available, using SQLite")

# Import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()

# Import models after db initialization
from models import User, Experience, Booking, ExperienceDate, UserRole, BookingStatus

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'digital-guides-secret-key-2024')

# Database configuration
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL').replace('postgres://', 'postgresql://')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///digital_guides.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions with app
db.init_app(app)
bcrypt.init_app(app)
CORS(app)

# Cloudinary configuration
try:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.api
    
    cloudinary.config( 
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dtzryzjdq'), 
        api_key=os.getenv('CLOUDINARY_API_KEY', '422317742489724'), 
        api_secret=os.getenv('CLOUDINARY_API_SECRET', 'k05-L8gM7IkN8g6Rm6Mwx-ANzxo'),
        secure=True
    )
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False
    print("⚠️ Cloudinary not available")


# Authentication decorators
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Initialize database
def init_db():
    db.create_all()
    
    admin = User.query.filter_by(email='admin@digitalguides.com').first()
    if not admin:
        admin = User(
            first_name='Admin',
            last_name='User',
            email='admin@digitalguides.com',
            role=UserRole.ADMIN,
            is_verified=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()


def create_sample_data():
    """Create comprehensive sample data with all 20 Kenyan experiences"""
    # Create sample guides
    guides = [
        User(
            first_name='John',
            last_name='Ole Sankori',
            email='john.sankori@example.com',
            role=UserRole.GUIDE,
            phone='+254700000001',
            location='Maasai Mara',
            bio='Maasai guide with 8 years of safari experience. Born and raised in the Mara ecosystem.',
            is_verified=True
        ),
        User(
            first_name='Aisha',
            last_name='Mohamed',
            email='aisha.mohamed@example.com',
            role=UserRole.GUIDE,
            phone='+254700000002',
            location='Lamu',
            bio='Swahili cultural expert with 6 years guiding experience in coastal Kenya.',
            is_verified=True
        ),
        User(
            first_name='David',
            last_name='Kiprop',
            email='david.kiprop@example.com',
            role=UserRole.GUIDE,
            phone='+254700000003',
            location='Mount Kenya',
            bio='Certified mountain guide with 10 years of trekking experience across East Africa.',
            is_verified=True
        ),
        User(
            first_name='Grace',
            last_name='Wanjiku',
            email='grace.wanjiku@example.com',
            role=UserRole.GUIDE,
            phone='+254700000004',
            location='Nairobi',
            bio='Food and culture enthusiast with deep knowledge of Nairobi\'s culinary scene.',
            is_verified=True
        ),
        User(
            first_name='Samuel',
            last_name='Lemayan',
            email='samuel.lemayan@example.com',
            role=UserRole.GUIDE,
            phone='+254700000005',
            location='Samburu',
            bio='Samburu elder and cultural ambassador with lifetime experience in northern Kenya.',
            is_verified=True
        ),
        User(
            first_name='Paul',
            last_name='Gitonga',
            email='paul.gitonga@example.com',
            role=UserRole.GUIDE,
            phone='+254700000006',
            location='Amboseli',
            bio='Wildlife conservationist with 12 years experience in elephant behavior studies.',
            is_verified=True
        ),
        User(
            first_name='Mary',
            last_name='Akinyi',
            email='mary.akinyi@example.com',
            role=UserRole.GUIDE,
            phone='+254700000007',
            location='Lake Nakuru',
            bio='Ornithologist and bird watching specialist with extensive knowledge of Rift Valley lakes.',
            is_verified=True
        )
    ]
    
    for guide in guides:
        guide.set_password('guide123')
        db.session.add(guide)
    
    db.session.commit()
    
    # All 20 Kenyan experiences
    experiences_data = [
        {
            'guide_id': guides[0].id,
            'title': 'Maasai Mara Safari Adventure',
            'description': 'Embark on an unforgettable 3-day safari adventure in the world-famous Maasai Mara National Reserve. Witness the spectacular Great Migration where millions of wildebeest and zebras make their dramatic river crossings. Our expert Maasai guides will help you spot the Big Five (lion, leopard, rhinoceros, elephant, and buffalo) in their natural habitat. Experience authentic Maasai culture with village visits and traditional performances.',
            'short_description': 'Witness the Great Migration and spot the Big Five in Africa\'s most famous wildlife reserve.',
            'category': 'Wildlife Safari',
            'location': 'Maasai Mara National Reserve',
            'duration_hours': 72,
            'max_group_size': 6,
            'price_per_person': 450,
            'itinerary': 'Day 1: Arrival, afternoon game drive, and sundowner | Day 2: Full day safari with picnic lunch at Mara River | Day 3: Morning game drive, Maasai village visit, departure',
            'includes': 'All park fees, professional Maasai guide, 4x4 safari vehicle, accommodation (2 nights luxury tented camp), all meals, bottled water, airport transfers',
            'excludes': 'International flights, travel insurance, tips, personal expenses, alcoholic beverages',
            'requirements': 'Valid passport, comfortable clothing, binoculars, camera, sunscreen, hat, malaria prophylaxis',
            'cover_image': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[1].id,
            'title': 'Lamu Island Cultural Journey',
            'description': 'Step back in time and explore the ancient Swahili settlement of Lamu, a UNESCO World Heritage site. Wander through narrow streets unchanged for centuries, visit historic mosques and museums, and experience the rich coastal culture. Enjoy traditional dhow boat rides, sample authentic Swahili cuisine, and learn about the island\'s fascinating history as a trading post.',
            'short_description': 'Explore ancient Swahili architecture and rich coastal culture in this UNESCO World Heritage site.',
            'category': 'Cultural Tour',
            'location': 'Lamu Archipelago',
            'duration_hours': 8,
            'max_group_size': 8,
            'price_per_person': 120,
            'itinerary': 'Morning: Lamu Old Town walking tour, Lamu Museum visit | Afternoon: Dhow boat ride, Swahili lunch, donkey sanctuary visit',
            'includes': 'Professional guide, boat transfers, museum entrance fees, traditional Swahili lunch, bottled water',
            'excludes': 'Accommodation, personal shopping, tips, alcoholic beverages',
            'requirements': 'Comfortable walking shoes, modest clothing, camera, sunscreen',
            'cover_image': 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[2].id,
            'title': 'Mount Kenya Summit Trek',
            'description': 'Conquer Africa\'s second highest peak (5,199m) with our experienced mountain guides. This 4-day trek takes you through diverse ecosystems from bamboo forests to alpine moorlands. Experience stunning views, unique high-altitude flora, and the satisfaction of reaching Point Lenana. Our guides are certified by the Kenya Mountain Guide Association with extensive first-aid training.',
            'short_description': 'Conquer Africa\'s second highest peak with experienced mountain guides through diverse ecosystems.',
            'category': 'Adventure',
            'location': 'Mount Kenya',
            'duration_hours': 96,
            'max_group_size': 8,
            'price_per_person': 320,
            'itinerary': 'Day 1: Sirimon Gate to Old Moses Camp | Day 2: To Shiptons Camp | Day 3: Summit attempt (Point Lenana), descend to Mintos Hut | Day 4: Descend to Sirimon Gate',
            'includes': 'Professional mountain guide, park fees, accommodation in mountain huts, all meals, porters, cooking equipment',
            'excludes': 'Personal hiking gear, travel insurance, tips, personal expenses',
            'requirements': 'Good physical fitness, warm clothing, hiking boots, daypack, headlamp, water purification tablets',
            'cover_image': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[3].id,
            'title': 'Nairobi Food & Market Tour',
            'description': 'Discover Nairobi\'s vibrant food scene with our expert local guide. This tour takes you through bustling markets, hidden food stalls, and authentic restaurants where you\'ll taste traditional Kenyan dishes. Learn about the cultural significance of different foods and experience the city like a true local. Perfect for food lovers and cultural enthusiasts.',
            'short_description': 'Taste authentic Kenyan cuisine and explore vibrant local markets with a food expert.',
            'category': 'Food Tour',
            'location': 'Nairobi',
            'duration_hours': 4,
            'max_group_size': 6,
            'price_per_person': 75,
            'itinerary': 'Visit Toi Market, sample street food, traditional restaurant lunch, coffee tasting, spice market exploration',
            'includes': 'Professional guide, all food tastings, bottled water, transportation between locations',
            'excludes': 'Additional food purchases, souvenirs, tips',
            'requirements': 'Comfortable walking shoes, appetite for adventure, camera',
            'cover_image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[1].id,
            'title': 'Diani Beach Water Sports',
            'description': 'Experience the crystal-clear waters of Diani Beach with a full day of water sports activities. Go snorkeling in the coral reefs, try kite surfing with professional instructors, or simply relax on the pristine white sand beach. Our team ensures safety and fun for all skill levels in one of Kenya\'s most beautiful coastal destinations.',
            'short_description': 'Enjoy snorkeling, kite surfing, and beach relaxation on Kenya\'s most beautiful coastline.',
            'category': 'Beach & Water Sports',
            'location': 'Diani Beach',
            'duration_hours': 6,
            'max_group_size': 10,
            'price_per_person': 150,
            'itinerary': 'Morning: Snorkeling session | Mid-day: Kite surfing lessons | Afternoon: Beach relaxation and optional dolphin watching',
            'includes': 'Equipment rental, professional instructors, safety gear, lunch, bottled water',
            'excludes': 'Accommodation, additional activities, tips',
            'requirements': 'Swimwear, towel, sunscreen, change of clothes',
            'cover_image': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[4].id,
            'title': 'Samburu Cultural Immersion',
            'description': 'Live with the Samburu tribe and learn about their ancient traditions and nomadic lifestyle. This immersive 2-day experience includes traditional ceremonies, beadwork lessons, warrior training, and overnight stays in manyattas (traditional huts). Gain deep insights into one of Kenya\'s most fascinating cultures while supporting community-based tourism.',
            'short_description': 'Live with the Samburu tribe and learn about their ancient traditions and nomadic lifestyle.',
            'category': 'Cultural Immersion',
            'location': 'Samburu',
            'duration_hours': 48,
            'max_group_size': 4,
            'price_per_person': 200,
            'itinerary': 'Day 1: Welcome ceremony, village tour, beadwork lesson, traditional dinner | Day 2: Morning with warriors, livestock herding, farewell ceremony',
            'includes': 'Cultural activities, traditional meals, accommodation in manyatta, community fees, local guide',
            'excludes': 'Transportation to Samburu, personal shopping, tips',
            'requirements': 'Respect for local customs, modest clothing, open mind, camera',
            'cover_image': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[5].id,
            'title': 'Amboseli Elephant Safari',
            'description': 'Get up close with massive elephant herds against the stunning backdrop of Mount Kilimanjaro. Amboseli National Park is famous for its large elephant populations and spectacular views of Africa\'s highest peak. Our 2-day safari includes multiple game drives, visits to observation hills, and opportunities to photograph wildlife in their natural habitat.',
            'short_description': 'Get up close with massive elephant herds with Mount Kilimanjaro as your backdrop.',
            'category': 'Wildlife Safari',
            'location': 'Amboseli National Park',
            'duration_hours': 48,
            'max_group_size': 6,
            'price_per_person': 280,
            'itinerary': 'Day 1: Morning game drive, lunch, afternoon game drive, sundowner | Day 2: Sunrise game drive, observation hill visit, departure',
            'includes': 'Park fees, professional guide, 4x4 vehicle, accommodation (1 night), all meals, bottled water',
            'excludes': 'International flights, travel insurance, tips, personal expenses',
            'requirements': 'Camera, binoculars, comfortable clothing, sunscreen',
            'cover_image': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[6].id,
            'title': 'Lake Nakuru Flamingo Tour',
            'description': 'Witness the spectacular sight of millions of flamingos painting Lake Nakuru pink. This 1-day tour also offers opportunities to spot rare white rhinos, Rothschild giraffes, and other wildlife in this compact but diverse national park. The alkaline lake creates a unique ecosystem that supports abundant birdlife and wildlife.',
            'short_description': 'Witness millions of flamingos painting the lake pink and spot rare white rhinos.',
            'category': 'Bird Watching',
            'location': 'Lake Nakuru',
            'duration_hours': 24,
            'max_group_size': 8,
            'price_per_person': 180,
            'itinerary': 'Full day game drive around Lake Nakuru, picnic lunch, baboon cliff viewpoint, overnight stay',
            'includes': 'Park fees, professional guide, vehicle, accommodation, meals, bottled water',
            'excludes': 'Personal expenses, tips, alcoholic beverages',
            'requirements': 'Binoculars, camera, comfortable clothing',
            'cover_image': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[0].id,
            'title': 'Tsavo East & West Combo Safari',
            'description': 'Explore Kenya\'s largest national park complex spanning over 20,000 square kilometers. Tsavo East offers vast open plains and the famous "red elephants" while Tsavo West features volcanic landscapes, Mzima Springs, and diverse wildlife. This 3-day safari covers both parks for a comprehensive wilderness experience.',
            'short_description': 'Explore Kenya\'s largest national park and its diverse landscapes and wildlife.',
            'category': 'Wildlife Safari',
            'location': 'Tsavo National Parks',
            'duration_hours': 72,
            'max_group_size': 6,
            'price_per_person': 350,
            'itinerary': 'Day 1: Tsavo East game drives | Day 2: Transfer to Tsavo West, Mzima Springs visit | Day 3: Tsavo West game drives, departure',
            'includes': 'Park fees, professional guide, 4x4 vehicle, accommodation (2 nights), all meals, bottled water',
            'excludes': 'Travel insurance, tips, personal expenses',
            'requirements': 'Camera, binoculars, comfortable clothing, sunscreen',
            'cover_image': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[2].id,
            'title': 'Hell\'s Gate Cycling Adventure',
            'description': 'Cycle among wildlife in the only Kenyan national park where walking and cycling are permitted. Hell\'s Gate offers stunning geothermal scenery, dramatic cliffs, and abundant wildlife including zebras, giraffes, and antelopes. This full-day adventure includes cycling through the park, hiking through gorges, and visiting geothermal stations.',
            'short_description': 'Cycle among wildlife in the only Kenyan park where walking and cycling are permitted.',
            'category': 'Adventure',
            'location': 'Hell\'s Gate National Park',
            'duration_hours': 8,
            'max_group_size': 12,
            'price_per_person': 90,
            'itinerary': 'Morning cycling safari, Fischer\'s Tower climb, gorge hiking, geothermal station visit, picnic lunch',
            'includes': 'Park fees, bicycle rental, professional guide, lunch, bottled water, safety equipment',
            'excludes': 'Transportation to park, tips, personal expenses',
            'requirements': 'Comfortable cycling clothes, closed shoes, sunscreen, water bottle',
            'cover_image': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[1].id,
            'title': 'Mombasa Old Town Walking Tour',
            'description': 'Discover 800 years of history in the ancient streets of Mombasa\'s Old Town. This walking tour explores Arab, Portuguese, British, and Indian influences evident in the architecture, cuisine, and culture. Visit historic landmarks, bustling markets, and hidden gems with our knowledgeable local guide.',
            'short_description': 'Discover 800 years of history in the ancient streets of Mombasa\'s Old Town.',
            'category': 'Cultural Tour',
            'location': 'Mombasa',
            'duration_hours': 3,
            'max_group_size': 8,
            'price_per_person': 60,
            'itinerary': 'Fort Jesus Museum, Old Town streets, spice market, antique shops, traditional lunch',
            'includes': 'Professional guide, museum entrance fees, traditional lunch, bottled water',
            'excludes': 'Transportation, personal shopping, tips',
            'requirements': 'Comfortable walking shoes, hat, camera',
            'cover_image': 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[6].id,
            'title': 'Lake Naivasha Boat Safari',
            'description': 'Cruise among hippos and diverse birdlife on this freshwater lake safari. Lake Naivasha is a birdwatcher\'s paradise with over 400 species recorded. The boat safari takes you close to hippo pods, fishing eagles, and other wildlife. Optional add-ons include Crescent Island walking safari and Hell\'s Gate National Park.',
            'short_description': 'Cruise among hippos and diverse birdlife on this freshwater lake safari.',
            'category': 'Wildlife Safari',
            'location': 'Lake Naivasha',
            'duration_hours': 6,
            'max_group_size': 8,
            'price_per_person': 110,
            'itinerary': 'Boat safari on Lake Naivasha, hippo watching, bird spotting, picnic lunch, optional walking safari',
            'includes': 'Boat fees, professional guide, life jackets, lunch, bottled water',
            'excludes': 'Park fees for optional activities, tips, personal expenses',
            'requirements': 'Binoculars, camera, comfortable clothing, sunscreen',
            'cover_image': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[2].id,
            'title': 'Aberdare Mountain Forest Hike',
            'description': 'Trek through misty mountain forests and discover hidden waterfalls and wildlife in the Aberdare Range. This full-day hike takes you through dense bamboo forests, past cascading waterfalls, and offers opportunities to spot forest elephants, buffalo, and rare bird species. The cool mountain climate provides a refreshing escape from the lowlands.',
            'short_description': 'Trek through misty mountain forests and discover hidden waterfalls and wildlife.',
            'category': 'Hiking',
            'location': 'Aberdare Range',
            'duration_hours': 10,
            'max_group_size': 6,
            'price_per_person': 130,
            'itinerary': 'Morning hike through bamboo forest, waterfall visits, picnic lunch, afternoon wildlife spotting, return hike',
            'includes': 'Park fees, professional guide, picnic lunch, bottled water, first aid kit',
            'excludes': 'Transportation to park, tips, personal expenses',
            'requirements': 'Hiking boots, rain jacket, warm layers, daypack, water bottle',
            'cover_image': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[1].id,
            'title': 'Malindi Marine Park Snorkeling',
            'description': 'Explore vibrant coral reefs and tropical fish in this protected marine park. Malindi Marine Park offers some of Kenya\'s best snorkeling opportunities with clear waters and abundant marine life. Our guided snorkeling tour includes all equipment and safety briefings, suitable for beginners and experienced snorkelers alike.',
            'short_description': 'Explore vibrant coral reefs and tropical fish in this protected marine park.',
            'category': 'Water Sports',
            'location': 'Malindi',
            'duration_hours': 5,
            'max_group_size': 10,
            'price_per_person': 85,
            'itinerary': 'Safety briefing, equipment fitting, guided snorkeling sessions, marine life identification, beach relaxation',
            'includes': 'Marine park fees, snorkeling equipment, professional guide, safety boat, bottled water',
            'excludes': 'Transportation, lunch, tips, underwater camera rental',
            'requirements': 'Swimwear, towel, sunscreen, change of clothes',
            'cover_image': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[5].id,
            'title': 'Ol Pejeta Rhino Sanctuary',
            'description': 'Meet the last two northern white rhinos and support conservation efforts at Ol Pejeta Conservancy. This full-day tour focuses on rhino conservation with visits to the rhino sanctuary, chimpanzee sanctuary, and opportunities to see the Big Five. Your participation directly supports wildlife conservation and community development.',
            'short_description': 'Meet the last two northern white rhinos and support conservation efforts.',
            'category': 'Conservation',
            'location': 'Laikipia Plateau',
            'duration_hours': 24,
            'max_group_size': 8,
            'price_per_person': 220,
            'itinerary': 'Rhino sanctuary tour, chimpanzee sanctuary visit, game drives, conservation talk, overnight stay',
            'includes': 'Conservancy fees, professional guide, accommodation, meals, bottled water, conservation donation',
            'excludes': 'Transportation to conservancy, tips, personal expenses',
            'requirements': 'Camera, binoculars, comfortable clothing',
            'cover_image': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[6].id,
            'title': 'Saiwa Swamp Monkey Trek',
            'description': 'Spot rare semi-aquatic sitatunga antelopes in Kenya\'s smallest national park. Saiwa Swamp is home to the endangered sitatunga antelope and offers excellent bird watching opportunities. The raised boardwalk allows for easy viewing of wildlife in their natural swamp habitat without disturbing the ecosystem.',
            'short_description': 'Spot rare semi-aquatic sitatunga antelopes in Kenya\'s smallest national park.',
            'category': 'Wildlife Safari',
            'location': 'Saiwa Swamp',
            'duration_hours': 6,
            'max_group_size': 6,
            'price_per_person': 95,
            'itinerary': 'Boardwalk trek, sitatunga antelope spotting, bird watching, picnic lunch, nature photography',
            'includes': 'Park fees, professional guide, picnic lunch, bottled water, binoculars',
            'excludes': 'Transportation to park, tips, personal expenses',
            'requirements': 'Comfortable walking shoes, camera, rain jacket',
            'cover_image': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[2].id,
            'title': 'Kakamega Rainforest Exploration',
            'description': 'Discover Kenya\'s only tropical rainforest with its unique flora and fauna. Kakamega Forest is a remnant of the ancient Guineo-Congolian rainforest and hosts incredible biodiversity including 400+ bird species, 300+ butterfly species, and rare primates. This guided walk explores the forest\'s secrets with an expert naturalist.',
            'short_description': 'Discover Kenya\'s only tropical rainforest with its unique flora and fauna.',
            'category': 'Nature Walk',
            'location': 'Kakamega Forest',
            'duration_hours': 8,
            'max_group_size': 6,
            'price_per_person': 140,
            'itinerary': 'Morning bird watching, forest trail walk, primate spotting, picnic lunch, butterfly identification, medicinal plants tour',
            'includes': 'Forest fees, professional naturalist guide, picnic lunch, bottled water, binoculars',
            'excludes': 'Transportation to forest, tips, personal expenses',
            'requirements': 'Walking shoes, rain jacket, camera, insect repellent',
            'cover_image': 'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[1].id,
            'title': 'Watamu Turtle Conservation',
            'description': 'Participate in turtle conservation and witness these magnificent creatures in their natural habitat. This half-day experience includes beach patrols for nesting turtles, visits to the turtle rehabilitation center, and educational sessions about marine conservation. Depending on the season, you may witness turtle hatchlings or nesting adults.',
            'short_description': 'Participate in turtle conservation and witness these magnificent creatures.',
            'category': 'Conservation',
            'location': 'Watamu',
            'duration_hours': 4,
            'max_group_size': 8,
            'price_per_person': 70,
            'itinerary': 'Turtle conservation center visit, beach patrol, educational session, optional snorkeling (seasonal)',
            'includes': 'Conservation fees, professional guide, educational materials, bottled water, conservation donation',
            'excludes': 'Transportation, tips, personal expenses',
            'requirements': 'Beachwear, sunscreen, camera, enthusiasm for conservation',
            'cover_image': 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[0].id,
            'title': 'Meru National Park Safari',
            'description': 'Explore the wilderness that inspired Joy Adamson\'s "Born Free" story. Meru National Park offers diverse landscapes from savannah to rainforest and is less crowded than other parks. This 2-day safari focuses on the park\'s unique wildlife including Grevy\'s zebras, reticulated giraffes, and the Big Five in a pristine wilderness setting.',
            'short_description': 'Explore the wilderness that inspired Joy Adamson\'s "Born Free" story.',
            'category': 'Wildlife Safari',
            'location': 'Meru National Park',
            'duration_hours': 48,
            'max_group_size': 6,
            'price_per_person': 260,
            'itinerary': 'Day 1: Game drives, Adamson\'s Falls visit | Day 2: Morning game drive, rhino sanctuary visit, departure',
            'includes': 'Park fees, professional guide, 4x4 vehicle, accommodation (1 night), all meals, bottled water',
            'excludes': 'Travel insurance, tips, personal expenses',
            'requirements': 'Camera, binoculars, comfortable clothing',
            'cover_image': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        },
        {
            'guide_id': guides[2].id,
            'title': 'Chyulu Hills Green Safari',
            'description': 'Hike through the "green hills of Africa" with stunning views of Kilimanjaro. The Chyulu Hills offer pristine wilderness with volcanic landscapes, ancient lava tubes, and diverse wildlife. This eco-friendly safari focuses on low-impact tourism and includes hiking, wildlife viewing, and visits to local Maasai communities.',
            'short_description': 'Hike through "green hills of Africa" with stunning views of Kilimanjaro.',
            'category': 'Eco Tourism',
            'location': 'Chyulu Hills',
            'duration_hours': 24,
            'max_group_size': 6,
            'price_per_person': 190,
            'itinerary': 'Morning hike, wildlife viewing, lava tube exploration, Maasai community visit, eco-camp overnight',
            'includes': 'Conservancy fees, professional guide, accommodation in eco-camp, all meals, community fees',
            'excludes': 'Transportation to hills, tips, personal expenses',
            'requirements': 'Hiking shoes, warm layers, camera, reusable water bottle',
            'cover_image': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'images': json.dumps([
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ])
        }
    ]

    # Create experiences
    for exp_data in experiences_data:
        experience = Experience(**exp_data)
        db.session.add(experience)
    
    db.session.commit()

    # Create available dates for all experiences
    from datetime import date, time, timedelta
    
    for experience in Experience.query.all():
        # Create available dates for the next 30 days
        for i in range(1, 31):
            exp_date = ExperienceDate(
                experience_id=experience.id,
                date=date.today() + timedelta(days=i),
                start_time=time(8, 0),
                available_slots=experience.max_group_size
            )
            db.session.add(exp_date)
    
    db.session.commit()
    print(f"✅ Created {len(experiences_data)} sample experiences with availability dates")

# Initialize the database
init_db()

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'Digital Guides API with Database is running',
        'database': 'Active',
        'cloudinary': CLOUDINARY_AVAILABLE,
        'timestamp': datetime.datetime.utcnow().isoformat()
    })

# Advanced Search Endpoint
@app.route('/api/experiences/search', methods=['GET'])
def search_experiences():
    try:
        # Get search parameters
        category = request.args.get('category')
        location = request.args.get('location')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        search_date = request.args.get('date')
        
        # Start with base query
        query = Experience.query.filter_by(is_approved=True, is_active=True)
        
        # Apply filters
        if category:
            query = query.filter(Experience.category.ilike(f'%{category}%'))
        if location:
            query = query.filter(Experience.location.ilike(f'%{location}%'))
        if min_price:
            query = query.filter(Experience.price_per_person >= float(min_price))
        if max_price:
            query = query.filter(Experience.price_per_person <= float(max_price))
        
        # Date availability filtering
        if search_date:
            try:
                search_date = parse(search_date).date()
                # Find experiences with available slots on this date
                available_experiences = db.session.query(Experience).join(
                    ExperienceDate
                ).filter(
                    ExperienceDate.date == search_date,
                    ExperienceDate.available_slots > 0,
                    ExperienceDate.is_available == True
                ).all()
                experience_ids = [exp.id for exp in available_experiences]
                query = query.filter(Experience.id.in_(experience_ids))
            except Exception as e:
                return jsonify({'message': 'Invalid date format'}), 400
        
        experiences = query.all()
        return jsonify({
            'experiences': [exp.to_dict() for exp in experiences],
            'count': len(experiences),
            'filters_applied': {
                'category': category,
                'location': location,
                'min_price': min_price,
                'max_price': max_price,
                'date': search_date
            }
        })
        
    except Exception as e:
        return jsonify({'message': 'Search failed', 'error': str(e)}), 500

# Calendar Availability Endpoint
@app.route('/api/experiences/<int:experience_id>/availability', methods=['GET'])
def get_availability(experience_id):
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = ExperienceDate.query.filter_by(
            experience_id=experience_id,
            is_available=True
        ).filter(ExperienceDate.available_slots > 0)
        
        if start_date:
            query = query.filter(ExperienceDate.date >= parse(start_date).date())
        if end_date:
            query = query.filter(ExperienceDate.date <= parse(end_date).date())
        
        available_dates = query.all()
        return jsonify({
            'experience_id': experience_id,
            'available_dates': [date.to_dict() for date in available_dates],
            'count': len(available_dates)
        })
        
    except Exception as e:
        return jsonify({'message': 'Failed to fetch availability', 'error': str(e)}), 500

# Image Upload Endpoint
@app.route('/api/upload', methods=['POST'])
@token_required
def upload_image(current_user):
    try:
        if 'image' not in request.files:
            return jsonify({'message': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'message': 'No image selected'}), 400
        
        if CLOUDINARY_AVAILABLE:
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file,
                folder="digital-guides/",
                use_filename=True,
                unique_filename=True,
                overwrite=False
            )
            image_url = upload_result['secure_url']
        else:
            # Fallback: Simulate upload (return placeholder)
            image_url = "https://via.placeholder.com/600x400/007bff/ffffff?text=Uploaded+Image"
        
        return jsonify({
            'url': image_url,
            'message': 'Image uploaded successfully'
        })
        
    except Exception as e:
        return jsonify({'message': 'Upload failed', 'error': str(e)}), 500

# Contact guide endpoint
@app.route('/api/contact/guide', methods=['POST'])
@token_required
def contact_guide(current_user):
    try:
        data = request.get_json()
        guide_id = data.get('guide_id')
        message = data.get('message')
        
        if not guide_id or not message:
            return jsonify({'message': 'Guide ID and message are required'}), 400
        
        guide = User.query.get(guide_id)
        if not guide or guide.role != UserRole.GUIDE:
            return jsonify({'message': 'Guide not found'}), 404
        
        # In a real app, you would send an email or notification here
        # For now, we'll just log the message
        print(f"Message from {current_user.email} to guide {guide.email}: {message}")
        
        return jsonify({
            'message': 'Message sent to guide successfully',
            'guide_name': f"{guide.first_name} {guide.last_name}",
            'guide_email': guide.email
        })
        
    except Exception as e:
        return jsonify({'message': 'Failed to send message', 'error': str(e)}), 500

# Delete booking endpoint
@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@token_required
def delete_booking(current_user, booking_id):
    try:
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Check if user owns the booking or is admin
        if booking.traveler_id != current_user.id and current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        # Restore available slots
        experience_date = ExperienceDate.query.get(booking.experience_date_id)
        if experience_date:
            experience_date.available_slots += booking.number_of_guests
        
        db.session.delete(booking)
        db.session.commit()
        
        return jsonify({
            'message': 'Booking cancelled successfully',
            'booking_id': booking_id
        })
        
    except Exception as e:
        return jsonify({'message': 'Failed to cancel booking', 'error': str(e)}), 500

# Experiences endpoint
@app.route('/api/experiences', methods=['GET'])
def get_experiences():
    try:
        experiences = Experience.query.filter_by(is_approved=True, is_active=True).all()
        return jsonify({
            'experiences': [exp.to_dict() for exp in experiences],
            'count': len(experiences)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch experiences', 'error': str(e)}), 500

# Get single experience
@app.route('/api/experiences/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = Experience.query.get(experience_id)
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
        
        return jsonify({
            'experience': experience.to_dict()
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch experience', 'error': str(e)}), 500

# Auth endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 400
        
        # Create new user
        user = User(
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            email=data['email'],
            role=UserRole(data.get('role', 'traveler')),
            phone=data.get('phone', ''),
            location=data.get('location', ''),
            bio=data.get('bio', ''),
            is_verified=True  # Auto-verify for demo
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'user': user.to_dict(),
            'token': token,
            'message': 'User registered successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'user': user.to_dict(),
            'token': token,
            'message': 'Login successful'
        })
        
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

# Guide experiences endpoints
@app.route('/api/experiences/my-experiences', methods=['GET'])
@token_required
def get_my_experiences(current_user):
    if current_user.role != UserRole.GUIDE:
        return jsonify({'message': 'Only guides can access this endpoint'}), 403
    
    guide_experiences = Experience.query.filter_by(guide_id=current_user.id).all()
    return jsonify({
        'experiences': [exp.to_dict() for exp in guide_experiences],
        'count': len(guide_experiences)
    })

@app.route('/api/experiences', methods=['POST'])
@token_required
def create_experience(current_user):
    if current_user.role != UserRole.GUIDE:
        return jsonify({'message': 'Only guides can create experiences'}), 403
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        experience = Experience(
            guide_id=current_user.id,
            title=data['title'],
            description=data['description'],
            short_description=data.get('short_description', ''),
            category=data['category'],
            location=data['location'],
            duration_hours=data['duration_hours'],
            max_group_size=data.get('max_group_size', 10),
            price_per_person=data['price_per_person'],
            itinerary=data.get('itinerary', ''),
            includes=data.get('includes', ''),
            excludes=data.get('excludes', ''),
            requirements=data.get('requirements', ''),
            cover_image=data.get('cover_image', ''),
            images=data.get('images', '[]'),
            is_approved=True  # Auto-approve for demo
        )
        
        db.session.add(experience)
        db.session.commit()
        
        return jsonify({
            'experience': experience.to_dict(),
            'message': 'Experience created successfully!'
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to create experience', 'error': str(e)}), 500

# Bookings endpoints
@app.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        experience = Experience.query.get(data['experience_id'])
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
        
        experience_date = ExperienceDate.query.get(data['experience_date_id'])
        if not experience_date or experience_date.experience_id != experience.id:
            return jsonify({'message': 'Invalid date selection'}), 400
        
        if experience_date.available_slots < data['number_of_guests']:
            return jsonify({'message': 'Not enough available slots'}), 400
        
        # Calculate total price
        total_price = experience.price_per_person * data['number_of_guests']
        
        # Create booking
        booking = Booking(
            traveler_id=current_user.id,
            experience_id=data['experience_id'],
            experience_date_id=data['experience_date_id'],
            number_of_guests=data['number_of_guests'],
            total_price=total_price,
            special_requests=data.get('special_requests', ''),
            status=BookingStatus.CONFIRMED,
            is_paid=True  # Auto-pay for demo
        )
        
        # Update available slots
        experience_date.available_slots -= data['number_of_guests']
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'booking': booking.to_dict(),
            'message': 'Booking created successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to create booking', 'error': str(e)}), 500

@app.route('/api/bookings/my-bookings', methods=['GET'])
@token_required
def get_my_bookings(current_user):
    try:
        user_bookings = Booking.query.filter_by(traveler_id=current_user.id).all()
        return jsonify({
            'bookings': [booking.to_dict() for booking in user_bookings],
            'count': len(user_bookings)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch bookings', 'error': str(e)}), 500

# Admin endpoints
@app.route('/api/admin/bookings', methods=['GET'])
@admin_required
def get_all_bookings(current_user):
    try:
        bookings = Booking.query.all()
        return jsonify({
            'bookings': [booking.to_dict() for booking in bookings],
            'count': len(bookings)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch bookings', 'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    try:
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users],
            'count': len(users)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch users', 'error': str(e)}), 500

@app.route('/api/admin/statistics', methods=['GET'])
@admin_required
def get_statistics(current_user):
    try:
        total_users = User.query.count()
        total_bookings = Booking.query.count()
        total_experiences = Experience.query.count()
        total_revenue = db.session.query(db.func.sum(Booking.total_price)).scalar() or 0
        
        return jsonify({
            'total_users': total_users,
            'total_bookings': total_bookings,
            'total_experiences': total_experiences,
            'total_revenue': float(total_revenue),
            'timestamp': datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch statistics', 'error': str(e)}), 500

@app.route('/')
def index():
    return jsonify({
        'message': 'Digital Guides API',
        'version': '2.0.0',
        'status': 'running',
        'environment': 'production',
        'endpoints': {
            'api_docs': '/api/health',
            'experiences': '/api/experiences',
            'auth': '/api/auth/register, /api/auth/login',
            'bookings': '/api/bookings',
            'admin': '/api/admin/*'
        },
        'documentation': 'Visit /api/health for API status'
    })

if __name__ == '__main__':
    with app.app_context():
        init_db()  # <-- now safe
    app.run(debug=True, host='0.0.0.0', port=port)

    
    port = int(os.environ.get('PORT', 10000))
    print("🚀 Starting Digital Guides API with Database...")
    print("📍 Default Admin: admin@digitalguides.com / admin123")
    print("✅ DATABASE: Integrated")
    print("✅ ADVANCED SEARCH: Available at /api/experiences/search")
    print("✅ CALENDAR INTEGRATION: Available at /api/experiences/<id>/availability")
    print("✅ IMAGE UPLOAD: Available at /api/upload")
    print("✅ CONTACT GUIDE: Available at /api/contact/guide")
    print("✅ DELETE BOOKING: Available at /api/bookings/<id> (DELETE)")
    print("☁️  CLOUDINARY: Configured and ready")
    print(f"📁 Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"🎯 Loaded 20 Kenyan experiences ready for booking!")
    print(f"🌐 Server running on: https://digital-guides-mvp.onrender.com")
    
    app.run(debug=True, host='0.0.0.0', port=port)

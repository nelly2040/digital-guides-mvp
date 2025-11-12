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
                'description': 'Witness the spectacular Great Migration in the Maasai Mara. See millions of wildebeest and zebra cross the Mara River with expert guides.',
                'price': 450.00,
                'duration_hours': 72,
                'category': Category.ADVENTURE,
                'location': 'Maasai Mara National Reserve',
                'itinerary': '3-day luxury safari with game drives, cultural visits, and gourmet bush meals.',
                'photos': [
                    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-07-15', '2025-07-22', '2025-08-05'],
                'guide_id': guide1.id
            },
            {
                'title': 'Amboseli Elephant Safari with Kilimanjaro Views',
                'description': 'Experience Amboseli National Park with large elephant herds and stunning Mount Kilimanjaro backdrop.',
                'price': 280.00,
                'duration_hours': 48,
                'category': Category.ADVENTURE,
                'location': 'Amboseli National Park',
                'itinerary': '2-day safari focusing on elephant behavior and photography opportunities.',
                'photos': [
                    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-20', '2025-01-27', '2025-02-03'],
                'guide_id': guide1.id
            },
            {
                'title': 'Samburu Special Five Safari Adventure',
                'description': 'Discover unique wildlife in Samburu National Reserve, home to the "Special Five" rare species.',
                'price': 320.00,
                'duration_hours': 60,
                'category': Category.ADVENTURE,
                'location': 'Samburu National Reserve',
                'itinerary': '3-day safari focusing on northern Kenya\'s unique wildlife and landscapes.',
                'photos': [
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-03-10', '2025-03-17', '2025-03-24'],
                'guide_id': guide1.id
            },
            {
                'title': 'Lake Nakuru Flamingo & Rhino Sanctuary Experience',
                'description': 'Visit Lake Nakuru National Park, famous for flamingo populations and successful rhino conservation.',
                'price': 180.00,
                'duration_hours': 24,
                'category': Category.ADVENTURE,
                'location': 'Lake Nakuru National Park',
                'itinerary': 'Day trip focusing on bird watching and rhino conservation.',
                'photos': [
                    'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-15', '2025-01-22', '2025-01-29'],
                'guide_id': guide1.id
            },
            {
                'title': 'Tsavo East & West Combined Wilderness Safari',
                'description': 'Explore Kenya\'s largest protected area spanning Tsavo East and West National Parks.',
                'price': 380.00,
                'duration_hours': 72,
                'category': Category.ADVENTURE,
                'location': 'Tsavo East & West National Parks',
                'itinerary': '3-day adventure covering diverse landscapes and wildlife.',
                'photos': [
                    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-02-05', '2025-02-12', '2025-02-19'],
                'guide_id': guide1.id
            },
            
            # Cultural Experiences
            {
                'title': 'Maasai Village Cultural Immersion Experience',
                'description': 'Spend a day living as the Maasai do in an authentic village experience.',
                'price': 75.00,
                'duration_hours': 6,
                'category': Category.CULTURE,
                'location': 'Maasai Mara Region',
                'itinerary': 'Full day immersion in Maasai traditions, crafts, and daily life.',
                'photos': [
                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-18', '2025-01-25', '2025-02-01'],
                'guide_id': guide1.id
            },
            {
                'title': 'Lamu Island Swahili Heritage Experience',
                'description': 'Step back in time on the magical island of Lamu, a UNESCO World Heritage site.',
                'price': 120.00,
                'duration_hours': 8,
                'category': Category.CULTURE,
                'location': 'Lamu Island',
                'itinerary': 'Full day exploring Swahili culture, architecture, and traditions.',
                'photos': [
                    'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-20', '2025-01-27', '2025-02-03'],
                'guide_id': guide2.id
            },
            {
                'title': 'Kikuyu Traditional Ceremonies & Cultural Exchange',
                'description': 'Participate in authentic Kikuyu traditional ceremonies and cultural exchange.',
                'price': 60.00,
                'duration_hours': 5,
                'category': Category.CULTURE,
                'location': 'Central Kenya Highlands',
                'itinerary': 'Cultural day program with traditional activities and shared meals.',
                'photos': [
                    'https://images.unsplash.com/photo-1551818250-22ac6d1a16d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-22', '2025-01-29', '2025-02-05'],
                'guide_id': guide1.id
            },
            
            # Food Experiences
            {
                'title': 'Nairobi Street Food & Market Adventure Tour',
                'description': 'Discover the vibrant flavors of Nairobi through its bustling markets and street food.',
                'price': 45.00,
                'duration_hours': 3,
                'category': Category.FOOD,
                'location': 'Nairobi',
                'itinerary': 'Evening food tour sampling 10+ local dishes and street snacks.',
                'photos': [
                    'https://images.unsplash.com/photo-1562569633-622763f96b85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-16', '2025-01-18', '2025-01-23'],
                'guide_id': guide1.id
            },
            {
                'title': 'Coastal Swahili Cooking Class & Spice Farm Visit',
                'description': 'Learn to cook authentic Swahili dishes in a traditional coastal setting.',
                'price': 55.00,
                'duration_hours': 4,
                'category': Category.FOOD,
                'location': 'Mombasa',
                'itinerary': 'Hands-on cooking class with spice farm visit and meal enjoyment.',
                'photos': [
                    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-19', '2025-01-26', '2025-02-02'],
                'guide_id': guide2.id
            },
            {
                'title': 'Kenyan Coffee Farm Tour & Premium Tasting Experience',
                'description': 'Visit a coffee farm and learn about production from bean to cup.',
                'price': 40.00,
                'duration_hours': 4,
                'category': Category.FOOD,
                'location': 'Kiambu County',
                'itinerary': 'Coffee farm tour with tasting session and brewing workshop.',
                'photos': [
                    'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-21', '2025-01-28', '2025-02-04'],
                'guide_id': guide1.id
            },
            
            # Adventure Experiences
            {
                'title': 'Mount Kenya Summit Trek to Point Lenana - 5 Days',
                'description': 'Conquer the second-highest peak in Africa on this 5-day trek.',
                'price': 520.00,
                'duration_hours': 120,
                'category': Category.ADVENTURE,
                'location': 'Mount Kenya National Park',
                'itinerary': '5-day trek through diverse ecosystems with professional guides.',
                'photos': [
                    'https://images.unsplash.com/photo-1464822759849-e2c4e21dc5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-02-10', '2025-02-17', '2025-02-24'],
                'guide_id': guide3.id
            },
            {
                'title': 'Hell\'s Gate National Park Cycling & Hiking Safari',
                'description': 'Cycle and hike through Hell\'s Gate National Park with wildlife viewing.',
                'price': 65.00,
                'duration_hours': 6,
                'category': Category.ADVENTURE,
                'location': 'Hell\'s Gate National Park',
                'itinerary': 'Cycling safari with hiking, rock climbing, and geothermal spa.',
                'photos': [
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-17', '2025-01-24', '2025-01-31'],
                'guide_id': guide3.id
            },
            {
                'title': 'Diani Beach Kitesurfing Lessons',
                'description': 'Learn kitesurfing on beautiful Diani Beach with certified instructors.',
                'price': 90.00,
                'duration_hours': 3,
                'category': Category.ADVENTURE,
                'location': 'Diani Beach',
                'itinerary': 'Kitesurfing lessons with safety training and water practice.',
                'photos': [
                    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-25', '2025-02-01', '2025-02-08'],
                'guide_id': guide2.id
            },
            {
                'title': 'Watamu Marine Park Snorkeling Adventure',
                'description': 'Explore coral gardens and diverse marine life in Watamu Marine Park.',
                'price': 50.00,
                'duration_hours': 4,
                'category': Category.ADVENTURE,
                'location': 'Watamu',
                'itinerary': 'Boat trip with snorkeling sessions and marine life education.',
                'photos': [
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-26', '2025-02-02', '2025-02-09'],
                'guide_id': guide2.id
            },
            
            # Additional experiences
            {
                'title': 'Nairobi National Park Half-Day Safari',
                'description': 'Experience wildlife viewing with a city skyline backdrop.',
                'price': 85.00,
                'duration_hours': 5,
                'category': Category.ADVENTURE,
                'location': 'Nairobi',
                'itinerary': 'Morning game drive in the world\'s only wildlife capital.',
                'photos': [
                    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-15', '2025-01-17', '2025-01-19'],
                'guide_id': guide1.id
            },
            {
                'title': 'Lake Naivasha Boat Ride & Crescent Island',
                'description': 'Boat ride among hippos and walk among wildlife on Crescent Island.',
                'price': 70.00,
                'duration_hours': 6,
                'category': Category.ADVENTURE,
                'location': 'Lake Naivasha',
                'itinerary': 'Boat ride and walking safari with picnic lunch.',
                'photos': [
                    'https://images.unsplash.com/photo-1573848953218-44c310bc6bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-20', '2025-01-27', '2025-02-03'],
                'guide_id': guide1.id
            },
            {
                'title': 'Karen Blixen Museum & Giraffe Centre',
                'description': 'Visit Karen Blixen Museum and hand-feed giraffes at Giraffe Centre.',
                'price': 35.00,
                'duration_hours': 4,
                'category': Category.CULTURE,
                'location': 'Nairobi',
                'itinerary': 'Cultural and wildlife combination tour.',
                'photos': [
                    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-18', '2025-01-25', '2025-02-01'],
                'guide_id': guide1.id
            },
            {
                'title': 'Mombasa Old Town & Fort Jesus',
                'description': 'Explore historical Fort Jesus and ancient streets of Mombasa Old Town.',
                'price': 40.00,
                'duration_hours': 4,
                'category': Category.CULTURE,
                'location': 'Mombasa',
                'itinerary': 'Historical tour with museum and market visits.',
                'photos': [
                    'https://images.unsplash.com/photo-1573843981268-32d0bc9e7dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-22', '2025-01-29', '2025-02-05'],
                'guide_id': guide2.id
            },
            {
                'title': 'Sagana White Water Rafting Adventure',
                'description': 'Experience thrilling white water rafting on the Sagana River.',
                'price': 75.00,
                'duration_hours': 5,
                'category': Category.ADVENTURE,
                'location': 'Sagana',
                'itinerary': 'White water rafting with safety briefing and riverside lunch.',
                'photos': [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-24', '2025-01-31', '2025-02-07'],
                'guide_id': guide3.id
            },
            {
                'title': 'Ol Pejeta Conservancy Rhino Tracking',
                'description': 'Track rhinos and visit the last two northern white rhinos.',
                'price': 110.00,
                'duration_hours': 8,
                'category': Category.ADVENTURE,
                'location': 'Ol Pejeta Conservancy',
                'itinerary': 'Rhino tracking and conservation education.',
                'photos': [
                    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                'available_dates': ['2025-01-26', '2025-02-02', '2025-02-09'],
                'guide_id': guide1.id
            }
        ]
        
        # Create all experiences
        for exp_data in experiences_data:
            experience = Experience(
                title=exp_data['title'],
                description=exp_data['description'],
                price=exp_data['price'],
                duration_hours=exp_data['duration_hours'],
                category=exp_data['category'],
                location=exp_data['location'],
                itinerary=exp_data['itinerary'],
                photos=json.dumps(exp_data['photos']),
                available_dates=json.dumps(exp_data['available_dates']),
                guide_id=exp_data['guide_id']
            )
            db.session.add(experience)
        
        db.session.commit()
        print(f"✅ Created {len(experiences_data)} comprehensive experiences")
        
        # Create a completed booking for review testing
        booking = Booking(
            experience_id=1,  # First experience
            traveler_id=traveler_user.id,
            tour_date=datetime.strptime('2025-01-15', '%Y-%m-%d'),
            guest_count=2,
            total_amount=900.00,
            status='completed'
        )
        db.session.add(booking)
        db.session.commit()
        print("✅ Created booking")
        
        # Review for the booking
        review = Review(
            booking_id=booking.id,
            experience_id=1,
            rating=5,
            comment='''Absolutely incredible experience! John's knowledge of wildlife and Maasai culture made this safari unforgettable. We saw the Big Five and the accommodation was exceptional. Highly recommend!'''
        )
        db.session.add(review)
        db.session.commit()
        print("✅ Created review")
        
        print("🎉 Database seeded successfully with 20+ detailed Kenyan experiences!")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Seeding failed: {str(e)}")
        raise

# Initialize database and seed data
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created successfully")
        seed_database()
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")

if __name__ == '__main__':
    app.run(debug=True)
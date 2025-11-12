from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Profile, Experience, Category, UserRole, Booking, Review
from routes import auth, experiences, bookings, admin, reviews
import json
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
db.init_app(app)

app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(experiences.bp, url_prefix='/api/experiences')
app.register_blueprint(bookings.bp, url_prefix='/api/bookings')
app.register_blueprint(admin.bp, url_prefix='/api/admin')
app.register_blueprint(reviews.bp, url_prefix='/api/reviews')

@app.route('/')
def home():
    return jsonify({'message': 'Digital Guides API - Authentic Kenyan Experiences'})

def seed_database():
    """Seed the database with rich, detailed Kenyan experiences"""
    print("Creating seed data...")
    
    # Check if we already have data
    if User.query.first():
        print("Database already seeded, skipping...")
        return
    
    try:
        # Create users first and commit to get their IDs
        admin_user = User(auth0_id='admin-test', email='admin@digitalguides.com', role=UserRole.ADMIN)
        guide_user = User(auth0_id='guide-test', email='john@kenyanguides.com', role=UserRole.GUIDE)
        traveler_user = User(auth0_id='traveler-test', email='traveler@test.com', role=UserRole.TRAVELER)
        
        db.session.add_all([admin_user, guide_user, traveler_user])
        db.session.commit()
        print("Created users")
        
        # Now create profiles with the actual user IDs
        admin_profile = Profile(user_id=admin_user.id, name='Admin', location='Nairobi', is_approved=True)
        guide_profile = Profile(
            user_id=guide_user.id, 
            name='John Mwangi', 
            bio='5th generation Kenyan with 15+ years experience in tourism. Certified safari guide with deep knowledge of Maasai culture and wildlife behavior. Fluent in English, Swahili, and Maa.',
            location='Nairobi, Kenya', 
            is_approved=True,
            avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        )
        traveler_profile = Profile(user_id=traveler_user.id, name='Sarah Johnson', location='New York, USA')
        
        db.session.add_all([admin_profile, guide_profile, traveler_profile])
        db.session.commit()
        print("Created profiles")
        
        # Comprehensive Kenyan Experiences
        
        # 1. Maasai Mara Safari
        exp1 = Experience(
            title='Premium Maasai Mara Safari Experience',
            description='''Embark on an unforgettable 3-day safari adventure in the world-famous Maasai Mara National Reserve. Witness the Great Migration (seasonal), spot the Big Five, and immerse yourself in one of Africa's most spectacular wildlife destinations. Our expert guides will take you through diverse ecosystems teeming with lions, elephants, cheetahs, and countless other species.

Highlights:
• Early morning and late afternoon game drives for optimal wildlife viewing
• Visit to a traditional Maasai village for cultural immersion
• Professional photography guidance for capturing perfect shots
• Luxury tented accommodation with modern amenities
• Gourmet bush meals prepared by our camp chef

Perfect for wildlife enthusiasts, photographers, and families seeking an authentic African safari experience.''',
            price=450.00, 
            duration_hours=72, 
            category=Category.ADVENTURE,
            location='Maasai Mara National Reserve, Kenya', 
            itinerary='''
Day 1:
06:00 - Depart from Nairobi in our custom safari vehicles
10:00 - Arrive at Maasai Mara, welcome drinks at camp
11:00 - Lunch and orientation
15:00 - Afternoon game drive until sunset
19:00 - Dinner under the stars, wildlife sounds briefing

Day 2:
06:00 - Sunrise game drive (best for predator activity)
09:00 - Breakfast at camp
11:00 - Visit authentic Maasai village, cultural exchange
13:00 - Lunch and rest period
16:00 - Evening game drive focusing on big cats
19:30 - Bush dinner with traditional music

Day 3:
06:30 - Final morning game drive
09:00 - Breakfast and pack-up
10:30 - Depart for Nairobi with picnic lunch
15:00 - Arrive back in Nairobi''',
            photos=json.dumps([
                'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ]),
            available_dates=json.dumps(['2025-01-15', '2025-01-22', '2025-01-29', '2025-02-05', '2025-02-12']),
            guide_id=guide_user.id
        )
        
        # 2. Nairobi Food Tour
        exp2 = Experience(
            title='Nairobi Street Food & Market Adventure',
            description='''Discover the vibrant flavors of Nairobi through its bustling markets and hidden street food gems. This culinary journey takes you through the heart of the city's food scene, from traditional Kenyan dishes to modern fusion cuisine. Sample authentic nyama choma (grilled meat), taste exotic fruits at City Market, and learn about the cultural significance of Kenyan cuisine.

What you'll experience:
• Taste 10+ different Kenyan dishes and beverages
• Visit local markets and learn about indigenous ingredients
• Interactive cooking demonstration of ugali and sukuma wiki
• Meet local food artisans and hear their stories
• Explore hidden culinary spots only locals know about

Dietary restrictions accommodated. Perfect for food lovers and cultural explorers.''',
            price=65.00, 
            duration_hours=4, 
            category=Category.FOOD,
            location='Nairobi, Kenya', 
            itinerary='''
14:00 - Meet at central Nairobi location, safety briefing
14:30 - Start at City Market: fruit tasting and spice education
15:30 - Toi Market exploration: sample mandazi and samosas
16:30 - Local restaurant visit: ugali, sukuma wiki, nyama choma
17:30 - Street food alley: try mutura and grilled maize
18:00 - Traditional tea house: chai and storytelling
18:30 - Dessert stop: mahamri and coconut rice
19:00 - End with local craft beer tasting, farewell''',
            photos=json.dumps([
                'https://images.unsplash.com/photo-1562569633-622763f96b85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1576867755383-5df3ac5d32b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ]),
            available_dates=json.dumps(['2025-01-10', '2025-01-12', '2025-01-15', '2025-01-17', '2025-01-19', '2025-01-22']),
            guide_id=guide_user.id
        )
        
        # 3. Lamu Island Cultural Immersion
        exp3 = Experience(
            title='Lamu Island: Swahili Culture & Dhow Sailing',
            description='''Step back in time on the magical island of Lamu, a UNESCO World Heritage site. Experience the rich Swahili culture, ancient architecture, and tranquil island life. Sail on traditional dhows, explore narrow stone streets, and immerse yourself in centuries-old traditions that continue to thrive.

Experience includes:
• Traditional dhow sailing trip to nearby islands
• Guided tour of Lamu Old Town with historian insights
• Swahili cooking class in a local family home
• Visit to Takwa Ruins and learning about Swahili history
• Sunset cruise with traditional music and refreshments

This is a slow-paced, culturally rich experience perfect for history buffs and those seeking authentic connections.''',
            price=120.00, 
            duration_hours=8, 
            category=Category.CULTURE,
            location='Lamu Island, Kenya', 
            itinerary='''
08:00 - Morning dhow sailing to Manda Island
09:30 - Explore Takwa Ruins with historical context
11:00 - Snorkeling in crystal-clear waters
12:30 - Beachside Swahili lunch preparation
14:00 - Lamu Old Town walking tour: architecture and history
16:00 - Swahili cooking class with local family
18:00 - Sunset dhow cruise with traditional music
19:30 - Return to Lamu, evening market visit''',
            photos=json.dumps([
                'https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1573848953218-44c310bc6bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1573843981268-32d0bc9e7dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ]),
            available_dates=json.dumps(['2025-01-08', '2025-01-11', '2025-01-14', '2025-01-18', '2025-01-21']),
            guide_id=guide_user.id
        )
        
        # 4. Mount Kenya Trekking
        exp4 = Experience(
            title='Mount Kenya Summit Challenge - Point Lenana',
            description='''Conquer the second-highest peak in Africa on this exhilarating 4-day trek to Point Lenana (4,985m). Experience diverse ecosystems from rainforest to alpine desert, witness stunning sunrise from the summit, and challenge yourself in one of Africa\'s most rewarding climbs. Our certified mountain guides ensure safety while providing fascinating insights into the mountain\'s geology and ecology.

Trip includes:
• All park fees and permits included
• Professional mountain guide and porters
• Quality camping equipment and mess tent
• Nutritious meals designed for high altitude
• Comprehensive safety equipment and protocols
• Small group size (max 6 people) for personalized attention

Previous hiking experience recommended. Suitable for physically fit adventurers.''',
            price=320.00, 
            duration_hours=96, 
            category=Category.ADVENTURE,
            location='Mount Kenya National Park', 
            itinerary='''
Day 1: 
08:00 - Meet in Nanyuki, gear check and briefing
10:00 - Start trek through rainforest to Old Moses Camp (3,300m)
16:00 - Arrive at camp, acclimatization walk
18:00 - Dinner and altitude briefing

Day 2:
07:00 - Breakfast and pack-up
08:00 - Trek through moorland to Shipton's Camp (4,200m)
15:00 - Arrive at camp, rest and acclimatize
18:00 - Dinner, summit preparation

Day 3:
02:00 - Early start for summit attempt
06:30 - Reach Point Lenana for sunrise
08:00 - Descend to Shipton's Camp
12:00 - Lunch and rest
14:00 - Optional afternoon exploration

Day 4:
07:00 - Breakfast and descend to park gate
14:00 - Transfer back to Nanyuki, certificate ceremony''',
            photos=json.dumps([
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1464822759849-e2c4e21dc5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1464822759849-e2c4e21dc5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ]),
            available_dates=json.dumps(['2025-01-20', '2025-01-27', '2025-02-03', '2025-02-10']),
            guide_id=guide_user.id
        )
        
        # 5. Nairobi National Park Safari
        exp5 = Experience(
            title='Nairobi National Park: Wildlife with City Skyline',
            description='''Experience the unique contrast of wild animals against a modern city skyline at Nairobi National Park, the world\'s only wildlife capital. This half-day safari offers incredible game viewing just minutes from the city center. See lions, giraffes, rhinos, and more with the Nairobi skyline as your backdrop.

Tour highlights:
• Morning game drive for optimal animal activity
• Visit to the Ivory Burning Site Monument
• Animal Orphanage tour (optional)
• Professional photography opportunities
• Knowledgeable guide with wildlife expertise

Perfect for travelers with limited time, families with children, or those wanting a convenient safari experience.''',
            price=85.00, 
            duration_hours=5, 
            category=Category.ADVENTURE,
            location='Nairobi National Park, Kenya', 
            itinerary='''
06:00 - Hotel pickup in Nairobi
06:30 - Enter Nairobi National Park, start morning game drive
08:30 - Stop at Ivory Burning Site for history lesson
09:00 - Continue game drive, focus on rhino spotting
10:30 - Breakfast picnic at scenic viewpoint
11:30 - Final game drive circuit
12:30 - Exit park, optional Animal Orphanage visit
13:00 - Return to Nairobi hotels''',
            photos=json.dumps([
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ]),
            available_dates=json.dumps(['2025-01-09', '2025-01-11', '2025-01-13', '2025-01-16', '2025-01-18', '2025-01-20']),
            guide_id=guide_user.id
        )
        
        db.session.add_all([exp1, exp2, exp3, exp4, exp5])
        db.session.commit()
        print("Created 5 comprehensive experiences")
        
        # Create a completed booking for review testing
        booking = Booking(
            experience_id=exp1.id,
            traveler_id=traveler_user.id,
            tour_date=datetime.strptime('2025-01-15', '%Y-%m-%d'),
            guest_count=2,
            total_amount=900.00,
            status='completed'
        )
        db.session.add(booking)
        db.session.commit()
        print("Created booking")
        
        # Review for the booking
        review = Review(
            booking_id=booking.id,
            experience_id=exp1.id,
            rating=5,
            comment='''Absolutely incredible experience! John\'s knowledge of wildlife and Maasai culture made this safari unforgettable. We saw the Big Five and the Great Migration was breathtaking. The accommodation was comfortable and the food exceptional. Highly recommend this tour for anyone wanting an authentic Kenyan safari experience.'''
        )
        db.session.add(review)
        db.session.commit()
        print("Created review")
        
        print("✅ Database seeded successfully with 5 detailed Kenyan experiences!")
        print(f"   - Experiences include: Maasai Mara Safari, Nairobi Food Tour, Lamu Culture, Mount Kenya Trek, Nairobi National Park")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Seeding failed: {str(e)}")
        raise    """Seed the database with initial data"""
    print("Creating seed data...")
    
    # Check if we already have data
    if User.query.first():
        print("Database already seeded, skipping...")
        return
    
    try:
        # Create users first and commit to get their IDs
        admin_user = User(auth0_id='admin-test', email='admin@digitalguides.com', role=UserRole.ADMIN)
        guide_user = User(auth0_id='guide-test', email='guide@kenya.com', role=UserRole.GUIDE)
        traveler_user = User(auth0_id='traveler-test', email='traveler@test.com', role=UserRole.TRAVELER)
        
        db.session.add_all([admin_user, guide_user, traveler_user])
        db.session.commit()
        print("Created users")
        
        # Now create profiles with the actual user IDs
        admin_profile = Profile(user_id=admin_user.id, name='Admin', location='Nairobi', is_approved=True)
        guide_profile = Profile(user_id=guide_user.id, name='John Mwangi', bio='Local Kenyan expert with 10+ years in tourism.', location='Nairobi', is_approved=True)
        traveler_profile = Profile(user_id=traveler_user.id, name='Jane Doe', location='USA')
        
        db.session.add_all([admin_profile, guide_profile, traveler_profile])
        db.session.commit()
        print("Created profiles")
        
        # Create experiences
        exp1 = Experience(
            title='Maasai Mara Cultural Immersion',
            description='Authentic village visit with traditional dances and stories from the Maasai community.',
            price=75.0, 
            duration_hours=6, 
            category=Category.CULTURE,
            location='Maasai Mara, Kenya', 
            itinerary='9AM pickup from your hotel, village tour, traditional lunch, cultural performances, return by 3PM.',
            photos=json.dumps([
                'https://source.unsplash.com/800x600/?maasai',
                'https://source.unsplash.com/800x600/?kenya-culture',
                'https://source.unsplash.com/800x600/?african-village'
            ]),
            available_dates=json.dumps(['2025-11-15', '2025-11-20', '2025-11-25']),
            guide_id=guide_user.id
        )
        
        exp2 = Experience(
            title='Nairobi Street Food Safari',
            description='Taste authentic Kenyan street eats with a local chef guide. Experience the real flavors of Nairobi.',
            price=30.0, 
            duration_hours=3, 
            category=Category.FOOD,
            location='Nairobi, Kenya', 
            itinerary='Start at City Market, sample nyama choma, taste local chai, explore food stalls, end with dessert.',
            photos=json.dumps([
                'https://source.unsplash.com/800x600/?kenyan-food',
                'https://source.unsplash.com/800x600/?street-food',
                'https://source.unsplash.com/800x600/?nairobi-market'
            ]),
            available_dates=json.dumps(['2025-11-12', '2025-11-18', '2025-11-22']),
            guide_id=guide_user.id
        )
        
        exp3 = Experience(
            title='Diani Beach Snorkeling Adventure',
            description='Crystal clear waters and vibrant marine life at one of Kenya\'s most beautiful beaches.',
            price=45.0,
            duration_hours=4,
            category=Category.ADVENTURE,
            location='Diani Beach, Kenya',
            itinerary='Beach briefing, boat ride to reef, snorkeling session, marine life spotting, return with refreshments.',
            photos=json.dumps([
                'https://source.unsplash.com/800x600/?diani-beach',
                'https://source.unsplash.com/800x600/?snorkeling',
                'https://source.unsplash.com/800x600/?coral-reef'
            ]),
            available_dates=json.dumps(['2025-11-14', '2025-11-19', '2025-11-26']),
            guide_id=guide_user.id
        )

        
        
        db.session.add_all([exp1, exp2, exp3])
        db.session.commit()
        print("Created experiences")
        
        # Create a completed booking for review testing
        booking = Booking(
            experience_id=exp1.id,
            traveler_id=traveler_user.id,
            tour_date=datetime.strptime('2025-11-15', '%Y-%m-%d'),
            guest_count=2,
            total_amount=150.0,
            status='completed'
        )
        db.session.add(booking)
        db.session.commit()
        print("Created booking")
        
        # Review for the booking
        review = Review(
            booking_id=booking.id,
            experience_id=exp1.id,
            rating=5,
            comment='Amazing authentic experience! John was an excellent guide who shared deep cultural insights.'
        )
        db.session.add(review)
        db.session.commit()
        print("Created review")
        
        print("✅ Database seeded successfully!")
        print(f"   - Admin: {admin_user.email}")
        print(f"   - Guide: {guide_user.email}") 
        print(f"   - Traveler: {traveler_user.email}")
        print(f"   - Experiences: 3 Kenyan tours")
        print(f"   - Sample booking and review created")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Seeding failed: {str(e)}")
        raise

with app.app_context():
    # Create all tables
    db.create_all()
    print("Database tables created")
    
    # Seed the database
    seed_database()

if __name__ == '__main__':
    app.run(debug=True)
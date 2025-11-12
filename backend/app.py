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
    """Seed the database with initial data"""
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
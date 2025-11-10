from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Profile, Experience, Category, UserRole, Booking, Review
from routes import auth, experiences, bookings, admin, reviews  # Added reviews
import json

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
db.init_app(app)

app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(experiences.bp, url_prefix='/api/experiences')
app.register_blueprint(bookings.bp, url_prefix='/api/bookings')
app.register_blueprint(admin.bp, url_prefix='/api/admin')
app.register_blueprint(reviews.bp, url_prefix='/api/reviews')  # Added

@app.route('/')
def home():
    return jsonify({'message': 'Digital Guides API - Authentic Kenyan Experiences'})

with app.app_context():
    db.create_all()
    
    if not User.query.first():
        # Admin
        admin = User(auth0_id='admin-test', email='admin@digitalguides.com', role=UserRole.ADMIN)
        db.session.add(admin)
        admin_profile = Profile(user_id=admin.id, name='Admin', location='Nairobi', is_approved=True)
        db.session.add(admin_profile)
        
        # Guide
        guide = User(auth0_id='guide-test', email='guide@kenya.com', role=UserRole.GUIDE)
        db.session.add(guide)
        guide_profile = Profile(user_id=guide.id, name='John Mwangi', bio='Local Kenyan expert with 10+ years in tourism.', location='Nairobi', is_approved=True)
        db.session.add(guide_profile)
        
        # Traveler for testing
        traveler = User(auth0_id='traveler-test', email='traveler@test.com', role=UserRole.TRAVELER)
        db.session.add(traveler)
        traveler_profile = Profile(user_id=traveler.id, name='Jane Doe', location='USA')
        db.session.add(traveler_profile)
        
        # Experiences (Kenyan focus)
        exp1 = Experience(
            title='Maasai Mara Cultural Immersion',
            description='Authentic village visit with dances and stories.',
            price=75.0, duration_hours=6, category=Category.CULTURE,
            location='Maasai Mara, Kenya', itinerary='9AM pickup, village tour, lunch, return.',
            photos=json.dumps(['https://source.unsplash.com/800x600/?maasai', 'https://source.unsplash.com/400x300/?kenya-culture']),
            available_dates=json.dumps(['2025-11-15', '2025-11-20']),
            guide_id=guide.id
        )
        db.session.add(exp1)
        
        exp2 = Experience(
            title='Nairobi Street Food Safari',
            description='Taste Kenyan street eats with a local chef.',
            price=30.0, duration_hours=3, category=Category.FOOD,
            location='Nairobi, Kenya', itinerary='Market start, nyama choma tasting, chai end.',
            photos=json.dumps(['https://source.unsplash.com/800x600/?kenyan-food', 'https://source.unsplash.com/400x300/?street-food']),
            available_dates=json.dumps(['2025-11-12', '2025-11-18']),
            guide_id=guide.id
        )
        db.session.add(exp2)
        
        # Booking for review test
        booking = Booking(experience_id=exp1.id, traveler_id=traveler.id, tour_date='2025-11-15', guest_count=1, total_amount=75.0, status='completed')
        db.session.add(booking)
        
        # Review
        review = Review(booking_id=booking.id, experience_id=exp1.id, rating=5, comment='Amazing authentic experience! John was an excellent guide.')
        db.session.add(review)
        
        db.session.commit()
        print("Seeded: Admin, guide, traveler, 2 experiences, 1 booking/review.")

if __name__ == '__main__':
    app.run(debug=True)
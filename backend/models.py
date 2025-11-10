from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class UserRole(Enum):
    TRAVELER = 'traveler'
    GUIDE = 'guide'
    ADMIN = 'admin'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)  # From Auth0
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.TRAVELER)
    profile = db.relationship('Profile', backref='user', uselist=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))  # e.g., "Nairobi, Kenya"
    avatar_url = db.Column(db.String(200))
    is_approved = db.Column(db.Boolean, default=False)  # For guides

class Category(Enum):
    FOOD = 'food'
    CULTURE = 'culture'
    ADVENTURE = 'adventure'

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)  # In USD
    duration_hours = db.Column(db.Integer)  # e.g., 4
    category = db.Column(db.Enum(Category))
    location = db.Column(db.String(100), nullable=False)
    itinerary = db.Column(db.Text)  # JSON or text
    photos = db.Column(db.Text)  # JSON array of URLs
    guide_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    available_dates = db.Column(db.Text)  # JSON list of dates
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    experience_id = db.Column(db.Integer, db.ForeignKey('experience.id'), nullable=False)
    traveler_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    tour_date = db.Column(db.DateTime, nullable=False)
    guest_count = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, completed, cancelled
    stripe_payment_intent = db.Column(db.String(100))  # For refunds
    total_amount = db.Column(db.Float, nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
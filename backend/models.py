from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
import json

db = SQLAlchemy()

class UserRole(Enum):
    TRAVELER = 'traveler'
    GUIDE = 'guide'
    ADMIN = 'admin'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.TRAVELER)
    profile = db.relationship('Profile', backref='user', uselist=False)
    experiences = db.relationship('Experience', backref='guide', lazy=True)
    bookings = db.relationship('Booking', foreign_keys='Booking.traveler_id', backref='traveler', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))
    avatar_url = db.Column(db.String(200))
    is_approved = db.Column(db.Boolean, default=False)

class Category(Enum):
    FOOD = 'food'
    CULTURE = 'culture'
    ADVENTURE = 'adventure'

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration_hours = db.Column(db.Integer)
    category = db.Column(db.Enum(Category))
    location = db.Column(db.String(100), nullable=False)
    itinerary = db.Column(db.Text)
    photos = db.Column(db.Text)  # JSON
    guide_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    available_dates = db.Column(db.Text)  # JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviews = db.relationship('Review', backref='experience', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'description': self.description,
            'price': self.price, 'duration_hours': self.duration_hours,
            'category': self.category.value if self.category else None, 'location': self.location,
            'itinerary': self.itinerary, 'photos': json.loads(self.photos or '[]'),
            'available_dates': json.loads(self.available_dates or '[]'),
            'guide': {'name': self.guide.profile.name, 'bio': self.guide.profile.bio, 'location': self.guide.profile.location},
            'reviews': [{'rating': r.rating, 'comment': r.comment} for r in self.reviews]
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    experience_id = db.Column(db.Integer, db.ForeignKey('experience.id'), nullable=False)
    traveler_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    tour_date = db.Column(db.DateTime, nullable=False)
    guest_count = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, completed, cancelled
    stripe_payment_intent = db.Column(db.String(100))
    total_amount = db.Column(db.Float, nullable=False)
    review = db.relationship('Review', backref='booking', uselist=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    experience_id = db.Column(db.Integer, db.ForeignKey('experience.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
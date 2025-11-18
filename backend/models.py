from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, date
import enum
import json

db = SQLAlchemy()
bcrypt = Bcrypt()

class UserRole(enum.Enum):
    TRAVELER = "traveler"
    GUIDE = "guide"
    ADMIN = "admin"

class BookingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.TRAVELER)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    bio = db.Column(db.Text)
    profile_picture = db.Column(db.String(255))
    is_verified = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    experiences = db.relationship('Experience', backref='guide', lazy=True)
    bookings = db.relationship('Booking', backref='traveler', lazy=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'role': self.role.value,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'profile_picture': self.profile_picture,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat()
        }

class Experience(db.Model):
    __tablename__ = 'experiences'
    
    id = db.Column(db.Integer, primary_key=True)
    guide_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    short_description = db.Column(db.String(300))
    category = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    duration_hours = db.Column(db.Integer, nullable=False)
    max_group_size = db.Column(db.Integer, nullable=False)
    price_per_person = db.Column(db.Float, nullable=False)
    itinerary = db.Column(db.Text)
    includes = db.Column(db.Text)
    excludes = db.Column(db.Text)
    requirements = db.Column(db.Text)
    cover_image = db.Column(db.String(255))
    images = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    is_approved = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', backref='experience', lazy=True)
    available_dates = db.relationship('ExperienceDate', backref='experience', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        guide_data = None
        if self.guide:
            guide_data = {
                'name': f"{self.guide.first_name} {self.guide.last_name}",
                'experience': self.guide.bio,
                'languages': ['English', 'Swahili'],
                'rating': 4.8
            }
        
        return {
            'id': self.id,
            'guide_id': self.guide_id,
            'title': self.title,
            'description': self.description,
            'short_description': self.short_description,
            'category': self.category,
            'location': self.location,
            'duration_hours': self.duration_hours,
            'max_group_size': self.max_group_size,
            'price_per_person': self.price_per_person,
            'itinerary': self.itinerary,
            'includes': self.includes,
            'excludes': self.excludes,
            'requirements': self.requirements,
            'cover_image': self.cover_image,
            'images': self.images,
            'is_active': self.is_active,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'guide': guide_data
        }

class ExperienceDate(db.Model):
    __tablename__ = 'experience_dates'
    
    id = db.Column(db.Integer, primary_key=True)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    available_slots = db.Column(db.Integer, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'experience_id': self.experience_id,
            'date': self.date.isoformat(),
            'start_time': self.start_time.isoformat(),
            'available_slots': self.available_slots,
            'is_available': self.is_available
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    traveler_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    experience_id = db.Column(db.Integer, db.ForeignKey('experiences.id'), nullable=False)
    experience_date_id = db.Column(db.Integer, db.ForeignKey('experience_dates.id'), nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    special_requests = db.Column(db.Text)
    status = db.Column(db.Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    is_paid = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'traveler_id': self.traveler_id,
            'experience_id': self.experience_id,
            'experience_date_id': self.experience_date_id,
            'number_of_guests': self.number_of_guests,
            'total_price': self.total_price,
            'special_requests': self.special_requests,
            'status': self.status.value,
            'is_paid': self.is_paid,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'experience': self.experience.to_dict() if self.experience else None,
            'experience_date': self.experience_date.to_dict() if self.experience_date else None
        }
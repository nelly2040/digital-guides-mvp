import os
from app import app, db
from models import User, Experience, ExperienceDate, Booking

def reset_database():
    with app.app_context():
        # Delete all data (in correct order to respect foreign keys)
        Booking.query.delete()
        ExperienceDate.query.delete()
        Experience.query.delete()
        User.query.delete()
        
        db.session.commit()
        print("🗑️  Database cleared")
        
        # Recreate tables
        db.create_all()
        print("📁 Database tables recreated")
        
        # Import and run the sample data creation
        from app import create_sample_data
        create_sample_data()

if __name__ == '__main__':
    reset_database()
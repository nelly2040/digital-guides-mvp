from models import db, User, Experience
from werkzeug.security import generate_password_hash

def seed_database():
    # Check if we already have data
    if User.query.first() is not None:
        print("✅ Database already seeded, skipping...")
        return

    print("Creating seed data...")
    
    # Create demo users
    users = [
        User(
            email="traveler@test.com",
            password=generate_password_hash("password123"),
            name="Demo Traveler",
            role="traveler"
        ),
        User(
            email="guide@kenya.com", 
            password=generate_password_hash("password123"),
            name="Local Guide",
            role="guide",
            is_approved=True,
            phone="+254712345678",
            location="Nairobi",
            bio="Experienced local guide with 10+ years showing travelers the real Kenya."
        ),
        User(
            email="admin@digitalguides.com",
            password=generate_password_hash("password123"),
            name="Admin User", 
            role="admin"
        )
    ]

    for user in users:
        db.session.add(user)
    
    db.session.commit()

    # Get the guide user
    guide = User.query.filter_by(email="guide@kenya.com").first()

    # Create sample experiences
    experiences = [
        Experience(
            title="Maasai Mara Safari Adventure",
            description="Experience the great wildebeest migration in the world-famous Maasai Mara National Reserve. Get up close with the Big Five and witness breathtaking African sunsets.",
            price=450.00,
            location="Maasai Mara",
            category="safari",
            duration="3 days",
            max_people=6,
            includes="Transport, park fees, accommodation, meals, professional guide",
            excludes="Personal expenses, tips, travel insurance",
            image_url="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Diani Beach Relaxation",
            description="Enjoy the pristine white sandy beaches of Diani with crystal clear waters. Perfect for swimming, snorkeling, and beach relaxation.",
            price=120.00,
            location="Diani Beach",
            category="beach",
            duration="Full day",
            max_people=8,
            includes="Beach equipment, snorkeling gear, lunch, transport",
            excludes="Alcoholic drinks, personal shopping",
            image_url="https://images.unsplash.com/photo-1587334812106-7af57a175e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
    ]

    for exp in experiences:
        db.session.add(exp)
    
    db.session.commit()
    print("✅ Seed data created successfully!")
    

    
from models import db, User, Experience
from werkzeug.security import generate_password_hash
from datetime import datetime

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

    # Create 20+ sample experiences
    experiences = [
        # Safari Experiences
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
            title="Amboseli Elephant Safari",
            description="Witness majestic elephants against the backdrop of Mount Kilimanjaro in Amboseli National Park. Perfect for photography and wildlife enthusiasts.",
            price=380.00,
            location="Amboseli National Park",
            category="safari",
            duration="2 days",
            max_people=8,
            includes="Park fees, accommodation, meals, guide, transport",
            excludes="Drinks, personal items",
            image_url="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Tsavo East & West Combo Safari",
            description="Explore both Tsavo East and West National Parks, home to the famous red elephants and stunning landscapes including Mzima Springs.",
            price=520.00,
            location="Tsavo National Parks",
            category="safari",
            duration="4 days",
            max_people=6,
            includes="All park fees, full board accommodation, professional guide, transport",
            excludes="Alcoholic drinks, personal shopping",
            image_url="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Lake Nakuru Flamingo Experience",
            description="Marvel at the pink flamingos covering Lake Nakuru and spot rhinos, lions, and leopards in this compact but wildlife-rich park.",
            price=280.00,
            location="Lake Nakuru National Park",
            category="safari",
            duration="1 day",
            max_people=10,
            includes="Park fees, lunch, guide, transport from Nairobi",
            excludes="Accommodation, personal expenses",
            image_url="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),

        # Beach Experiences
        Experience(
            title="Diani Beach Relaxation & Watersports",
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
        Experience(
            title="Watamu Marine Park Snorkeling",
            description="Discover the vibrant coral reefs and marine life of Watamu Marine Park. Perfect for snorkeling and marine conservation enthusiasts.",
            price=95.00,
            location="Watamu",
            category="beach",
            duration="6 hours",
            max_people=12,
            includes="Snorkeling equipment, park fees, guide, boat ride",
            excludes="Lunch, transport to Watamu",
            image_url="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Lamu Island Cultural Experience",
            description="Immerse yourself in the rich Swahili culture of Lamu Island. Explore ancient architecture, traditional dhow sailing, and local cuisine.",
            price=180.00,
            location="Lamu Archipelago",
            category="beach",
            duration="2 days",
            max_people=6,
            includes="Accommodation, meals, dhow cruise, cultural tours",
            excludes="Transport to Lamu, personal shopping",
            image_url="https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),

        # Cultural Experiences
        Experience(
            title="Nairobi Cultural Food Tour",
            description="Explore Nairobi's vibrant food scene with a local guide. Taste authentic Kenyan dishes and learn about the cultural significance of each meal.",
            price=75.00,
            location="Nairobi",
            category="cultural",
            duration="5 hours",
            max_people=10,
            includes="All food tastings, guide, transport between locations",
            excludes="Additional drinks, souvenirs",
            image_url="https://images.unsplash.com/photo-1556909114-4d0d853e5e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Maasai Village Cultural Immersion",
            description="Spend a day with the Maasai community, learning about their traditions, dances, and way of life in an authentic village setting.",
            price=65.00,
            location="Maasai Mara Region",
            category="cultural",
            duration="4 hours",
            max_people=15,
            includes="Village fees, cultural表演, traditional lunch",
            excludes="Transport to village, souvenirs",
            image_url="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Kibera Slum Tour with Local Guide",
            description="Gain insight into Nairobi's largest informal settlement with a resident guide. Learn about community projects and local entrepreneurship.",
            price=45.00,
            location="Nairobi",
            category="cultural",
            duration="3 hours",
            max_people=8,
            includes="Local guide, community contribution",
            excludes="Transport, photography fees",
            image_url="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),

        # Adventure Experiences
        Experience(
            title="Mount Kenya Summit Trek",
            description="Challenge yourself with a trek to Point Lenana, the third highest peak of Mount Kenya. Experience stunning alpine scenery and unique vegetation.",
            price=650.00,
            location="Mount Kenya",
            category="adventure",
            duration="5 days",
            max_people=4,
            includes="All meals, park fees, guide, porters, accommodation",
            excludes="Personal gear, insurance",
            image_url="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Hell's Gate National Park Cycling",
            description="Cycle through Hell's Gate National Park, famous for its dramatic scenery, geothermal activity, and wildlife. No predators make it safe for cycling.",
            price=85.00,
            location="Hell's Gate National Park",
            category="adventure",
            duration="6 hours",
            max_people=8,
            includes="Bike rental, park fees, guide, lunch",
            excludes="Transport to park",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Sagana White Water Rafting",
            description="Experience thrilling white water rafting on the Tana River in Sagana. Perfect for adventure seekers and team building.",
            price=110.00,
            location="Sagana",
            category="adventure",
            duration="Full day",
            max_people=12,
            includes="Rafting equipment, safety gear, lunch, experienced guides",
            excludes="Transport to Sagana, change of clothes",
            image_url="https://images.unsplash.com/photo-1600271772472-6057b89b8c1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),

        # Mountain Experiences
        Experience(
            title="Mount Longonot Hike & Crater Exploration",
            description="Hike to the summit of Mount Longonot and walk around the volcanic crater rim for breathtaking views of the Great Rift Valley.",
            price=70.00,
            location="Mount Longonot",
            category="mountain",
            duration="5 hours",
            max_people=10,
            includes="Park fees, guide, bottled water",
            excludes="Transport, lunch",
            image_url="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Aberdare Range Forest Walk",
            description="Explore the misty Aberdare Range with its dense forests, waterfalls, and unique high-altitude wildlife including bongo antelopes.",
            price=120.00,
            location="Aberdare National Park",
            category="mountain",
            duration="Full day",
            max_people=6,
            includes="Park fees, guide, picnic lunch",
            excludes="Accommodation, transport to park",
            image_url="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),

        # Food Experiences
        Experience(
            title="Traditional Kenyan Cooking Class",
            description="Learn to cook authentic Kenyan dishes like ugali, sukuma wiki, and nyama choma from a local chef in a hands-on cooking experience.",
            price=60.00,
            location="Nairobi",
            category="food",
            duration="3 hours",
            max_people=8,
            includes="All ingredients, recipes, meal, certificate",
            excludes="Transport to venue",
            image_url="https://images.unsplash.com/photo-1556909114-4d0d853e5e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Coffee Farm Tour & Tasting",
            description="Visit a Kenyan coffee farm, learn about coffee production from bean to cup, and enjoy premium coffee tasting sessions.",
            price=55.00,
            location="Kiambu County",
            category="food",
            duration="4 hours",
            max_people=12,
            includes="Farm tour, coffee tasting, light snacks",
            excludes="Transport to farm",
            image_url="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),

        # Additional Experiences
        Experience(
            title="Nairobi National Park Day Trip",
            description="Experience wildlife with the Nairobi skyline as your backdrop. See lions, giraffes, and rhinos just outside the city.",
            price=90.00,
            location="Nairobi National Park",
            category="safari",
            duration="4 hours",
            max_people=6,
            includes="Park fees, guide, transport within park",
            excludes="Lunch, transport to park",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Mombasa Old Town Walking Tour",
            description="Explore the historic streets of Mombasa Old Town with its Arabic architecture, ancient forts, and rich trading history.",
            price=40.00,
            location="Mombasa",
            category="cultural",
            duration="3 hours",
            max_people=15,
            includes="Local guide, Fort Jesus entry",
            excludes="Transport, meals",
            image_url="https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Lake Naivasha Boat Ride & Crescent Island",
            description="Enjoy a boat ride on Lake Naivasha followed by a walking safari on Crescent Island among giraffes, zebras, and antelopes.",
            price=75.00,
            location="Lake Naivasha",
            category="adventure",
            duration="5 hours",
            max_people=8,
            includes="Boat ride, island entry fees, guide",
            excludes="Lunch, transport to lake",
            image_url="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Karen Blixen Museum & Giraffe Centre",
            description="Visit the famous Karen Blixen Museum and interact with endangered Rothschild giraffes at the Giraffe Centre.",
            price=50.00,
            location="Karen, Nairobi",
            category="cultural",
            duration="3 hours",
            max_people=12,
            includes="Museum entry, giraffe centre entry, guide",
            excludes="Transport, lunch",
            image_url="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        ),
        Experience(
            title="Ol Pejeta Conservancy Rhino Tracking",
            description="Track endangered rhinos in Ol Pejeta Conservancy, home to the last two northern white rhinos in the world.",
            price=180.00,
            location="Ol Pejeta Conservancy",
            category="safari",
            duration="Full day",
            max_people=6,
            includes="Conservancy fees, rhino tracking, guide, lunch",
            excludes="Transport to conservancy",
            image_url="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            guide_id=guide.id
        )
    ]

    for exp in experiences:
        db.session.add(exp)
    
    db.session.commit()
    print("✅ 20+ experiences created successfully!")
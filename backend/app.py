from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simple in-memory data for testing
EXPERIENCES = [
    {
        "id": 1,
        "title": "Maasai Mara Safari Adventure",
        "description": "Experience the great wildebeest migration in the world-famous Maasai Mara National Reserve.",
        "price": 450,
        "location": "Maasai Mara",
        "category": "safari",
        "duration": "3 days",
        "image_url": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "max_people": 6,
        "includes": "Transport, park fees, accommodation, meals, professional guide",
        "excludes": "Personal expenses, tips, travel insurance"
    },
    {
        "id": 2,
        "title": "Diani Beach Relaxation",
        "description": "Enjoy the pristine white sandy beaches of Diani with crystal clear waters.",
        "price": 120,
        "location": "Diani Beach", 
        "category": "beach",
        "duration": "Full day",
        "image_url": "https://images.unsplash.com/photo-1587334812106-7af57a175e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "max_people": 8,
        "includes": "Beach equipment, snorkeling gear, lunch, transport",
        "excludes": "Alcoholic drinks, personal shopping"
    },
    {
        "id": 3,
        "title": "Nairobi Cultural Food Tour",
        "description": "Explore Nairobi's vibrant food scene with a local guide.",
        "price": 75,
        "location": "Nairobi",
        "category": "cultural",
        "duration": "5 hours",
        "image_url": "https://images.unsplash.com/photo-1556909114-4d0d853e5e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "max_people": 10,
        "includes": "All food tastings, guide, transport between locations",
        "excludes": "Additional drinks, souvenirs"
    }
]

USERS = []

@app.route('/')
def home():
    return jsonify({"message": "Digital Guides API is running!"})

@app.route('/api/experiences', methods=['GET'])
def get_experiences():
    return jsonify({
        "success": True,
        "experiences": EXPERIENCES
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        # Simple registration - just store in memory
        user_data = {
            "id": len(USERS) + 1,
            "name": "Test User",
            "email": "test@test.com", 
            "role": "traveler",
            "is_approved": True
        }
        USERS.append(user_data)
        
        return jsonify({
            "message": "User created successfully",
            "token": "demo-token-123",
            "user": user_data
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    return jsonify({
        "message": "Login successful",
        "token": "demo-token-123",
        "user": {
            "id": 1,
            "name": "Demo User",
            "email": "user@test.com",
            "role": "traveler",
            "is_approved": True
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
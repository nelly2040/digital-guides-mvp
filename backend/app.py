from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app)
bcrypt = Bcrypt(app)

# Mock data
users = []
experiences = [
    {
        "id": 1,
        "title": "Maasai Mara Safari Adventure",
        "image": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "price_per_person": 450,
        "location": "Maasai Mara National Reserve",
        "duration_hours": 72,
        "category": "Wildlife Safari",
        "rating": 4.9,
        "short_description": "Witness the Great Migration and spot the Big Five in Africa's most famous wildlife reserve.",
        "description": "Embark on an unforgettable safari adventure in the world-famous Maasai Mara. Witness the Great Migration where millions of wildebeest and zebras cross the Mara River, and spot the Big Five in their natural habitat.",
        "includes": "All park fees, professional guide, 4x4 safari vehicle, accommodation (2 nights), all meals, bottled water",
        "excludes": "International flights, travel insurance, tips, personal expenses, alcoholic beverages",
        "itinerary": "Day 1: Arrival and afternoon game drive | Day 2: Full day safari with picnic lunch | Day 3: Morning game drive and departure",
        "requirements": "Valid passport, comfortable clothing, binoculars, camera, sunscreen, hat",
        "max_group_size": 6,
        "guide": {
            "name": "John ole Sankori",
            "experience": "8 years",
            "languages": ["English", "Swahili", "Maa"],
            "rating": 4.9
        }
    },
    # Add more experiences here...
]

bookings = []

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = next((user for user in users if user['email'] == data['email']), None)
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Digital Guides API is running'})

# Auth endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if any(user['email'] == data['email'] for user in users):
        return jsonify({'message': 'User already exists'}), 400
    
    # Create new user
    user = {
        'id': len(users) + 1,
        'first_name': data.get('first_name', ''),
        'last_name': data.get('last_name', ''),
        'email': data['email'],
        'password': bcrypt.generate_password_hash(data['password']).decode('utf-8'),
        'role': data.get('role', 'traveler'),
        'phone': data.get('phone', ''),
        'location': data.get('location', ''),
        'bio': data.get('bio', ''),
        'is_verified': data.get('role') == 'traveler',  # Guides need approval
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    
    users.append(user)
    
    # Generate token
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    user_response = {k: v for k, v in user.items() if k != 'password'}
    return jsonify({
        'user': user_response,
        'token': token
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = next((user for user in users if user['email'] == data['email']), None)
    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Generate token
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    user_response = {k: v for k, v in user.items() if k != 'password'}
    return jsonify({
        'user': user_response,
        'token': token
    })

@app.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    user_response = {k: v for k, v in current_user.items() if k != 'password'}
    return jsonify({'user': user_response})

# Experiences endpoints
@app.route('/api/experiences', methods=['GET'])
def get_experiences():
    return jsonify({'experiences': experiences})

@app.route('/api/experiences/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    experience = next((exp for exp in experiences if exp['id'] == experience_id), None)
    if not experience:
        return jsonify({'message': 'Experience not found'}), 404
    return jsonify({'experience': experience})

# Bookings endpoints
@app.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json()
    
    experience = next((exp for exp in experiences if exp['id'] == data['experience_id']), None)
    if not experience:
        return jsonify({'message': 'Experience not found'}), 404
    
    booking = {
        'id': len(bookings) + 1,
        'user_id': current_user['id'],
        'experience_id': data['experience_id'],
        'number_of_guests': data['number_of_guests'],
        'tour_date': data.get('tour_date'),
        'special_requests': data.get('special_requests', ''),
        'total_price': data['total_price'],
        'status': 'confirmed',
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    
    bookings.append(booking)
    
    # Add experience details to response
    booking_response = booking.copy()
    booking_response['experience'] = experience
    
    return jsonify({
        'booking': booking_response,
        'client_secret': 'mock-client-secret'
    }), 201

@app.route('/api/bookings/my-bookings', methods=['GET'])
@token_required
def get_my_bookings(current_user):
    user_bookings = [booking for booking in bookings if booking['user_id'] == current_user['id']]
    
    # Add experience details to each booking
    for booking in user_bookings:
        experience = next((exp for exp in experiences if exp['id'] == booking['experience_id']), {})
        booking['experience'] = experience
    
    return jsonify({'bookings': user_bookings})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
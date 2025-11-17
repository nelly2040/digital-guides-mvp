from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
CORS(app)
bcrypt = Bcrypt(app)

# Mock data - in production, use a database
users = []
experiences = [
    # Your 22 experiences here (same as before)
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
    # Add the rest of your 21 experiences...
]

bookings = []

# Create default admin user
def create_default_admin():
    admin_user = {
        'id': 1,
        'first_name': 'Admin',
        'last_name': 'User',
        'email': 'admin@digitalguides.com',
        'password': bcrypt.generate_password_hash('admin123').decode('utf-8'),
        'role': 'admin',
        'is_verified': True,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    users.append(admin_user)
    print("Default admin user created: admin@digitalguides.com / admin123")

create_default_admin()

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

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Health check endpoint
@app.route('/api/health', methods=['GET'])
@app.route('/api/health/', methods=['GET'])
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
        'is_verified': data.get('role') == 'traveler',
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
@app.route('/api/experiences/', methods=['GET'])
def get_experiences():
    return jsonify({'experiences': experiences})

@app.route('/api/experiences/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    experience = next((exp for exp in experiences if exp['id'] == experience_id), None)
    if not experience:
        return jsonify({'message': 'Experience not found'}), 404
    return jsonify({'experience': experience})

# Reviews endpoint
@app.route('/api/reviews/experience/<int:experience_id>', methods=['GET'])
def get_reviews(experience_id):
    return jsonify({'reviews': []})

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
    booking_response['user'] = {
        'first_name': current_user['first_name'],
        'last_name': current_user['last_name'],
        'email': current_user['email']
    }
    
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

# Admin endpoints
@app.route('/api/admin/bookings', methods=['GET'])
@admin_required
def get_all_bookings(current_user):
    # Add experience and user details to all bookings
    booking_list = []
    for booking in bookings:
        experience = next((exp for exp in experiences if exp['id'] == booking['experience_id']), {})
        user = next((u for u in users if u['id'] == booking['user_id']), {})
        
        booking_with_details = booking.copy()
        booking_with_details['experience'] = experience
        booking_with_details['user'] = {
            'first_name': user.get('first_name', ''),
            'last_name': user.get('last_name', ''),
            'email': user.get('email', '')
        }
        booking_list.append(booking_with_details)
    
    return jsonify({'bookings': booking_list})

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    users_response = []
    for user in users:
        user_response = {k: v for k, v in user.items() if k != 'password'}
        # Count user bookings
        user_bookings = [b for b in bookings if b['user_id'] == user['id']]
        user_response['bookings_count'] = len(user_bookings)
        users_response.append(user_response)
    
    return jsonify({'users': users_response})

@app.route('/api/admin/statistics', methods=['GET'])
@admin_required
def get_statistics(current_user):
    total_users = len(users)
    total_bookings = len(bookings)
    total_revenue = sum(booking['total_price'] for booking in bookings)
    total_experiences = len(experiences)
    
    # Bookings by status
    confirmed_bookings = len([b for b in bookings if b['status'] == 'confirmed'])
    pending_bookings = len([b for b in bookings if b['status'] == 'pending'])
    
    # Users by role
    travelers = len([u for u in users if u['role'] == 'traveler'])
    guides = len([u for u in users if u['role'] == 'guide'])
    admins = len([u for u in users if u['role'] == 'admin'])
    
    return jsonify({
        'total_users': total_users,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'total_experiences': total_experiences,
        'bookings_by_status': {
            'confirmed': confirmed_bookings,
            'pending': pending_bookings
        },
        'users_by_role': {
            'travelers': travelers,
            'guides': guides,
            'admins': admins
        }
    })

# Root endpoint
@app.route('/')
def index():
    return jsonify({
        'message': 'Digital Guides API',
        'endpoints': {
            'health': '/api/health',
            'experiences': '/api/experiences',
            'register': '/api/auth/register',
            'login': '/api/auth/login',
            'admin_bookings': '/api/admin/bookings (admin only)',
            'admin_users': '/api/admin/users (admin only)',
            'admin_stats': '/api/admin/statistics (admin only)'
        },
        'default_admin': 'admin@digitalguides.com / admin123'
    })

if __name__ == '__main__':
    print("Starting Digital Guides API server...")
    print("Default admin credentials: admin@digitalguides.com / admin123")
    print("Available endpoints:")
    print("  GET  /api/health")
    print("  GET  /api/experiences") 
    print("  GET  /api/experiences/<id>")
    print("  POST /api/auth/register")
    print("  POST /api/auth/login")
    print("  POST /api/bookings")
    print("  GET  /api/bookings/my-bookings")
    print("  GET  /api/admin/bookings (admin)")
    print("  GET  /api/admin/users (admin)")
    print("  GET  /api/admin/statistics (admin)")
    app.run(debug=True, port=5000, host='0.0.0.0')
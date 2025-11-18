from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'digital-guides-secret-key-2024')
CORS(app)
bcrypt = Bcrypt(app)

# Mock data storage
users = []
experiences = []
bookings = []

# Create default admin user
def create_default_admin():
    admin_exists = any(user['email'] == 'admin@digitalguides.com' for user in users)
    if not admin_exists:
        admin_user = {
            'id': 1,
            'first_name': 'Admin',
            'last_name': 'User',
            'email': 'admin@digitalguides.com',
            'password': bcrypt.generate_password_hash('admin123').decode('utf-8'),
            'role': 'admin',
            'phone': '+254700000000',
            'location': 'Nairobi',
            'bio': 'Platform Administrator',
            'is_verified': True,
            'created_at': datetime.datetime.utcnow().isoformat()
        }
        users.append(admin_user)
        print("✅ Default admin created: admin@digitalguides.com / admin123")

# Auto-verify all guides for demo purposes
def auto_verify_guides():
    for user in users:
        if user['role'] == 'guide' and not user.get('is_verified'):
            user['is_verified'] = True
            print(f"✅ Auto-verified guide: {user['email']}")

# Create sample experiences
def create_sample_experiences():
    if len(experiences) == 0:
        sample_experiences = [
            {
                "id": 1,
                "guide_id": 2,
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
                "is_approved": True,
                "created_at": datetime.datetime.utcnow().isoformat(),
                "guide": {
                    "name": "John ole Sankori",
                    "experience": "8 years",
                    "languages": ["English", "Swahili", "Maa"],
                    "rating": 4.9
                }
            },
            {
                "id": 2,
                "guide_id": 3,
                "title": "Lamu Island Cultural Journey",
                "image": "https://images.unsplash.com/photo-1589556183411-27dbe3d3ef4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "price_per_person": 120,
                "location": "Lamu Archipelago",
                "duration_hours": 8,
                "category": "Cultural Tour",
                "rating": 4.8,
                "short_description": "Explore ancient Swahili architecture and rich coastal culture in this UNESCO World Heritage site.",
                "description": "Step back in time and explore the ancient Swahili settlement of Lamu, a UNESCO World Heritage site. Wander through narrow streets unchanged for centuries.",
                "includes": "Professional guide, boat transfers, museum entrance fees, traditional Swahili lunch",
                "excludes": "Accommodation, personal shopping, tips",
                "itinerary": "Morning: Lamu Old Town walking tour | Afternoon: Museum visits and dhow boat ride",
                "requirements": "Comfortable walking shoes, modest clothing, camera",
                "max_group_size": 8,
                "is_approved": True,
                "created_at": datetime.datetime.utcnow().isoformat(),
                "guide": {
                    "name": "Aisha Mohamed",
                    "experience": "6 years",
                    "languages": ["English", "Swahili", "Arabic"],
                    "rating": 4.8
                }
            }
        ]
        experiences.extend(sample_experiences)
        print("✅ Sample experiences created")

# Initialize data
create_default_admin()
create_sample_experiences()

# Authentication decorators
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
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401
        
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
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'Digital Guides API is running',
        'timestamp': datetime.datetime.utcnow().isoformat()
    })

# Auth endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Check if user already exists
        if any(user['email'] == data['email'] for user in users):
            return jsonify({'message': 'User already exists'}), 400
        
        # Auto-verify all users for demo
        is_verified = True  # Auto-verify everyone for demo
        
        # Create new user
        user_id = len(users) + 1
        user = {
            'id': user_id,
            'first_name': data.get('first_name', ''),
            'last_name': data.get('last_name', ''),
            'email': data['email'],
            'password': bcrypt.generate_password_hash(data['password']).decode('utf-8'),
            'role': data.get('role', 'traveler'),
            'phone': data.get('phone', ''),
            'location': data.get('location', ''),
            'bio': data.get('bio', ''),
            'is_verified': is_verified,
            'created_at': datetime.datetime.utcnow().isoformat()
        }
        
        users.append(user)
        
        # Generate token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        user_response = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({
            'user': user_response,
            'token': token,
            'message': 'User registered successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Email and password required'}), 400
        
        user = next((user for user in users if user['email'] == data['email']), None)
        if not user or not bcrypt.check_password_hash(user['password'], data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        user_response = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({
            'user': user_response,
            'token': token,
            'message': 'Login successful'
        })
        
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    user_response = {k: v for k, v in current_user.items() if k != 'password'}
    return jsonify({'user': user_response})

# Experiences endpoints
@app.route('/api/experiences', methods=['GET'])
def get_experiences():
    try:
        # Only return approved experiences to regular users
        approved_experiences = [exp for exp in experiences if exp.get('is_approved', True)]
        return jsonify({
            'experiences': approved_experiences,
            'count': len(approved_experiences)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch experiences', 'error': str(e)}), 500

@app.route('/api/experiences/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = next((exp for exp in experiences if exp['id'] == experience_id), None)
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
        return jsonify({'experience': experience})
    except Exception as e:
        return jsonify({'message': 'Failed to fetch experience', 'error': str(e)}), 500

# Reviews endpoint
@app.route('/api/reviews/experience/<int:experience_id>', methods=['GET'])
def get_reviews(experience_id):
    # Return empty reviews for now
    return jsonify({'reviews': [], 'count': 0})

# Bookings endpoints
@app.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        experience = next((exp for exp in experiences if exp['id'] == data['experience_id']), None)
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
        
        booking_id = len(bookings) + 1
        booking = {
            'id': booking_id,
            'user_id': current_user['id'],
            'experience_id': data['experience_id'],
            'number_of_guests': data['number_of_guests'],
            'tour_date': data.get('tour_date', datetime.datetime.utcnow().date().isoformat()),
            'special_requests': data.get('special_requests', ''),
            'total_price': data['total_price'],
            'status': 'confirmed',
            'created_at': datetime.datetime.utcnow().isoformat(),
            'updated_at': datetime.datetime.utcnow().isoformat()
        }
        
        bookings.append(booking)
        
        # Add experience and user details to response
        booking_response = booking.copy()
        booking_response['experience'] = experience
        booking_response['user'] = {
            'first_name': current_user['first_name'],
            'last_name': current_user['last_name'],
            'email': current_user['email']
        }
        
        return jsonify({
            'booking': booking_response,
            'message': 'Booking created successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to create booking', 'error': str(e)}), 500

@app.route('/api/bookings/my-bookings', methods=['GET'])
@token_required
def get_my_bookings(current_user):
    try:
        user_bookings = [booking for booking in bookings if booking['user_id'] == current_user['id']]
        
        # Add experience details to each booking
        for booking in user_bookings:
            experience = next((exp for exp in experiences if exp['id'] == booking['experience_id']), {})
            booking['experience'] = experience
        
        return jsonify({
            'bookings': user_bookings,
            'count': len(user_bookings)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch bookings', 'error': str(e)}), 500

# Guide endpoints
@app.route('/api/experiences/my-experiences', methods=['GET'])
@token_required
def get_my_experiences(current_user):
    if current_user['role'] != 'guide':
        return jsonify({'message': 'Only guides can access this endpoint'}), 403
    
    guide_experiences = [exp for exp in experiences if exp.get('guide_id') == current_user['id']]
    return jsonify({
        'experiences': guide_experiences,
        'count': len(guide_experiences)
    })

@app.route('/api/experiences', methods=['POST'])
@token_required
def create_experience(current_user):
    if current_user['role'] != 'guide':
        return jsonify({'message': 'Only guides can create experiences'}), 403
    
    # Auto-verify all guides for demo - remove this check
    # if not current_user.get('is_verified', False):
    #     return jsonify({'message': 'Guide account needs verification before creating experiences'}), 403
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Generate a unique ID
        new_experience_id = max([exp['id'] for exp in experiences], default=0) + 1
        
        experience = {
            'id': new_experience_id,
            'guide_id': current_user['id'],
            'title': data['title'],
            'image': data.get('image', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
            'price_per_person': float(data['price_per_person']),
            'location': data['location'],
            'duration_hours': int(data['duration_hours']),
            'category': data['category'],
            'rating': 0,
            'short_description': data['short_description'],
            'description': data['description'],
            'includes': data.get('includes', ''),
            'excludes': data.get('excludes', ''),
            'itinerary': data.get('itinerary', ''),
            'requirements': data.get('requirements', ''),
            'max_group_size': data.get('max_group_size', 10),
            'is_approved': True,  # Auto-approve for demo
            'created_at': datetime.datetime.utcnow().isoformat(),
            'guide': {
                'name': f"{current_user['first_name']} {current_user['last_name']}",
                'experience': current_user.get('bio', 'New guide'),
                'languages': ['English', 'Swahili'],
                'rating': 0
            }
        }
        
        experiences.append(experience)
        
        return jsonify({
            'experience': experience,
            'message': 'Experience created successfully!'
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to create experience', 'error': str(e)}), 500

# Admin endpoints
@app.route('/api/admin/bookings', methods=['GET'])
@admin_required
def get_all_bookings(current_user):
    try:
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
                'email': user.get('email', ''),
                'phone': user.get('phone', '')
            }
            booking_list.append(booking_with_details)
        
        return jsonify({
            'bookings': booking_list,
            'count': len(booking_list)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch bookings', 'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    try:
        users_response = []
        for user in users:
            user_response = {k: v for k, v in user.items() if k != 'password'}
            # Count user bookings
            user_bookings = [b for b in bookings if b['user_id'] == user['id']]
            user_response['bookings_count'] = len(user_bookings)
            users_response.append(user_response)
        
        return jsonify({
            'users': users_response,
            'count': len(users_response)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch users', 'error': str(e)}), 500

@app.route('/api/admin/statistics', methods=['GET'])
@admin_required
def get_statistics(current_user):
    try:
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
        
        # Experiences by status
        approved_experiences = len([e for e in experiences if e.get('is_approved', False)])
        pending_experiences = len([e for e in experiences if not e.get('is_approved', True)])
        
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
            },
            'experiences_by_status': {
                'approved': approved_experiences,
                'pending': pending_experiences
            },
            'timestamp': datetime.datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch statistics', 'error': str(e)}), 500

@app.route('/api/admin/experiences/pending', methods=['GET'])
@admin_required
def get_pending_experiences(current_user):
    try:
        pending_experiences = [exp for exp in experiences if not exp.get('is_approved', False)]
        return jsonify({
            'experiences': pending_experiences,
            'count': len(pending_experiences)
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch pending experiences', 'error': str(e)}), 500

@app.route('/api/admin/experiences/<int:experience_id>/approve', methods=['PUT'])
@admin_required
def approve_experience(current_user, experience_id):
    try:
        experience = next((exp for exp in experiences if exp['id'] == experience_id), None)
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
        
        experience['is_approved'] = True
        return jsonify({
            'experience': experience,
            'message': 'Experience approved successfully'
        })
    except Exception as e:
        return jsonify({'message': 'Failed to approve experience', 'error': str(e)}), 500

# Root endpoint
@app.route('/')
def index():
    return jsonify({
        'message': 'Digital Guides API',
        'version': '1.0.0',
        'environment': 'production' if os.getenv('RENDER') else 'development',
        'endpoints': {
            'health': '/api/health',
            'experiences': '/api/experiences',
            'register': '/api/auth/register',
            'login': '/api/auth/login',
            'bookings': '/api/bookings',
            'my_bookings': '/api/bookings/my-bookings',
            'admin_bookings': '/api/admin/bookings',
            'admin_users': '/api/admin/users',
            'admin_stats': '/api/admin/statistics'
        },
        'default_admin': 'admin@digitalguides.com / admin123'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Starting Digital Guides API Server...")
    print("📍 Default Admin: admin@digitalguides.com / admin123")
    print("✅ ALL USERS AUTO-VERIFIED FOR DEMO")
    print("✅ ALL GUIDES CAN CREATE EXPERIENCES")
    print("🌐 Server running on port:", port)
    app.run(debug=False, host='0.0.0.0', port=port)
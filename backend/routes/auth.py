from flask import Blueprint, request, jsonify
from models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, 'your-secret-key', algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Registration data received:", data)  # Debug log
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            print("User already exists:", data['email'])
            return jsonify({'error': 'User already exists with this email'}), 400
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        user = User(
            email=data['email'],
            password=hashed_password,
            name=data.get('name', ''),
            role=data.get('role', 'traveler'),
            phone=data.get('phone', ''),
            location=data.get('location', ''),
            bio=data.get('bio', ''),
            is_approved=True  # Auto-approve for now
        )
        
        db.session.add(user)
        db.session.commit()
        print("User created successfully:", user.email)
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, 'your-secret-key', algorithm='HS256')
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'phone': user.phone,
                'location': user.location,
                'bio': user.bio,
                'is_approved': user.is_approved
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print("Registration error:", str(e))  # Debug log
        return jsonify({'error': str(e)}), 400

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
            
        if not check_password_hash(user.password, data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, 'your-secret-key', algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'phone': user.phone,
                'location': user.location,
                'bio': user.bio,
                'is_approved': user.is_approved
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'name': current_user.name,
            'role': current_user.role,
            'phone': current_user.phone,
            'location': current_user.location,
            'bio': current_user.bio,
            'is_approved': current_user.is_approved
        }
    }), 200

    
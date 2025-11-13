from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import db, User, UserRole, Profile
import jwt
from datetime import datetime, timedelta
import secrets

bp = Blueprint('auth', __name__)

# Simple user database for demo (in production, use proper database)
demo_users = {
    'traveler@test.com': {
        'password': 'password123',
        'name': 'Sarah Johnson',
        'role': 'traveler',
        'id': 1
    },
    'guide@kenya.com': {
        'password': 'password123', 
        'name': 'John Mwangi',
        'role': 'guide',
        'id': 2
    },
    'admin@digitalguides.com': {
        'password': 'password123',
        'name': 'Admin User',
        'role': 'admin',
        'id': 3
    }
}

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    user_data = demo_users.get(email)
    if not user_data or user_data['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Check if user exists in database, create if not
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            auth0_id=f"demo-{email}",
            email=email,
            role=UserRole(user_data['role'])
        )
        db.session.add(user)
        db.session.commit()
        
        # Create profile
        profile = Profile(
            user_id=user.id,
            name=user_data['name'],
            location='Nairobi, Kenya' if user_data['role'] == 'guide' else 'Traveler',
            is_approved=(user_data['role'] == 'guide')
        )
        db.session.add(profile)
        db.session.commit()
    
    # Create access token
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=7)
    )
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role.value,
            'name': user.profile.name
        }
    })

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'traveler')
    
    if not email or not password or not name:
        return jsonify({'error': 'Email, password and name required'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 400
    
    user = User(
        auth0_id=f"demo-{secrets.token_hex(8)}",
        email=email,
        role=UserRole(role)
    )
    db.session.add(user)
    db.session.commit()
    
    profile = Profile(
        user_id=user.id,
        name=name,
        location=data.get('location', 'Kenya'),
        is_approved=(role == 'traveler')  # Guides need approval
    )
    db.session.add(profile)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role.value,
            'name': profile.name
        }
    }), 201

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'id': user.id,
        'email': user.email,
        'role': user.role.value,
        'profile': {
            'name': user.profile.name,
            'bio': user.profile.bio,
            'location': user.profile.location,
            'is_approved': user.profile.is_approved
        }
    })

@bp.route('/set-role', methods=['POST'])
@jwt_required()
def set_role():
    user_id = get_jwt_identity()
    data = request.json
    user = User.query.get(user_id)
    
    if data['role'] == 'guide':
        user.role = UserRole.GUIDE
        db.session.commit()
        return jsonify({'message': 'Role updated to guide. Await approval.'})
    
    return jsonify({'error': 'Invalid role'}), 400

    
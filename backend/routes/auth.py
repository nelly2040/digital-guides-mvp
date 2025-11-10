from flask import Blueprint, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from models import db, User, UserRole
from authlib.integrations.flask_client import OAuth
import requests  # For Auth0 token validation

bp = Blueprint('auth', __name__)
jwt = JWTManager()

@bp.route('/login', methods=['POST'])
def login():
    # Auth0 handles login; this is callback-like. In practice, frontend calls Auth0, gets token, sends to /verify
    token = request.json.get('id_token')  # From Auth0
    if not token:
        return jsonify({'error': 'Token required'}), 400
    
    # Verify token with Auth0
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'https://{app.config["AUTH0_DOMAIN"]}/.well-known/jwks.json', headers=headers)
    # Simplified; use pyjwt for full validation
    
    # Decode and create user
    user_info = requests.get('https://your-domain.auth0.com/userinfo', headers=headers).json()
    user = User.query.filter_by(auth0_id=user_info['sub']).first()
    if not user:
        user = User(auth0_id=user_info['sub'], email=user_info['email'])
        db.session.add(user)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'role': user.role.value}})

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({'email': user.email, 'role': user.role.value})
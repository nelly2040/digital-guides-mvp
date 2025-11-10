from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import db, User, UserRole, Profile
import jwt
from authlib.jose import JsonWebKey
import requests
from config import Config

bp = Blueprint('auth', __name__)

@bp.route('/verify', methods=['POST'])
def verify_token():
    data = request.json
    id_token = data.get('id_token')
    if not id_token:
        return jsonify({'error': 'Token required'}), 400
    
    # Auth0 validation from quickstart
    jwks_url = f'https://{Config.AUTH0_DOMAIN}/.well-known/jwks.json'
    jwks = requests.get(jwks_url).json()
    unverified_header = jwt.get_unverified_header(id_token)
    key_id = unverified_header['kid']
    key = next(k for k in jwks['keys'] if k['kid'] == key_id)
    public_key = JsonWebKey.import_key(key)
    
    payload = jwt.decode(
        id_token, public_key, algorithms=['RS256'],
        audience=Config.AUTH0_AUDIENCE, issuer=f'https://{Config.AUTH0_DOMAIN}/'
    )
    
    user_info = payload
    user = User.query.filter_by(auth0_id=user_info['sub']).first()
    if not user:
        user = User(auth0_id=user_info['sub'], email=user_info['email'], role=UserRole.TRAVELER)
        db.session.add(user)
        db.session.commit()
    
    if not user.profile:
        profile = Profile(user_id=user.id, name=user_info.get('name', ''), location='Nairobi')
        db.session.add(profile)
        db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {'id': user.id, 'email': user.email, 'role': user.role.value}
    })

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'id': user.id, 'email': user.email, 'role': user.role.value,
        'profile': {'name': user.profile.name, 'bio': user.profile.bio, 'location': user.profile.location, 'is_approved': user.profile.is_approved}
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
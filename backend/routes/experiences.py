from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Experience, User, Category
from sqlalchemy import or_

bp = Blueprint('experiences', __name__)

@bp.route('/', methods=['GET'])
def browse_experiences():
    query = request.args.get('q', '')
    location = request.args.get('location', '')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    category = request.args.get('category')
    
    experiences = Experience.query
    if query:
        experiences = experiences.filter(or_(Experience.title.contains(query), Experience.description.contains(query)))
    if location:
        experiences = experiences.filter(Experience.location.ilike(f'%{location}%'))
    if min_price:
        experiences = experiences.filter(Experience.price >= float(min_price))
    if max_price:
        experiences = experiences.filter(Experience.price <= float(max_price))
    if category:
        experiences = experiences.filter(Experience.category == Category(category.upper()))
    
    return jsonify([{
        'id': e.id, 'title': e.title, 'description': e.description[:100] + '...',
        'price': e.price, 'location': e.location, 'category': e.category.value,
        'photos': e.photos.split(',') if e.photos else []  # Assume comma-separated
    } for e in experiences.all()])

@bp.route('/<int:id>', methods=['GET'])
def detail(id):
    exp = Experience.query.get_or_404(id)
    return jsonify({
        'id': exp.id, 'title': exp.title, 'description': exp.description,
        'price': exp.price, 'duration_hours': exp.duration_hours,
        'category': exp.category.value, 'location': exp.location,
        'itinerary': exp.itinerary, 'photos': exp.photos.split(',') if exp.photos else [],
        'available_dates': exp.available_dates.split(',') if exp.available_dates else [],  # Parse as needed
        'guide': {'name': exp.guide.profile.name, 'bio': exp.guide.profile.bio, 'location': exp.guide.profile.location}
    })

@bp.route('/', methods=['POST'])
@jwt_required()
def create_experience():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != UserRole.GUIDE:
        return jsonify({'error': 'Only guides can create experiences'}), 403
    
    data = request.json
    exp = Experience(
        title=data['title'], description=data['description'], price=float(data['price']),
        duration_hours=data.get('duration_hours'), category=Category(data['category'].upper()),
        location=data['location'], itinerary=data.get('itinerary', ''),
        photos=','.join(data.get('photos', [])), guide_id=user_id,
        available_dates=','.join(data['available_dates'])
    )
    db.session.add(exp)
    db.session.commit()
    return jsonify({'id': exp.id}), 201
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Experience, Category, Review
import json

bp = Blueprint('experiences', __name__)

@bp.route('/', methods=['GET'])
def get_experiences():
    try:
        # Get filter parameters
        location = request.args.get('location')
        max_price = request.args.get('max_price')
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Experience.query
        
        # Apply filters
        if location:
            query = query.filter(Experience.location.ilike(f'%{location}%'))
        if max_price:
            query = query.filter(Experience.price <= float(max_price))
        if category:
            query = query.filter(Experience.category == Category(category))
        if search:
            query = query.filter(
                (Experience.title.ilike(f'%{search}%')) | 
                (Experience.description.ilike(f'%{search}%'))
            )
        
        experiences = query.order_by(Experience.created_at.desc()).all()
        
        return jsonify([exp.to_dict() for exp in experiences])
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch experiences: {str(e)}'}), 500

@bp.route('/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = Experience.query.get_or_404(experience_id)
        return jsonify(experience.to_dict())
    except Exception as e:
        return jsonify({'error': f'Failed to fetch experience: {str(e)}'}), 500

@bp.route('/', methods=['POST'])
@jwt_required()
def create_experience():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Validate required fields
        required_fields = ['title', 'description', 'price', 'location', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        experience = Experience(
            title=data['title'],
            description=data['description'],
            price=float(data['price']),
            duration_hours=data.get('duration_hours'),
            category=Category(data['category']),
            location=data['location'],
            itinerary=data.get('itinerary', ''),
            photos=json.dumps(data.get('photos', [])),
            available_dates=json.dumps(data.get('available_dates', [])),
            guide_id=user_id
        )
        
        db.session.add(experience)
        db.session.commit()
        
        return jsonify({
            'message': 'Experience created successfully',
            'experience': experience.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create experience: {str(e)}'}), 500

@bp.route('/<int:experience_id>', methods=['PUT'])
@jwt_required()
def update_experience(experience_id):
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        experience = Experience.query.get_or_404(experience_id)
        
        # Check if user is the guide who created this experience
        if experience.guide_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update fields
        if 'title' in data:
            experience.title = data['title']
        if 'description' in data:
            experience.description = data['description']
        if 'price' in data:
            experience.price = float(data['price'])
        if 'duration_hours' in data:
            experience.duration_hours = data['duration_hours']
        if 'category' in data:
            experience.category = Category(data['category'])
        if 'location' in data:
            experience.location = data['location']
        if 'itinerary' in data:
            experience.itinerary = data['itinerary']
        if 'photos' in data:
            experience.photos = json.dumps(data['photos'])
        if 'available_dates' in data:
            experience.available_dates = json.dumps(data['available_dates'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Experience updated successfully',
            'experience': experience.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update experience: {str(e)}'}), 500
from flask import Blueprint, request, jsonify
from models import db, Experience, Review
from routes.auth import token_required

bp = Blueprint('experiences', __name__)

@bp.route('/', methods=['GET'])
def get_experiences():
    try:
        experiences = Experience.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'experiences': [{
                'id': exp.id,
                'title': exp.title,
                'description': exp.description,
                'price': float(exp.price),
                'location': exp.location,
                'category': exp.category,
                'duration': exp.duration,
                'image_url': exp.image_url,
                'guide_id': exp.guide_id,
                'max_people': exp.max_people,
                'includes': exp.includes,
                'excludes': exp.excludes,
                'created_at': exp.created_at.isoformat() if exp.created_at else None
            } for exp in experiences]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    try:
        experience = Experience.query.get(experience_id)
        if not experience:
            return jsonify({
                'success': False,
                'error': 'Experience not found'
            }), 404
        
        return jsonify({
            'success': True,
            'experience': {
                'id': experience.id,
                'title': experience.title,
                'description': experience.description,
                'price': float(experience.price),
                'location': experience.location,
                'category': experience.category,
                'duration': experience.duration,
                'image_url': experience.image_url,
                'guide_id': experience.guide_id,
                'max_people': experience.max_people,
                'includes': experience.includes,
                'excludes': experience.excludes,
                'created_at': experience.created_at.isoformat() if experience.created_at else None,
                'guide': {
                    'id': experience.guide.id,
                    'name': experience.guide.name,
                    'email': experience.guide.email,
                    'location': experience.guide.location,
                    'bio': experience.guide.bio
                } if experience.guide else None
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/', methods=['POST'])
@token_required
def create_experience(current_user):
    try:
        data = request.get_json()
        
        experience = Experience(
            title=data['title'],
            description=data['description'],
            price=float(data['price']),
            location=data['location'],
            category=data['category'],
            duration=data.get('duration', ''),
            max_people=data.get('max_people', 10),
            includes=data.get('includes', ''),
            excludes=data.get('excludes', ''),
            image_url=data.get('image_url', ''),
            guide_id=current_user.id
        )
        
        db.session.add(experience)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Experience created successfully',
            'experience': {
                'id': experience.id,
                'title': experience.title,
                'description': experience.description,
                'price': float(experience.price),
                'location': experience.location,
                'category': experience.category
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@bp.route('/guide', methods=['GET'])
@token_required
def get_guide_experiences(current_user):
    try:
        experiences = Experience.query.filter_by(guide_id=current_user.id).all()
        
        return jsonify({
            'success': True,
            'experiences': [{
                'id': exp.id,
                'title': exp.title,
                'description': exp.description,
                'price': float(exp.price),
                'location': exp.location,
                'category': exp.category,
                'duration': exp.duration,
                'image_url': exp.image_url,
                'max_people': exp.max_people,
                'includes': exp.includes,
                'excludes': exp.excludes,
                'created_at': exp.created_at.isoformat() if exp.created_at else None
            } for exp in experiences]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

        
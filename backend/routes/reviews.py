from flask import Blueprint, request, jsonify
from models import db, Review, Experience, User
from routes.auth import token_required

bp = Blueprint('reviews', __name__)

@bp.route('/', methods=['POST'])
@token_required
def create_review(current_user):
    try:
        data = request.get_json()
        
        # Check if experience exists
        experience = Experience.query.get(data['experience_id'])
        if not experience:
            return jsonify({
                'success': False,
                'error': 'Experience not found'
            }), 404
        
        # Check if user has already reviewed this experience
        existing_review = Review.query.filter_by(
            experience_id=data['experience_id'],
            user_id=current_user.id
        ).first()
        
        if existing_review:
            return jsonify({
                'success': False,
                'error': 'You have already reviewed this experience'
            }), 400
        
        # Create review
        review = Review(
            experience_id=data['experience_id'],
            user_id=current_user.id,
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Review created successfully',
            'review': {
                'id': review.id,
                'experience_id': review.experience_id,
                'user_id': review.user_id,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at.isoformat() if review.created_at else None
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@bp.route('/experience/<int:experience_id>', methods=['GET'])
def get_reviews_by_experience(experience_id):
    try:
        reviews = Review.query.filter_by(experience_id=experience_id).all()
        
        return jsonify({
            'success': True,
            'reviews': [{
                'id': review.id,
                'experience_id': review.experience_id,
                'user_id': review.user_id,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at.isoformat() if review.created_at else None,
                'user': {
                    'id': review.user.id,
                    'name': review.user.name
                } if review.user else None
            } for review in reviews]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

        
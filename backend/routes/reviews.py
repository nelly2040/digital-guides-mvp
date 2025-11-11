from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Review, Booking, Experience
from datetime import datetime

bp = Blueprint('reviews', __name__)

@bp.route('/<int:experience_id>', methods=['GET'])
def get_reviews(experience_id):
    reviews = Review.query.filter_by(experience_id=experience_id).all()
    return jsonify([{
        'id': r.id, 
        'rating': r.rating, 
        'comment': r.comment, 
        'created_at': r.created_at.isoformat(),
        'traveler_name': r.booking.traveler.profile.name
    } for r in reviews])

@bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.json
    
    # Check if booking exists and belongs to user
    booking = Booking.query.filter_by(
        id=data['booking_id'],
        traveler_id=user_id,
        status='completed'
    ).first()
    
    if not booking:
        return jsonify({'error': 'Booking not found or not completed'}), 404
    
    # Check if review already exists for this booking
    existing_review = Review.query.filter_by(booking_id=data['booking_id']).first()
    if existing_review:
        return jsonify({'error': 'Review already exists for this booking'}), 400
    
    review = Review(
        booking_id=data['booking_id'],
        experience_id=data['experience_id'],
        rating=data['rating'],
        comment=data['comment']
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        'id': review.id,
        'message': 'Review submitted successfully'
    }), 201
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Review, Booking
from datetime import datetime

bp = Blueprint('reviews', __name__)

@bp.route('/<int:experience_id>', methods=['GET'])
def get_reviews(experience_id):
    reviews = Review.query.filter_by(experience_id=experience_id).all()
    return jsonify([{'id': r.id, 'rating': r.rating, 'comment': r.comment, 'created_at': r.created_at.isoformat()} for r in reviews])

@bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.json
    booking = Booking.query.get(data['booking_id'])
    if booking.traveler_id != user_id or booking.status != 'completed':
        return jsonify({'error': 'Unauthorized'}), 403
    
    review = Review(
        booking_id=data['booking_id'],
        experience_id=data['experience_id'],
        rating=data['rating'],
        comment=data['comment']
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'id': review.id}), 201
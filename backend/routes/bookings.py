from flask import Blueprint, request, jsonify
from models import db, Booking, Experience, User
from routes.auth import token_required

bp = Blueprint('bookings', __name__)

@bp.route('/', methods=['POST'])
@token_required
def create_booking(current_user):
    try:
        data = request.get_json()
        
        # Check if experience exists
        experience = Experience.query.get(data['experience_id'])
        if not experience:
            return jsonify({
                'success': False,
                'error': 'Experience not found'
            }), 404
        
        # Create booking
        booking = Booking(
            experience_id=data['experience_id'],
            user_id=current_user.id,
            booking_date=data['booking_date'],
            number_of_people=data['number_of_people'],
            total_price=float(data['number_of_people']) * experience.price,
            status='pending'
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Booking created successfully',
            'booking': {
                'id': booking.id,
                'experience_id': booking.experience_id,
                'user_id': booking.user_id,
                'booking_date': booking.booking_date.isoformat() if booking.booking_date else None,
                'number_of_people': booking.number_of_people,
                'total_price': float(booking.total_price),
                'status': booking.status,
                'created_at': booking.created_at.isoformat() if booking.created_at else None
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@bp.route('/user', methods=['GET'])
@token_required
def get_user_bookings(current_user):
    try:
        bookings = Booking.query.filter_by(user_id=current_user.id).all()
        
        return jsonify({
            'success': True,
            'bookings': [{
                'id': booking.id,
                'experience_id': booking.experience_id,
                'user_id': booking.user_id,
                'booking_date': booking.booking_date.isoformat() if booking.booking_date else None,
                'number_of_people': booking.number_of_people,
                'total_price': float(booking.total_price),
                'status': booking.status,
                'created_at': booking.created_at.isoformat() if booking.created_at else None,
                'experience': {
                    'id': booking.experience.id,
                    'title': booking.experience.title,
                    'location': booking.experience.location,
                    'price': float(booking.experience.price),
                    'image_url': booking.experience.image_url
                } if booking.experience else None
            } for booking in bookings]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/guide', methods=['GET'])
@token_required
def get_guide_bookings(current_user):
    try:
        # Get bookings for experiences created by the current guide
        bookings = Booking.query.join(Experience).filter(
            Experience.guide_id == current_user.id
        ).all()
        
        return jsonify({
            'success': True,
            'bookings': [{
                'id': booking.id,
                'experience_id': booking.experience_id,
                'user_id': booking.user_id,
                'booking_date': booking.booking_date.isoformat() if booking.booking_date else None,
                'number_of_people': booking.number_of_people,
                'total_price': float(booking.total_price),
                'status': booking.status,
                'created_at': booking.created_at.isoformat() if booking.created_at else None,
                'experience': {
                    'id': booking.experience.id,
                    'title': booking.experience.title,
                    'location': booking.experience.location
                } if booking.experience else None,
                'user': {
                    'id': booking.user.id,
                    'name': booking.user.name,
                    'email': booking.user.email
                } if booking.user else None
            } for booking in bookings]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
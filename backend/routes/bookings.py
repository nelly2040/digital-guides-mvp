from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking, Experience, User, Profile
import stripe
from datetime import datetime
import json

bp = Blueprint('bookings', __name__)

@bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Validate required fields
        required_fields = ['experience_id', 'tour_date', 'guest_count']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Get experience
        experience = Experience.query.get(data['experience_id'])
        if not experience:
            return jsonify({'error': 'Experience not found'}), 404
        
        # Validate tour date is available
        available_dates = json.loads(experience.available_dates or '[]')
        tour_date_str = data['tour_date']
        if tour_date_str not in available_dates:
            return jsonify({'error': 'Selected date is not available'}), 400
        
        # Calculate total amount
        total_amount = experience.price * data['guest_count']
        
        # Create booking record (simplified without Stripe for now)
        booking = Booking(
            experience_id=data['experience_id'],
            traveler_id=user_id,
            tour_date=datetime.strptime(tour_date_str, '%Y-%m-%d'),
            guest_count=data['guest_count'],
            total_amount=total_amount,
            status='confirmed'
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking_id': booking.id,
            'total_amount': total_amount
        }), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Booking creation failed: {str(e)}'}), 500

@bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_bookings():
    try:
        user_id = get_jwt_identity()
        
        bookings = Booking.query.filter_by(traveler_id=user_id).join(
            Experience, Booking.experience_id == Experience.id
        ).join(
            User, Experience.guide_id == User.id
        ).join(
            Profile, User.id == Profile.user_id
        ).add_columns(
            Experience.title,
            Experience.price,
            Experience.location,
            Profile.name.label('guide_name'),
            Booking.tour_date,
            Booking.guest_count,
            Booking.total_amount,
            Booking.status,
            Booking.id
        ).order_by(Booking.booking_date.desc()).all()
        
        booking_list = []
        for booking in bookings:
            booking_list.append({
                'id': booking.id,
                'experience_title': booking.title,
                'guide_name': booking.guide_name,
                'tour_date': booking.tour_date.isoformat(),
                'guest_count': booking.guest_count,
                'total_amount': booking.total_amount,
                'status': booking.status,
                'location': booking.location
            })
        
        return jsonify(booking_list)
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch bookings: {str(e)}'}), 500

@bp.route('/guide/<guide_id>', methods=['GET'])
@jwt_required()
def get_guide_bookings(guide_id):
    try:
        current_user_id = get_jwt_identity()
        
        # Verify the current user is the guide or admin
        current_user = User.query.get(current_user_id)
        if str(current_user_id) != guide_id and current_user.role.value != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        bookings = Booking.query.join(
            Experience, Booking.experience_id == Experience.id
        ).join(
            User, Booking.traveler_id == User.id
        ).join(
            Profile, User.id == Profile.user_id
        ).filter(
            Experience.guide_id == guide_id
        ).add_columns(
            Experience.title.label('experience_title'),
            Profile.name.label('traveler_name'),
            Booking.tour_date,
            Booking.guest_count,
            Booking.total_amount,
            Booking.status,
            Booking.id
        ).order_by(Booking.tour_date.asc()).all()
        
        booking_list = []
        for booking in bookings:
            booking_list.append({
                'id': booking.id,
                'experience_title': booking.experience_title,
                'traveler_name': booking.traveler_name,
                'tour_date': booking.tour_date.isoformat(),
                'guest_count': booking.guest_count,
                'total_amount': booking.total_amount,
                'status': booking.status
            })
        
        return jsonify(booking_list)
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch guide bookings: {str(e)}'}), 500

@bp.route('/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        booking = Booking.query.get_or_404(booking_id)
        experience = Experience.query.get(booking.experience_id)
        
        # Check if user is the guide for this experience or admin
        current_user = User.query.get(user_id)
        if experience.guide_id != user_id and current_user.role.value != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        new_status = data.get('status')
        
        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        booking.status = new_status
        db.session.commit()
        
        return jsonify({
            'message': 'Booking status updated successfully',
            'booking': {
                'id': booking.id,
                'status': booking.status
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update booking status: {str(e)}'}), 500

@bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    try:
        user_id = get_jwt_identity()
        
        booking = Booking.query.get_or_404(booking_id)
        
        # Check if user is authorized to view this booking
        current_user = User.query.get(user_id)
        experience = Experience.query.get(booking.experience_id)
        
        if (booking.traveler_id != user_id and 
            experience.guide_id != user_id and 
            current_user.role.value != 'admin'):
            return jsonify({'error': 'Unauthorized'}), 403
        
        booking_data = {
            'id': booking.id,
            'experience_id': booking.experience_id,
            'traveler_id': booking.traveler_id,
            'tour_date': booking.tour_date.isoformat(),
            'guest_count': booking.guest_count,
            'total_amount': booking.total_amount,
            'status': booking.status,
            'booking_date': booking.booking_date.isoformat()
        }
        
        return jsonify(booking_data)
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch booking: {str(e)}'}), 500
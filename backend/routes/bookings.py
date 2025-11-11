from flask import Blueprint, jsonify, request
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
        required_fields = ['experience_id', 'tour_date', 'guest_count', 'payment_method_id']
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
        
        # Create Stripe payment intent
        try:
            stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
            
            # Create payment intent
            payment_intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Convert to cents
                currency='usd',
                payment_method=data['payment_method_id'],
                confirm=True,
                return_url=f'{request.host_url}bookings/success',
                metadata={
                    'experience_id': str(experience.id),
                    'guide_id': str(experience.guide_id),
                    'traveler_id': str(user_id),
                    'tour_date': tour_date_str
                }
            )
            
            # Create booking record
            booking = Booking(
                experience_id=data['experience_id'],
                traveler_id=user_id,
                tour_date=datetime.strptime(tour_date_str, '%Y-%m-%d'),
                guest_count=data['guest_count'],
                total_amount=total_amount,
                status='confirmed',  # Since payment is confirmed
                stripe_payment_intent=payment_intent.id
            )
            
            db.session.add(booking)
            db.session.commit()
            
            return jsonify({
                'message': 'Booking created successfully',
                'booking_id': booking.id,
                'payment_status': payment_intent.status
            }), 201
            
        except stripe.error.StripeError as e:
            return jsonify({'error': f'Payment failed: {str(e)}'}), 400
            
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

@bp.route('/<int:booking_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_booking(booking_id):
    try:
        user_id = get_jwt_identity()
        
        booking = Booking.query.get_or_404(booking_id)
        
        # Check if user is authorized to cancel this booking
        if booking.traveler_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Check if booking can be cancelled (not completed or already cancelled)
        if booking.status in ['completed', 'cancelled']:
            return jsonify({'error': 'Cannot cancel a completed or already cancelled booking'}), 400
        
        # Process refund via Stripe if payment was made
        if booking.stripe_payment_intent:
            try:
                stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
                refund = stripe.Refund.create(
                    payment_intent=booking.stripe_payment_intent
                )
                # You might want to store refund info in your database
            except stripe.error.StripeError as e:
                # Log the error but still cancel the booking
                print(f"Stripe refund failed: {str(e)}")
        
        booking.status = 'cancelled'
        db.session.commit()
        
        return jsonify({
            'message': 'Booking cancelled successfully',
            'booking_id': booking.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to cancel booking: {str(e)}'}), 500

# Webhook endpoint for Stripe payments (optional but recommended)
@bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    try:
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get('Stripe-Signature')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, current_app.config['STRIPE_WEBHOOK_SECRET']
            )
        except ValueError as e:
            return jsonify({'error': 'Invalid payload'}), 400
        except stripe.error.SignatureVerificationError as e:
            return jsonify({'error': 'Invalid signature'}), 400
        
        # Handle specific event types
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # Update booking status to confirmed
            booking = Booking.query.filter_by(
                stripe_payment_intent=payment_intent['id']
            ).first()
            if booking:
                booking.status = 'confirmed'
                db.session.commit()
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            # Update booking status to failed
            booking = Booking.query.filter_by(
                stripe_payment_intent=payment_intent['id']
            ).first()
            if booking:
                booking.status = 'failed'
                db.session.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'error': f'Webhook error: {str(e)}'}), 500
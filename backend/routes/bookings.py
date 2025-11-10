import stripe
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking

stripe.api_key = app.config['STRIPE_SECRET_KEY']
bp = Blueprint('bookings', __name__)

@bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.json
    exp_id = data['experience_id']
    tour_date = data['tour_date']  # ISO format
    guest_count = data.get('guest_count', 1)
    
    exp = Experience.query.get(exp_id)
    if not exp:
        return jsonify({'error': 'Experience not found'}), 404
    
    total = exp.price * guest_count
    
    # Create Stripe Payment Intent
    intent = stripe.PaymentIntent.create(
        amount=int(total * 100),  # Cents
        currency='usd',
        metadata={'experience_id': str(exp_id), 'traveler_id': str(user_id)}
    )
    
    booking = Booking(
        experience_id=exp_id, traveler_id=user_id, tour_date=tour_date,
        guest_count=guest_count, total_amount=total, stripe_payment_intent=intent.id
    )
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({
        'id': booking.id, 'client_secret': intent.client_secret,  # For frontend Stripe confirm
        'total': total
    }), 201

@bp.route('/guide/<int:guide_id>', methods=['GET'])  # Guide dashboard
@jwt_required()
def guide_bookings(guide_id):
    user_id = get_jwt_identity()
    if user_id != guide_id:
        return jsonify({'error': 'Unauthorized'}), 403
    bookings = Booking.query.join(Experience).filter(Experience.guide_id == guide_id).all()
    return jsonify([{
        'id': b.id, 'experience_title': b.experience.title, 'tour_date': b.tour_date.isoformat(),
        'guest_count': b.guest_count, 'status': b.status
    } for b in bookings])
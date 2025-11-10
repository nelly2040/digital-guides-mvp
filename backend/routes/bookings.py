import stripe
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking, Experience
from datetime import datetime

bp = Blueprint('bookings', __name__)

@bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']  # Load here, in context
    user_id = get_jwt_identity()
    data = request.json
    exp_id = data['experience_id']
    tour_date_str = data['tour_date']
    guest_count = data.get('guest_count', 1)
    
    exp = Experience.query.get_or_404(exp_id)
    if not exp.guide.profile.is_approved:
        return jsonify({'error': 'Guide not approved'}), 403
    
    try:
        tour_date = datetime.fromisoformat(tour_date_str)
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    
    total = exp.price * guest_count
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency='usd',
            metadata={'experience_id': str(exp_id), 'traveler_id': str(user_id)}
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    booking = Booking(
        experience_id=exp_id,
        traveler_id=user_id,
        tour_date=tour_date,
        guest_count=guest_count,
        total_amount=total,
        stripe_payment_intent=intent.id
    )
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({
        'id': booking.id,
        'client_secret': intent.client_secret,
        'total': total
    }), 201

@bp.route('/guide/<int:guide_id>', methods=['GET'])
@jwt_required()
def guide_bookings(guide_id):
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']  # Load here too
    user_id = get_jwt_identity()
    if user_id != guide_id:
        return jsonify({'error': 'Unauthorized'}), 403
    bookings = db.session.query(Booking).join(Experience).filter(Experience.guide_id == guide_id).all()
    return jsonify([{
        'id': b.id,
        'experience_title': b.experience.title,
        'tour_date': b.tour_date.isoformat(),
        'guest_count': b.guest_count,
        'status': b.status,
        'total_amount': b.total_amount
    } for b in bookings])
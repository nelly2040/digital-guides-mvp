from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Profile, Experience

bp = Blueprint('admin', __name__)

@bp.route('/guides/approve/<int:guide_id>', methods=['POST'])
@jwt_required()
def approve_guide(guide_id):
    user_id = get_jwt_identity()
    admin_user = User.query.get(user_id)
    if admin_user.role != UserRole.ADMIN:
        return jsonify({'error': 'Admin only'}), 403
    guide = User.query.get(guide_id)
    if guide.role != UserRole.GUIDE:
        return jsonify({'error': 'Not a guide'}), 400
    guide.profile.is_approved = True
    db.session.commit()
    return jsonify({'message': 'Approved'})


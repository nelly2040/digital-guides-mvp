from flask import Blueprint, jsonify
from models import User, db
from functools import wraps

bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # For now, we'll skip admin authentication for testing
        # In production, you should check if current_user.role == 'admin'
        return f(*args, **kwargs)
    return decorated

@bp.route('/guides', methods=['GET'])
@admin_required
def list_guides():
    try:
        guides = User.query.filter_by(role='guide').all()
        return jsonify({
            'success': True,
            'guides': [{
                'id': guide.id,
                'name': guide.name,
                'email': guide.email,
                'phone': guide.phone,
                'location': guide.location,
                'bio': guide.bio,
                'is_approved': guide.is_approved,
                'created_at': guide.created_at.isoformat() if guide.created_at else None
            } for guide in guides]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/guides/<int:guide_id>/approve', methods=['PUT'])
@admin_required
def approve_guide(guide_id):
    try:
        guide = User.query.get(guide_id)
        if not guide or guide.role != 'guide':
            return jsonify({
                'success': False,
                'error': 'Guide not found'
            }), 404
        
        guide.is_approved = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Guide approved successfully',
            'guide': {
                'id': guide.id,
                'name': guide.name,
                'email': guide.email,
                'is_approved': guide.is_approved
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Profile

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404
    return jsonify({
        "userId": user_id,
        "name": profile.user.name,
        "email": profile.user.email,
        "interests": profile.interests
    }), 200

@profile_bp.route('/interests', methods=['PATCH'])
@jwt_required()
def update_interests():
    user_id = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404
    data = request.json
    profile.interests = data.get('interests', profile.interests)
    db.session.commit()
    return jsonify({"message": "Interests updated successfully"}), 200
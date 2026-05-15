from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.utils.admin_guard import require_admin
from app.models import User, Job
from app.extensions import db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@require_admin
def get_all_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role,
        "status": u.status,
        "created_at": str(u.created_at)
    } for u in users]), 200

@admin_bp.route('/users/<string:user_id>/toggle-status', methods=['PATCH'])
@jwt_required()
@require_admin
def toggle_user_status(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.status = "blocked" if user.status == "active" else "active"
    db.session.commit()
    return jsonify({"message": "Status updated", "status": user.status}), 200

@admin_bp.route('/jobs/<string:job_id>', methods=['DELETE'])
@jwt_required()
@require_admin
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted"}), 200
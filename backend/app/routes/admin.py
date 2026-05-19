from flask import Blueprint, jsonify, request
from app.middleware.admin_guard import require_admin
from app.models import User, Job
from app.extensions import db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
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
@require_admin
def toggle_user_status(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    if user.role == "admin":
        return jsonify({"error": "Cannot block an admin"}), 403
    user.status = "blocked" if user.status == "active" else "active"
    db.session.commit()
    return jsonify({"message": "Status updated", "status": user.status}), 200

@admin_bp.route('/jobs', methods=['GET'])
@require_admin
def get_all_jobs():
    jobs = Job.query.all()
    return jsonify([{
        "id": j.id,
        "title": j.titleAr,
        "title_en": j.titleEn,
    } for j in jobs]), 200

@admin_bp.route('/jobs/<string:job_id>', methods=['DELETE'])
@require_admin
def delete_job(job_id):
    job = db.session.get(Job, job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted"}), 200

@admin_bp.route('/jobs/<string:job_id>/skills', methods=['PATCH'])
@require_admin
def update_job_skills(job_id):
    job = db.session.get(Job, job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    
    data = request.get_json()
    job.skills = data.get("skills", [])
    db.session.commit()
    
    return jsonify({"message": "Skills updated", "skills": job.skills}), 200
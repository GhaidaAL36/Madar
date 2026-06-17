from flask import Blueprint, jsonify, request
from app.middleware.admin_guard import require_admin
from app.models import User, Job, Simulation, Task, Review, Submission
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

@admin_bp.route('/users/<string:user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    if user.role == "admin":
        return jsonify({"error": "Cannot delete an admin"}), 403
    
    if user.profile:
        db.session.delete(user.profile)
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

@admin_bp.route('/jobs', methods=['POST'])
@require_admin
def add_job():
    data = request.get_json()
    job = Job(
        id=data["id"],
        icon=data["icon"],
        title_ar=data["title_ar"],
        title_en=data["title_en"],
        description_primary=data["description_primary"],
        description_secondary=data["description_secondary"],
        skills=data.get("skills", []),
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({"message": "Job created", "id": job.id}), 201

@admin_bp.route('/simulations', methods=['GET'])
@require_admin
def get_all_simulations():
    from sqlalchemy import text
    rows = db.session.execute(text("""
        SELECT 
            s.id as sim_id,
            s.status,
            s.started_at,
            s.completed_at,
            t.id as task_id,
            t.title as task_title,
            t.type as task_type,
            j.id as job_id,
            j.title_ar,
            r.score,
            r.fit_percent
        FROM simulations s
        LEFT JOIN tasks t ON t.id = s.task_id
        LEFT JOIN jobs j ON j.id = t.job_id
        LEFT JOIN submissions sub ON sub.simulation_id = s.id
        LEFT JOIN reviews r ON r.submission_id = sub.id
        ORDER BY s.started_at DESC
        LIMIT 50
    """)).fetchall()

    result = []
    for row in rows:
        result.append({
            "simulationId": row.sim_id,
            "status":       row.status,
            "startedAt":    row.started_at.isoformat(),
            "completedAt":  row.completed_at.isoformat() if row.completed_at else None,
            "jobId":        row.job_id,
            "jobTitleAr":   row.title_ar or "",
            "taskTitle":    row.task_title or "",
            "taskType":     row.task_type or "",
            "taskDbId":     row.task_id,
            "score":        row.score,
            "fitPercent":   row.fit_percent,
            "user":         None,
        })

    return jsonify(result), 200
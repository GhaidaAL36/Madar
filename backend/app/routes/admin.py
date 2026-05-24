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
    simulations = (
        Simulation.query
        .order_by(Simulation.started_at.desc())
        .all()
    )

    result = []
    for sim in simulations:
        task = Task.query.get(sim.task_id)
        job = Job.query.get(task.job_id) if task else None
        submission = Submission.query.filter_by(simulation_id=sim.id).first()
        review = Review.query.filter_by(submission_id=submission.id).first() if submission else None

        # get user info if simulation is linked to a user
        user = None
        if sim.user_id:
            user = User.query.get(sim.user_id)

        result.append({
            "simulationId":  sim.id,
            "status":        sim.status,
            "startedAt":     sim.started_at.isoformat(),
            "completedAt":   sim.completed_at.isoformat() if sim.completed_at else None,
            "jobId":         job.id if job else None,
            "jobTitleAr":    job.title_ar if job else "",
            "taskTitle":     task.title if task else "",
            "taskType":      task.type if task else "",
            "taskDbId":      task.id if task else None,
            "score":         review.score if review else None,
            "fitPercent":    review.fit_percent if review else None,
            "user": {
                "id":    user.id,
                "name":  user.name,
                "email": user.email,
            } if user else None,   # None = anonymous simulation
        })

    return jsonify(result), 200
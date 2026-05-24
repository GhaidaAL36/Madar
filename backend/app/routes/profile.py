from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Profile, Simulation, Task, Job, Submission, Review

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

@profile_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    simulations = (
        Simulation.query
        .filter_by(user_id=user_id, status="completed")
        .order_by(Simulation.completed_at.desc())
        .all()
    )
    result = []
    for sim in simulations:
        task = Task.query.get(sim.task_id)
        job = Job.query.get(task.job_id) if task else None
        submission = Submission.query.filter_by(simulation_id=sim.id).first()
        review = Review.query.filter_by(submission_id=submission.id).first() if submission else None
        result.append({
        "simulationId": sim.id,
        "completedAt":  sim.completed_at.isoformat(),
        "jobId":        job.id if job else None,
        "jobTitleAr":   job.title_ar if job else "",
        "taskTitle":    task.title if task else "",
        "taskType":     task.type if task else "",
        "taskDbId":     task.id if task else None,  
        "score":        review.score if review else None,
        "fitPercent":   review.fit_percent if review else None,
    })
    return jsonify(result), 200
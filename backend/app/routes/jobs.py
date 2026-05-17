from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models import Job, Task, Simulation, Submission, Review
from ai.ai_engine import evaluateResponse
from ..extensions import db

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/", methods=["GET"], strict_slashes=False)
def get_jobs():
    try:
        jobs = Job.query.all()
        return jsonify([{
            "id": job.id,
            "icon": job.icon,
            "title_ar": job.title_ar,
            "title_en": job.title_en,
            "description_primary": job.description_primary,
            "description_secondary": job.description_secondary,
            "skills": job.skills
        } for job in jobs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route("/<job_id>", methods=["GET", "OPTIONS"])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify({
        "id": job.id,
        "icon": job.icon,
        "title_ar": job.title_ar,
        "title_en": job.title_en,
        "description_primary": job.description_primary,
        "description_secondary": job.description_secondary,
        "skills": job.skills
    }), 200

@jobs_bp.route("/<job_id>/tasks", methods=["GET"])
def get_tasks(job_id):
    tasks = Task.query.filter_by(job_id=job_id).all()
    return jsonify([{
        "id": task.id,
        "job_id": task.job_id,
        "type": task.type,
        "title": task.title,
        "full_title": task.full_title,
        "duration": task.duration,
        "time_range": task.time_range,
        "description": task.description,
        "will_learn": task.will_learn or [],
        "will_do": task.will_do or [],
        "expectations": task.expectations or [],
        "evaluation_criteria": task.evaluation_criteria or [],
        "content": task.content
    } for task in tasks]), 200

@jobs_bp.route("/<job_id>/tasks/<int:task_id>", methods=["GET"])
def get_task(job_id, task_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({
        "id": task.id,
        "job_id": task.job_id,
        "type": task.type,
        "title": task.title,
        "full_title": task.full_title,
        "duration": task.duration,
        "time_range": task.time_range,
        "description": task.description,
        "will_learn": task.will_learn,
        "will_do": task.will_do,
        "expectations": task.expectations,
        "evaluation_criteria": task.evaluation_criteria,
        "content": task.content
    }), 200

@jobs_bp.route("/<job_id>/tasks/<int:task_id>/simulations", methods=["POST"])
def create_simulation(job_id, task_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    simulation = Simulation(
        task_id=task_id,
        status="in_progress",
        started_at=datetime.utcnow(),
    )
    db.session.add(simulation)
    db.session.commit()

    return jsonify({
        "id":           simulation.id,
        "task_id":      simulation.task_id,
        "status":       simulation.status,
        "started_at":   simulation.started_at.isoformat(),
        "completed_at": None,
    }), 201


@jobs_bp.route("/<job_id>/tasks/<int:task_id>/simulations/<simulation_id>", methods=["GET"])
def get_simulation(job_id, task_id, simulation_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    simulation = Simulation.query.filter_by(id=simulation_id, task_id=task_id).first()
    if not simulation:
        return jsonify({"error": "Simulation not found"}), 404

    return jsonify({
        "simulation": {
            "id":           simulation.id,
            "task_id":      simulation.task_id,
            "status":       simulation.status,
            "started_at":   simulation.started_at.isoformat(),
            "completed_at": simulation.completed_at.isoformat() if simulation.completed_at else None,
        },
        "task": {
            "id":                  task.id,
            "job_id":              task.job_id,
            "type":                task.type,
            "title":               task.title,
            "full_title":          task.full_title,
            "duration":            task.duration,
            "time_range":          task.time_range,
            "description":         task.description,
            "will_learn":          task.will_learn,
            "will_do":             task.will_do,
            "expectations":        task.expectations,
            "evaluation_criteria": task.evaluation_criteria,
            "content":             task.content,
        },
    }), 200


@jobs_bp.route("/<job_id>/tasks/<int:task_id>/simulations/<simulation_id>/submit", methods=["POST"])
def submit_simulation(job_id, task_id, simulation_id):
    simulation = Simulation.query.filter_by(id=simulation_id, task_id=task_id).first()
    if not simulation:
        return jsonify({"error": "Simulation not found"}), 404

    if simulation.status == "completed":
        return jsonify({"error": "Already submitted"}), 400

    data = request.get_json(silent=True) or {}
    questions = data.get("questions", [])
    user_answers = data.get("user_answers", {})

    result = evaluateResponse(questions, user_answers)

    submission = Submission(
        simulation_id=simulation_id,
        task_id=task_id,
        answer_type="mcq",
        analysis=str(user_answers),
    )
    simulation.status = "completed"
    simulation.completed_at = datetime.utcnow()
    db.session.add(submission)
    db.session.flush()

    review = Review(
        submission_id=submission.id,
        score=result["score"],
        fit_percent=result["score"],
        fit_summary=result["feedback"],
        strengths=[],
        improvements=[],
        detailed_feedback=[result["feedback"]],
        skills_json=[],
        answer_review_json=result["answer_review"],
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "id":            submission.id,
        "simulation_id": submission.simulation_id,
        "submitted_at":  submission.submitted_at.isoformat(),
    }), 201

@jobs_bp.route("/<job_id>/tasks/<int:task_id>/simulations/<simulation_id>/review", methods=["GET"])
def get_review(job_id, task_id, simulation_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    simulation = Simulation.query.filter_by(id=simulation_id, task_id=task_id).first()
    if not simulation:
        return jsonify({"error": "Simulation not found"}), 404

    submission = Submission.query.filter_by(simulation_id=simulation_id).first()
    if not submission:
        return jsonify({"error": "Submission not found"}), 404

    job = Job.query.get(job_id)
    review = Review.query.filter_by(submission_id=submission.id).first()
    if not review:
        return jsonify({"error": "Review not found"}), 404   # ← clean error, no dummy data

    return jsonify({
        "review": {
            "score":            review.score,
            "fitPercent":       review.fit_percent,
            "fitSummary":       review.fit_summary,
            "strengths":        review.strengths,
            "improvements":     review.improvements,
            "detailedFeedback": review.detailed_feedback,
            "skills":           review.skills_json,
            "answerReview":     review.answer_review_json,
        },
        "jobTitleAr":   job.title_ar,
        "taskTitle":    task.title,
        "taskDuration": task.duration,
    }), 200
from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models import Job, Task, Simulation, Submission, Review
from ai.ai_engine import evaluateResponse
from ..extensions import db

review_bp = Blueprint("review", __name__)


@review_bp.route("/<job_id>/tasks/<int:task_id>/simulations/<simulation_id>/review", methods=["GET"])
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
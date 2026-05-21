from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models import Job, Task, Simulation, Submission, Review
from ..extensions import db
from ai.ai_engine import evaluateResponse

submission_bp = Blueprint("submission", __name__)


@submission_bp.route("/<job_id>/tasks/<int:task_id>/simulations/<simulation_id>/submit", methods=["POST"])
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
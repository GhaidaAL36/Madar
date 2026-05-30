from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models import Job, Task, Simulation, Submission, Review
from ..extensions import db
from ai.ai_engine import evaluateResponse
from ai.evaluation import EvaluationService

submission_bp = Blueprint("submission", __name__)
evaluation_service = EvaluationService()

@submission_bp.route("/<job_id>/tasks/<task_id>/simulations/<simulation_id>/submit", methods=["POST"])
def submit_simulation(job_id, task_id, simulation_id):
    try:
        task_id_int = int(task_id)
    except ValueError:
        task_id_int = None

    task = Task.query.filter_by(id=task_id_int, job_id=job_id).first() if task_id_int else None
    if not task:
        task = Task.query.filter_by(ai_task_id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    simulation = Simulation.query.filter_by(id=simulation_id, task_id=task.id).first()
    if not simulation:
        return jsonify({"error": "Simulation not found"}), 404

    if simulation.status == "completed":
        return jsonify({"error": "Already submitted"}), 400

    data = request.get_json(silent=True) or {}
    questions    = data.get("questions", [])
    user_answers = data.get("user_answers", {})

    if task.type == "clean_data":
        result = evaluation_service.evaluateDataReport(task.content, user_answers)
    elif task.type == "data_analyst":
        result = evaluation_service.evaluateAnalysisReport(task.content, user_answers)
    elif task.type in ("review_comments", "review_document", "ux_problem", "stakeholder_notes"):
        result = evaluation_service.evaluatePMResponse(task.content, user_answers)
    elif task.type == "write_function":
        result = evaluation_service.evaluateWriteFunction(task.content, user_answers)
    elif task.type == "debug_code":
        result = evaluation_service.evaluateDebugCode(task.content, user_answers)
    elif task.type == "code_review":
        result = evaluation_service.evaluateCodeReview(task.content, user_answers)
    else:
        result = evaluateResponse(questions, user_answers)

    submission = Submission(
        simulation_id=simulation_id,
        task_id=task.id,
        answer_type="open" if task.type in ("clean_data", "build_model") else "mcq",
        analysis=str(user_answers),
    )
    simulation.status = "completed"
    simulation.completed_at = datetime.utcnow()
    db.session.add(submission)
    db.session.flush()

    score = result.get("score", 0)
    performance_label = "أداء عالي" if score >= 85 else "أداء جيد" if score >= 60 else "يحتاج تحسين"

    review = Review(
        submission_id=submission.id,
        score=score,
        fit_percent=score,
        fit_summary=performance_label + " — " + result.get("feedback", ""),
        strengths=[],
        improvements=[],
        detailed_feedback=[result.get("feedback", "")],
        skills_json=[],
        answer_review_json=result.get("answer_review", []),
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "id":            submission.id,
        "simulation_id": submission.simulation_id,
        "submitted_at":  submission.submitted_at.isoformat(),
    }), 201
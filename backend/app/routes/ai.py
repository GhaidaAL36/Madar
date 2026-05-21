from flask import Blueprint, jsonify, request
from ai.ai_engine import getJobs, getJob, getTask, evaluateResponse
from ..models import Task
from ..extensions import db

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/jobs", methods=["GET"])
def get_ai_jobs():
    return jsonify(getJobs()), 200

@ai_bp.route("/jobs/<job_id>", methods=["GET"])
def get_ai_job(job_id):
    job = getJob(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job), 200


@ai_bp.route("/task", methods=["POST"])
def generate_task():
    data = request.get_json(silent=True) or {}
    job_id = data.get("job_id")
    task_id = data.get("task_id")
    print(f">>> job_id={job_id} task_id={task_id}")

    if not job_id or not task_id:
        return jsonify({"error": "job_id and task_id are required"}), 400

    try:
        print(">>> calling getTask...")
        result = getTask(job_id, task_id)
        print(f">>> getTask result keys: {result.keys()}")
        task = Task(
            job_id=job_id,
            ai_task_id=task_id,
            type=task_id,
            title=result.get("task_title", ""),
            full_title=result.get("task_title", ""),
            duration=result.get("estimated_time", "20-25 دقيقة"),
            time_range=result.get("estimated_time", "20-25 دقيقة"),
            description=result.get("instructions") or result.get("context", ""),
            will_learn=[],
            will_do=[],
            expectations=[],
            evaluation_criteria=[],
            content=result,
        )
        print(">>> task created, saving...")
        db.session.add(task)
        db.session.commit()
        print(">>> saved!")

        return jsonify({
            "id":          task.id,
            "title":       task.title,
            "description": task.description,
            "content":     task.content,
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@ai_bp.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.get_json(silent=True) or {}
    questions = data.get("questions")
    user_answers = data.get("user_answers")

    if not questions or user_answers is None:
        return jsonify({"error": "questions and user_answers are required"}), 400

    try:
        result = evaluateResponse(questions, user_answers)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
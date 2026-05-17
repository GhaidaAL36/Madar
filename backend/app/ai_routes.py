from flask import Blueprint, jsonify, request
from ai.ai_engine import getJobs, getJob, getTask, evaluateResponse

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/jobs', methods=['GET'])
def get_jobs():
    return jsonify(getJobs()), 200

@ai_bp.route('/api/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    job = getJob(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job), 200

@ai_bp.route('/api/ai/task', methods=['POST'])
def get_task():
    data = request.json
    job_id = data.get("job_id")
    task_id = data.get("task_id")
    result = getTask(job_id, task_id)
    return jsonify(result), 200

@ai_bp.route('/api/ai/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    questions = data.get("questions")
    user_answers = data.get("user_answers")
    result = evaluateResponse(questions, user_answers)
    return jsonify(result), 200
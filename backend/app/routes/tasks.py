from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models import Task

tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("/<int:task_id>/simulation", methods=["GET"])
@jwt_required()
def get_simulation(job_id, task_id):
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
        "content": task.content
    }), 200

@tasks_bp.route("/<int:task_id>/pm", methods=["GET"])
@jwt_required()
def get_pm(job_id, task_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({
        "id": task.id,
        "job_id": task.job_id,
        "title": task.title,
        "evaluation_criteria": task.evaluation_criteria,
        "expectations": task.expectations
    }), 200
from flask import Blueprint, jsonify
from ..models import Task

tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("/jobs/<job_id>/tasks", methods=["GET"])
def get_tasks(job_id):
    tasks = Task.query.filter_by(job_id=job_id).all()
    if not tasks:
        return jsonify({"error": "No tasks found"}), 404
    return jsonify([{
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
    } for task in tasks]), 200

@tasks_bp.route("/jobs/<job_id>/tasks/<int:task_id>", methods=["GET"])
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
    
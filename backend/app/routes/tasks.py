from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..models import Task
from ..extensions import db

tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("/<job_id>/tasks", methods=["GET"])
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
        "will_learn": task.will_learn or [],
        "will_do": task.will_do or [],
        "expectations": task.expectations or [],
        "evaluation_criteria": task.evaluation_criteria or [],
        "content": task.content
    } for task in tasks]), 200

@tasks_bp.route("/<job_id>/tasks/<int:task_id>", methods=["GET"])
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

@tasks_bp.route("/<job_id>/tasks/<int:task_id>/data", methods=["GET"])
def get_data_task(job_id, task_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    content = task.content or {}

    return jsonify({
        "instructions": content.get("instructions") or content.get("context", ""),
        "chartType":    content.get("chartType", "bar"),       
        "columns":      content.get("columns", []),
        "rows":         content.get("rows", []),
        "chartData":    content.get("chartData", []),          
        "stats":        content.get("stats", []),
        "keyFindings":  content.get("keyFindings", []),        
        "hints":        task.will_learn or [],
        "questions": [],          
    }), 200

@tasks_bp.route("/<job_id>/tasks/<int:task_id>/code", methods=["GET"])
def get_code_task(job_id, task_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first_or_404()
    content = task.content or {}

    return jsonify({
        "taskType":           task.type,
        "language":           content.get("language", "python"),
        "instructions":       content.get("instructions", task.description),
        "starterCode":        content.get("starter_code", ""),
        "expectedOutput":     content.get("expected_output", ""),
        "hints":              content.get("hints", []),
        "evaluationCriteria": content.get("evaluation_criteria", ""),
    }), 200

@tasks_bp.route("/<job_id>/tasks/<int:task_id>/pm", methods=["GET"])
def get_pm_task(job_id, task_id):
    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    content = task.content or {}
    

    return jsonify({
        "taskType":     task.type,
        "instructions": content.get("instructions", ""),
        "hints":        content.get("hints", []),
        "comments":     content.get("comments", []),
        "documentTitle": content.get("task_title", ""),
        "sections":     content.get("sections", []),
        "uxDescription": content.get("ux_description", ""),
        "uxUserJourney": content.get("ux_user_journey", []),
        "questions":    content.get("questions", []),
        "context":      content.get("context", ""),
    }), 200
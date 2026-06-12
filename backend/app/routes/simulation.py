from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from datetime import datetime
from ..models import Job, Task, Simulation
from ..extensions import db

simulation_bp = Blueprint("simulation", __name__)


@simulation_bp.route("/<job_id>/tasks/<int:task_id>/simulations", methods=["POST"])
def create_simulation(job_id, task_id):
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        pass

    task = Task.query.filter_by(id=task_id, job_id=job_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    simulation = Simulation(
        task_id=task_id,
        user_id=user_id, 
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


@simulation_bp.route("/<job_id>/tasks/<int:task_id>/simulations/<simulation_id>", methods=["GET"])
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
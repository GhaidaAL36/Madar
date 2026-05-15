from flask import Blueprint, jsonify
from ..models import Job, Task

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
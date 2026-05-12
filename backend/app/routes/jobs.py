from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models import Job

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/", methods=["GET"])
@jwt_required()
def get_jobs():
    jobs = Job.query.all()
    return jsonify([{
        "id": job.id,
        "title": job.title,
        "description": job.description
    } for job in jobs]), 200

@jobs_bp.route("/<int:job_id>", methods=["GET"])
@jwt_required()
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify({
        "id": job.id,
        "title": job.title,
        "description": job.description
    }), 200
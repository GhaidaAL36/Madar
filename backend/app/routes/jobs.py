from flask import Blueprint, jsonify
from ..models import Job

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
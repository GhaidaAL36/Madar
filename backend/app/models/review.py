import uuid
from datetime import datetime
from ..extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = db.Column(
        db.String(36), db.ForeignKey("submissions.id"), unique=True, nullable=False
    )
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    fit_percent = db.Column(db.Integer, nullable=False)
    fit_summary = db.Column(db.Text, nullable=False)
    strengths = db.Column(db.JSON, nullable=False)
    improvements = db.Column(db.JSON, nullable=False)
    detailed_feedback = db.Column(db.JSON, nullable=False)
    skills_json = db.Column(db.JSON, nullable=False)
    answer_review_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

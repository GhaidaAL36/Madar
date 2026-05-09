import uuid
from datetime import datetime
from ..extensions import db


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    simulation_id = db.Column(
        db.String(36), db.ForeignKey("simulations.id"), unique=True, nullable=False
    )
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"), nullable=False)
    answer_type = db.Column(db.String(20), nullable=False)
    code = db.Column(db.Text, nullable=True)
    analysis = db.Column(db.Text, nullable=True)
    checked_findings = db.Column(db.JSON, default=list)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    review = db.relationship("Review", backref="submission", uselist=False, lazy=True)

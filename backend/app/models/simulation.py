import uuid
from datetime import datetime
from ..extensions import db


class Simulation(db.Model):
    __tablename__ = "simulations"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"), nullable=False)
    status = db.Column(
        db.String(20), default="in_progress"
    )
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    submission = db.relationship(
        "Submission", backref="simulation", uselist=False, lazy=True
    )

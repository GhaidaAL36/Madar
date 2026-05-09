from datetime import datetime
from ..extensions import db


class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.String(100), primary_key=True)
    icon = db.Column(db.String(10), nullable=False)
    title_ar = db.Column(db.String(200), nullable=False)
    title_en = db.Column(db.String(200), nullable=False)
    description_primary = db.Column(db.Text, nullable=False)
    description_secondary = db.Column(db.Text, nullable=False)
    skills = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    tasks = db.relationship("Task", backref="job", lazy=True)

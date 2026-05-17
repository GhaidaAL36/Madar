from datetime import datetime
from ..extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ai_task_id = db.Column(db.String(100), nullable=True)
    job_id = db.Column(db.String(100), db.ForeignKey("jobs.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    full_title = db.Column(db.String(300), nullable=False)
    duration = db.Column(db.String(20), nullable=False)
    time_range = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    will_learn = db.Column(db.JSON, nullable=False)
    will_do = db.Column(db.JSON, nullable=False)
    expectations = db.Column(db.JSON, nullable=False)
    evaluation_criteria = db.Column(db.JSON, nullable=False)
    content = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    simulations = db.relationship("Simulation", backref="task", lazy=True)
    submissions = db.relationship("Submission", backref="task", lazy=True)

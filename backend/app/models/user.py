import uuid
from datetime import datetime
from ..extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user")       # "user" or "admin"
    status = db.Column(db.String(20), default="active")   # "active" or "blocked"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = db.relationship("Profile", backref="user", uselist=False, lazy=True)
    submissions = db.relationship("Submission", backref="user", lazy=True)
    reviews = db.relationship("Review", backref="user", lazy=True)
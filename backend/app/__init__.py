import os
from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt, bcrypt
from .config import config
from .models import User, Profile, Job, Task, Simulation, Submission, Review

def create_app():
    app = Flask(__name__)

    env = os.getenv("APP_ENV", "development")
    app.config.from_object(config[env])

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app

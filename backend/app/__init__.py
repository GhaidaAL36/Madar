from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt, bcrypt
from .config import config
import os


def create_app():
    app = Flask(__name__)

    env = os.getenv("APP_ENV", "development")
    app.config.from_object(config[env])

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(
        app,
        resources={
            r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}
        },
    )
    from .models import User, Profile, Job, Task, Simulation, Submission, Review

    with app.app_context():
        db.create_all()

    # routes
        from .routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix="/api/auth")

        from .routes.profile import profile_bp
        app.register_blueprint(profile_bp, url_prefix="/api/profile")

        from .routes.jobs import jobs_bp  # ← missing!
        app.register_blueprint(jobs_bp, url_prefix="/api/jobs")

        from .routes.tasks import tasks_bp
        app.register_blueprint(tasks_bp, url_prefix="/api/jobs")

        from .routes.admin import admin_bp
        app.register_blueprint(admin_bp, url_prefix="/api/admin")

        @app.route("/")
        def health():
            return {"status": "ok"}

        return app
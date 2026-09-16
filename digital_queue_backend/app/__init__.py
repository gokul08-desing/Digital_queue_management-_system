import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env before importing Config so class-level attributes receive environment values
basedir = Path(__file__).resolve().parent.parent
load_dotenv(basedir / ".env")

from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt

def create_app():
    load_dotenv(basedir / ".env")
    app = Flask(__name__)
    app.config.from_object(Config)
    if os.getenv("DATABASE_URL"):
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_URL"]}})

    from .routes.auth import auth_bp
    from .routes.locations import locations_bp
    from .routes.queues import queues_bp
    from .routes.tokens import tokens_bp
    from .routes.swaps import swaps_bp
    from .routes.notifications import notifications_bp
    from .routes.recommendation import recommendation_bp
    from .routes.demo import demo_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(locations_bp, url_prefix="/api/locations")
    app.register_blueprint(queues_bp, url_prefix="/api")
    app.register_blueprint(tokens_bp, url_prefix="/api")
    app.register_blueprint(swaps_bp, url_prefix="/api")
    app.register_blueprint(notifications_bp, url_prefix="/api")
    app.register_blueprint(recommendation_bp, url_prefix="/api")
    app.register_blueprint(demo_bp, url_prefix="/api/demo")

    @app.get("/api/health")
    def health():
        return {"success": True, "message": "Digital Queue API is running"}

    with app.app_context():
        db.create_all()

    return app

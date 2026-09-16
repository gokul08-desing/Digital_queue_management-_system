import os
from pathlib import Path
from dotenv import load_dotenv

# Ensure environment variables are loaded before Config class attributes are evaluated
basedir = Path(__file__).resolve().parent.parent
load_dotenv(basedir / ".env")

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///digital_queue.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")
    # Support comma-separated list of allowed frontend origins
    _frontend_raw = os.getenv("FRONTEND_URL", "http://localhost:5173")
    FRONTEND_URL = [u.strip() for u in _frontend_raw.split(",") if u.strip()]
    BASELINE_SERVICE_MINUTES = float(os.getenv("BASELINE_SERVICE_MINUTES", "5"))
    APPROACHING_THRESHOLD = int(os.getenv("APPROACHING_THRESHOLD", "2"))
    CALLED_CONFIRMATION_MINUTES = int(os.getenv("CALLED_CONFIRMATION_MINUTES", "2"))
    DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
    DEMO_KEY = os.getenv("DEMO_KEY", "change-demo-key")

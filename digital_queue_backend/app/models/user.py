from datetime import datetime, timezone
from ..extensions import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

from datetime import datetime, timezone
from ..extensions import db

class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey("users.id"), nullable=False, index=True)
    message = db.Column(db.String(500), nullable=False)
    type = db.Column(db.String(50), nullable=False, default="QUEUE")
    read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

from datetime import datetime, timezone
from ..extensions import db

class Counter(db.Model):
    __tablename__ = "counters"
    id = db.Column(db.String(64), primary_key=True)
    service_id = db.Column(db.String(64), db.ForeignKey("services.id"), nullable=False, index=True)
    name = db.Column(db.String(160), nullable=False)
    current_token_number = db.Column(db.Integer, default=0, nullable=False)
    average_service_minutes = db.Column(db.Float, default=5.0, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    service = db.relationship("Service", back_populates="counters")

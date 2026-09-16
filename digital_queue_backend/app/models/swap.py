from datetime import datetime, timezone
from ..extensions import db

class Swap(db.Model):
    __tablename__ = "swaps"
    id = db.Column(db.String(64), primary_key=True)
    offered_token_id = db.Column(db.String(64), db.ForeignKey("tokens.id"), nullable=False)
    requester_token_id = db.Column(db.String(64), db.ForeignKey("tokens.id"), nullable=True)
    status = db.Column(db.String(30), nullable=False, default="AVAILABLE")
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    requested_at = db.Column(db.DateTime(timezone=True), nullable=True)
    accepted_at = db.Column(db.DateTime(timezone=True), nullable=True)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=True)
    offered_token = db.relationship("Token", foreign_keys=[offered_token_id])
    requester_token = db.relationship("Token", foreign_keys=[requester_token_id])

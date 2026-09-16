from datetime import datetime, timezone
from ..extensions import db

TOKEN_STATUSES = {
    "WAITING", "APPROACHING", "CALLED", "CONFIRMED",
    "IN_SERVICE", "COMPLETED", "NO_SHOW", "CANCELLED",
    "EXCHANGE_AVAILABLE"
}

class Token(db.Model):
    __tablename__ = "tokens"
    id = db.Column(db.String(64), primary_key=True)
    queue_id = db.Column(db.String(64), db.ForeignKey("queues.id"), nullable=False, index=True)
    user_id = db.Column(db.String(64), db.ForeignKey("users.id"), nullable=True, index=True)
    counter_id = db.Column(db.String(64), db.ForeignKey("counters.id"), nullable=False, index=True)
    token_number = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(30), nullable=False, default="WAITING", index=True)
    issued_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    called_at = db.Column(db.DateTime(timezone=True), nullable=True)
    confirmed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    completed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    exchange_released_at = db.Column(db.DateTime(timezone=True), nullable=True)

    queue = db.relationship("Queue", back_populates="tokens")
    user = db.relationship("User")
    counter = db.relationship("Counter")

    __table_args__ = (
        db.UniqueConstraint("queue_id", "token_number", name="uq_queue_token_number"),
    )

from ..extensions import db

class ServiceLog(db.Model):
    __tablename__ = "service_logs"
    id = db.Column(db.String(64), primary_key=True)
    queue_id = db.Column(db.String(64), db.ForeignKey("queues.id"), nullable=False, index=True)
    counter_id = db.Column(db.String(64), db.ForeignKey("counters.id"), nullable=False, index=True)
    token_number = db.Column(db.Integer, nullable=False)
    started_at = db.Column(db.DateTime(timezone=True), nullable=False)
    completed_at = db.Column(db.DateTime(timezone=True), nullable=False)
    duration_minutes = db.Column(db.Float, nullable=False)

from ..extensions import db

class Queue(db.Model):
    __tablename__ = "queues"
    id = db.Column(db.String(64), primary_key=True)
    service_id = db.Column(db.String(64), db.ForeignKey("services.id"), nullable=False, index=True)
    name = db.Column(db.String(180), nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    next_token_number = db.Column(db.Integer, default=1, nullable=False)
    service = db.relationship("Service", back_populates="queues")
    tokens = db.relationship("Token", back_populates="queue", cascade="all, delete-orphan")

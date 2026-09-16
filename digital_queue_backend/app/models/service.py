from ..extensions import db

class Service(db.Model):
    __tablename__ = "services"
    id = db.Column(db.String(64), primary_key=True)
    location_id = db.Column(db.String(64), db.ForeignKey("locations.id"), nullable=False, index=True)
    name = db.Column(db.String(160), nullable=False)
    description = db.Column(db.String(500))
    active = db.Column(db.Boolean, default=True, nullable=False)
    location = db.relationship("Location", back_populates="services")
    counters = db.relationship("Counter", back_populates="service", cascade="all, delete-orphan")
    queues = db.relationship("Queue", back_populates="service", cascade="all, delete-orphan")

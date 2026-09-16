from ..extensions import db

class Location(db.Model):
    __tablename__ = "locations"
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(180), nullable=False, index=True)
    type = db.Column(db.String(40), nullable=False, default="SERVICE_LOCATION")
    address = db.Column(db.String(300), nullable=False)
    pincode = db.Column(db.String(10), nullable=False, index=True)
    services = db.relationship("Service", back_populates="location", cascade="all, delete-orphan")

from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.notification import Notification

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.get("/notifications")
@jwt_required()
def notifications():
    user_id = get_jwt_identity()
    rows = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(100).all()
    return {"success": True, "notifications": [
        {"id": n.id, "message": n.message, "type": n.type, "read": n.read, "createdAt": n.created_at.isoformat()}
        for n in rows
    ]}

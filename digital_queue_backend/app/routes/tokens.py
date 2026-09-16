from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.user import User
from ..models.service import Service
from ..models.counter import Counter
from ..models.token import Token
from ..services.queue_engine import join_queue, serialize_queue
from ..services.notification_service import notify

tokens_bp = Blueprint("tokens", __name__)

@tokens_bp.post("/services/<service_id>/join")
@jwt_required()
def join(service_id):
    user = User.query.get(get_jwt_identity())
    service = Service.query.get(service_id)
    data = request.get_json(silent=True) or {}
    counter = Counter.query.get(data.get("counterId"))
    if not user or not service:
        return {"success": False, "message": "User or service not found."}, 404
    if not counter:
        return {"success": False, "message": "Counter not found."}, 404
    try:
        token = join_queue(user, service, counter)
        db.session.commit()
        serialized = serialize_queue(token)
        return {"success": True, "token": serialized, "queue": serialized}, 201
    except ValueError as e:
        db.session.rollback()
        return {"success": False, "message": str(e)}, 409
    except Exception:
        db.session.rollback()
        return {"success": False, "message": "Could not join queue."}, 500

@tokens_bp.get("/tokens/active")
@jwt_required()
def active_token():
    user = User.query.get(get_jwt_identity())
    if not user:
        return {"success": False, "message": "User not found."}, 404
    token = Token.query.filter_by(user_id=user.id).filter(
        Token.status.in_({"WAITING", "APPROACHING", "CALLED", "CONFIRMED", "IN_SERVICE", "EXCHANGE_AVAILABLE"})
    ).order_by(Token.issued_at.desc()).first()
    if not token:
        return {"success": True, "token": None}
    db.session.commit()
    return {"success": True, "token": serialize_queue(token), "queue": serialize_queue(token)}

@tokens_bp.get("/queues/<queue_id>/status")
@jwt_required()
def status(queue_id):
    user = User.query.get(get_jwt_identity())
    token = Token.query.filter_by(queue_id=queue_id, user_id=user.id).filter(
        Token.status.in_({"WAITING", "APPROACHING", "CALLED", "CONFIRMED", "IN_SERVICE", "EXCHANGE_AVAILABLE"})
    ).order_by(Token.issued_at.desc()).first()
    if not token:
        return {"success": False, "message": "No active token found for this queue."}, 404
    db.session.commit()
    return {"success": True, "queue": serialize_queue(token)}

@tokens_bp.post("/tokens/<token_id>/confirm")
@jwt_required()
def confirm(token_id):
    user = User.query.get(get_jwt_identity())
    token = Token.query.get(token_id)
    if not token or token.user_id != user.id:
        return {"success": False, "message": "Token not found."}, 404
    if token.status != "CALLED":
        return {"success": False, "message": "Only CALLED tokens can be confirmed."}, 409
    from ..utils.time_utils import utcnow
    token.status = "CONFIRMED"
    token.confirmed_at = utcnow()
    db.session.commit()
    return {"success": True, "status": token.status}

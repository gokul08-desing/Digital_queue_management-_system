from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.user import User
from ..models.swap import Swap
from ..models.token import Token
from ..services.swap_engine import release_token, request_swap, accept_swap
from ..services.notification_service import notify

swaps_bp = Blueprint("swaps", __name__)

@swaps_bp.post("/tokens/<token_id>/release")
@jwt_required()
def release(token_id):
    user = User.query.get(get_jwt_identity())
    token = Token.query.get(token_id)
    if not token:
        return {"success": False, "message": "Token not found."}, 404
    try:
        swap = release_token(user, token)
        db.session.commit()
        return {"success": True, "swap": {"swapId": swap.id, "status": swap.status, "expiresAt": swap.expires_at.isoformat()}}
    except ValueError as e:
        db.session.rollback()
        return {"success": False, "message": str(e)}, 409

@swaps_bp.get("/swaps/available")
@jwt_required()
def available():
    from datetime import timezone
    from ..utils.time_utils import utcnow
    now = utcnow()
    swaps = Swap.query.filter_by(status="AVAILABLE").all()
    valid_swaps = []
    for s in swaps:
        if not s.expires_at:
            valid_swaps.append(s)
        else:
            exp = s.expires_at
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)
            if exp > now:
                valid_swaps.append(s)
    swaps = valid_swaps
    result = []
    for s in swaps:
        t = s.offered_token
        result.append({
            "swapId": s.id,
            "service": t.queue.service.name,
            "counter": t.counter.name,
            "availableToken": t.token_number,
            "arrivalTime": t.issued_at.isoformat(),
        })
    return {"success": True, "swaps": result}

@swaps_bp.post("/swaps/<swap_id>/request")
@jwt_required()
def request_swap_route(swap_id):
    user = User.query.get(get_jwt_identity())
    swap = Swap.query.get(swap_id)
    if not swap:
        return {"success": False, "message": "Swap not found."}, 404
    try:
        request_swap(user, swap)
        db.session.commit()
        return {"success": True, "status": swap.status}
    except ValueError as e:
        db.session.rollback()
        return {"success": False, "message": str(e)}, 409

@swaps_bp.post("/swaps/<swap_id>/accept")
@jwt_required()
def accept_swap_route(swap_id):
    user = User.query.get(get_jwt_identity())
    swap = Swap.query.get(swap_id)
    if not swap:
        return {"success": False, "message": "Swap not found."}, 404
    try:
        offered, requester = accept_swap(user, swap)
        if requester.user_id:
            notify(requester.user_id, f"Your slot exchange was accepted.", "SWAP")
        db.session.commit()
        return {"success": True, "status": swap.status, "message": "Swap accepted and queue assignments recalculated."}
    except ValueError as e:
        db.session.rollback()
        return {"success": False, "message": str(e)}, 409

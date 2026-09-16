from datetime import timedelta
from flask import Blueprint, request, current_app
from ..extensions import db
from ..models.queue import Queue
from ..models.token import Token
from ..services.notification_service import notify
from ..utils.time_utils import utcnow

demo_bp = Blueprint("demo", __name__)

def demo_authorized():
    return current_app.config["DEMO_MODE"] and request.headers.get("X-Demo-Key") == current_app.config["DEMO_KEY"]

@demo_bp.post("/tick/<queue_id>")
def tick(queue_id):
    # Development/hackathon simulator only. Not a user-facing staff API.
    if not demo_authorized():
        return {"success": False, "message": "Demo mechanism disabled or unauthorized."}, 403

    queue = Queue.query.get(queue_id)
    if not queue:
        return {"success": False, "message": "Queue not found."}, 404

    now = utcnow()
    confirmation_limit = timedelta(minutes=current_app.config["CALLED_CONFIRMATION_MINUTES"])

    # Automatically expire an unconfirmed CALLED token.
    called = Token.query.filter_by(queue_id=queue_id, status="CALLED").order_by(Token.token_number).first()
    if called and called.called_at:
        called_time = called.called_at
        if called_time.tzinfo is None:
            called_time = called_time.replace(tzinfo=now.tzinfo)
        if now - called_time >= confirmation_limit:
            called.status = "NO_SHOW"
            if called.user_id:
                notify(called.user_id, f"Token #{called.token_number} was marked NO_SHOW after the confirmation window.", "QUEUE")

    # If no token is currently called, call the earliest eligible waiting token per counter.
    if not Token.query.filter_by(queue_id=queue_id, status="CALLED").first():
        counters = {c.id: c for c in queue.service.counters if c.active}
        for counter in counters.values():
            candidate = (Token.query
                         .filter(Token.queue_id == queue_id,
                                 Token.counter_id == counter.id,
                                 Token.status.in_({"WAITING", "APPROACHING"}),
                                 Token.token_number > counter.current_token_number)
                         .order_by(Token.token_number.asc())
                         .first())
            if candidate:
                candidate.status = "CALLED"
                candidate.called_at = now
                counter.current_token_number = candidate.token_number
                if candidate.user_id:
                    notify(candidate.user_id, f"Your token #{candidate.token_number} has been called.", "QUEUE")
                break

    db.session.commit()
    return {"success": True, "message": "Demo queue tick applied."}

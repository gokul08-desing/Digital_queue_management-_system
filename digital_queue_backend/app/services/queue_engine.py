import uuid
from sqlalchemy import func
from ..extensions import db
from ..models.token import Token, TOKEN_STATUSES
from ..models.queue import Queue
from ..models.counter import Counter
from .eta_engine import calculate_eta, calculate_arrival_window
from ..utils.time_utils import utcnow

ACTIVE_STATUSES = {"WAITING", "APPROACHING", "CALLED", "CONFIRMED", "IN_SERVICE", "EXCHANGE_AVAILABLE"}

def get_user_active_token(user_id, service_id):
    return (Token.query.join(Queue)
            .filter(Queue.service_id == service_id,
                    Token.user_id == user_id,
                    Token.status.in_(ACTIVE_STATUSES))
            .first())

def people_ahead(token):
    return Token.query.filter(
        Token.queue_id == token.queue_id,
        Token.counter_id == token.counter_id,
        Token.token_number < token.token_number,
        Token.status.in_(ACTIVE_STATUSES - {"EXCHANGE_AVAILABLE"})
    ).count()

def sync_approaching(token):
    if token.status == "WAITING" and people_ahead(token) <= 2:
        token.status = "APPROACHING"

def serialize_queue(token):
    sync_approaching(token)
    eta = calculate_eta(token, token.counter)
    start, end = calculate_arrival_window(eta)
    service = token.queue.service if token.queue else None
    location = service.location if service else None
    return {
        "queueId": token.queue_id,
        "tokenId": token.id,
        "tokenNumber": token.token_number,
        "serviceId": service.id if service else None,
        "serviceName": service.name if service else "General Service",
        "hospitalId": location.id if location else None,
        "hospitalName": location.name if location else "Healthcare Facility",
        "counterId": token.counter_id,
        "counterName": token.counter.name if token.counter else "Counter Desk",
        "currentToken": token.counter.current_token_number if token.counter else 1,
        "peopleAhead": people_ahead(token),
        "estimatedWaitMinutes": eta,
        "recommendedArrivalStart": start.isoformat(),
        "recommendedArrivalEnd": end.isoformat(),
        "status": token.status,
        "lastUpdated": utcnow().isoformat(),
        "counter": {
            "id": token.counter.id,
            "name": token.counter.name,
            "currentToken": token.counter.current_token_number
        }
    }

def join_queue(user, service, counter):
    queue = service.queues[0] if service.queues else None
    if not queue or not queue.active:
        raise ValueError("No active queue is available for this service.")
    if counter.service_id != service.id or not counter.active:
        raise ValueError("Invalid or inactive counter.")
    existing = get_user_active_token(user.id, service.id)
    if existing:
        existing.status = "CANCELLED"

    # PostgreSQL row lock serializes token allocation.
    locked_queue = Queue.query.filter_by(id=queue.id).with_for_update().first()
    max_number = db.session.query(func.max(Token.token_number)).filter(
        Token.queue_id == locked_queue.id
    ).scalar() or 0
    next_number = max(locked_queue.next_token_number or 1, max_number + 1)
    locked_queue.next_token_number = next_number + 1

    token = Token(
        id="token_" + uuid.uuid4().hex[:20],
        queue_id=locked_queue.id,
        user_id=user.id,
        counter_id=counter.id,
        token_number=next_number,
        status="WAITING"
    )
    db.session.add(token)
    db.session.flush()
    sync_approaching(token)
    return token

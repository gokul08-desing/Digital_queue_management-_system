import uuid
from datetime import timedelta
from ..extensions import db
from ..models.swap import Swap
from ..models.token import Token
from ..utils.time_utils import utcnow

def release_token(user, token):
    if token.user_id != user.id:
        raise ValueError("You can only release your own token.")
    if token.status != "WAITING":
        raise ValueError("Only WAITING tokens can be released.")
    token.status = "EXCHANGE_AVAILABLE"
    token.exchange_released_at = utcnow()
    swap = Swap(
        id="swap_" + uuid.uuid4().hex[:20],
        offered_token_id=token.id,
        status="AVAILABLE",
        expires_at=utcnow() + timedelta(minutes=15)
    )
    db.session.add(swap)
    return swap

def request_swap(user, swap):
    from datetime import timezone
    exp = swap.expires_at
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if swap.status != "AVAILABLE" or (exp and exp < utcnow()):
        raise ValueError("This swap is no longer available.")
    offered = swap.offered_token
    requester_tokens = Token.query.filter_by(user_id=user.id, queue_id=offered.queue_id).filter(
        Token.status.in_({"WAITING", "APPROACHING", "CALLED", "CONFIRMED", "IN_SERVICE", "EXCHANGE_AVAILABLE"})
    ).all()
    if not requester_tokens:
        raise ValueError("You need an active token in the same queue to request this swap.")
    requester = next((t for t in requester_tokens if t.id != offered.id), None)
    if not requester:
        raise ValueError("You cannot request your own released slot.")
    if requester.status not in {"WAITING", "APPROACHING"}:
        raise ValueError("Your token is not eligible for exchange.")
    if offered.queue_id != requester.queue_id or offered.counter_id != requester.counter_id:
        raise ValueError("Swap must remain within the same queue and counter.")
    swap.requester_token_id = requester.id
    swap.status = "PENDING"
    swap.requested_at = utcnow()
    return swap

def accept_swap(user, swap):
    offered = swap.offered_token
    if offered.user_id != user.id:
        raise ValueError("Only the owner of the released slot can accept this swap.")
    if swap.status != "PENDING" or not swap.requester_token:
        raise ValueError("Swap is not pending.")
    requester = swap.requester_token
    if requester.status not in {"WAITING", "APPROACHING"}:
        raise ValueError("Requester token is no longer eligible.")

    # Exchange counter assignment and preserve token history; do not renumber tokens.
    offered.counter_id, requester.counter_id = requester.counter_id, offered.counter_id
    offered.status = "WAITING"
    requester.status = "WAITING"
    swap.status = "ACCEPTED"
    swap.accepted_at = utcnow()
    return offered, requester

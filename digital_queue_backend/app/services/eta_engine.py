from datetime import timedelta
from flask import current_app
from ..models.service_log import ServiceLog

def calculate_rolling_service_time(queue_id, counter_id, fallback):
    logs = (ServiceLog.query
            .filter_by(queue_id=queue_id, counter_id=counter_id)
            .order_by(ServiceLog.completed_at.desc())
            .limit(5).all())
    if logs:
        return round(sum(x.duration_minutes for x in logs) / len(logs), 2)
    return float(fallback)

def calculate_people_ahead(token):
    active = {"WAITING", "APPROACHING", "CALLED", "CONFIRMED", "IN_SERVICE"}
    return TokenAheadQuery(token, active).count()

class TokenAheadQuery:
    def __init__(self, token, statuses):
        self.token = token
        self.statuses = statuses
    def count(self):
        from ..models.token import Token
        return Token.query.filter(
            Token.queue_id == self.token.queue_id,
            Token.counter_id == self.token.counter_id,
            Token.token_number < self.token.token_number,
            Token.status.in_(self.statuses)
        ).count()

def calculate_eta(token, counter):
    fallback = current_app.config["BASELINE_SERVICE_MINUTES"]
    avg = calculate_rolling_service_time(token.queue_id, counter.id, fallback)
    people_ahead = calculate_people_ahead(token)
    # Never allow negative ETA.
    return max(0, round(people_ahead * avg))

def calculate_arrival_window(eta_minutes):
    from ..utils.time_utils import utcnow
    now = utcnow()
    start = now + timedelta(minutes=max(0, eta_minutes))
    end = start + timedelta(minutes=5)
    return start, end

from .eta_engine import calculate_rolling_service_time
from ..models.token import Token

def recommend_counter(service, baseline):
    candidates = []
    for counter in service.counters:
        if not counter.active:
            continue
        avg = calculate_rolling_service_time(
            next((q.id for q in service.queues), None),
            counter.id,
            counter.average_service_minutes or baseline
        ) if service.queues else (counter.average_service_minutes or baseline)
        waiting = Token.query.filter(
            Token.counter_id == counter.id,
            Token.status.in_({"WAITING", "APPROACHING", "CALLED", "CONFIRMED", "IN_SERVICE"})
        ).count()
        wait = round(waiting * avg, 2)
        candidates.append((wait, counter, avg, waiting))
    if not candidates:
        return None
    candidates.sort(key=lambda x: (x[0], x[1].id))
    wait, counter, avg, waiting = candidates[0]
    confidence = max(0.5, min(0.98, 1 - (wait / max(wait + 30, 1)) * 0.4))
    return {
        "counterId": counter.id,
        "reason": "Based on current queue length and recent service speed.",
        "estimatedWaitMinutes": int(round(wait)),
        "confidence": round(confidence, 2),
        "peopleWaiting": waiting,
        "averageServiceMinutes": avg,
    }

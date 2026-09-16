from flask import Blueprint
from ..models.service import Service
from ..models.counter import Counter
from ..models.token import Token
from ..services.eta_engine import calculate_rolling_service_time, calculate_eta
from flask import current_app

queues_bp = Blueprint("queues", __name__)

@queues_bp.get("/services/<service_id>/counters")
def counters(service_id):
    service = Service.query.get(service_id)
    if not service:
        return {"success": False, "message": "Service not found."}, 404
    result = []
    for c in service.counters:
        waiting = Token.query.filter(
            Token.counter_id == c.id,
            Token.status.in_({"WAITING", "APPROACHING", "CALLED", "CONFIRMED"})
        ).count()
        avg = calculate_rolling_service_time(
            service.queues[0].id if service.queues else "",
            c.id,
            c.average_service_minutes or current_app.config["BASELINE_SERVICE_MINUTES"]
        )
        result.append({
            "counterId": c.id, "name": c.name,
            "currentToken": c.current_token_number,
            "peopleWaiting": waiting,
            "averageServiceMinutes": avg,
            "estimatedWaitMinutes": round(waiting * avg),
            "available": c.active
        })
    return {"success": True, "counters": result}

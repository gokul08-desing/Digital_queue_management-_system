from flask import Blueprint, current_app
from ..models.service import Service
from ..services.counter_recommendation import recommend_counter

recommendation_bp = Blueprint("recommendation", __name__)

@recommendation_bp.get("/services/<service_id>/recommendation")
def recommendation(service_id):
    service = Service.query.get(service_id)
    if not service:
        return {"success": False, "message": "Service not found."}, 404
    rec = recommend_counter(service, current_app.config["BASELINE_SERVICE_MINUTES"])
    if not rec:
        return {"success": False, "message": "No available counter."}, 409
    return {"success": True, "recommendation": rec}

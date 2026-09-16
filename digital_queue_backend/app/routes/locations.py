from flask import Blueprint, request
from sqlalchemy import or_
from ..models.location import Location
from ..models.service import Service
from ..models.queue import Queue
from ..models.token import Token

locations_bp = Blueprint("locations", __name__)

@locations_bp.get("")
def locations():
    q = (request.args.get("q") or "").strip()
    pincode = (request.args.get("pincode") or "").strip()
    query = Location.query
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Location.name.ilike(like), Location.address.ilike(like), Location.pincode.ilike(like)))
    if pincode:
        query = query.filter(Location.pincode == pincode)
    rows = query.order_by(Location.name).all()
    return {"success": True, "locations": [
        {"id": x.id, "name": x.name, "type": x.type, "address": x.address, "pincode": x.pincode}
        for x in rows
    ]}

@locations_bp.get("/<location_id>")
def location_detail(location_id):
    location = Location.query.get(location_id)
    if not location:
        return {"success": False, "message": "Location not found."}, 404
    services = []
    for s in location.services:
        queue = s.queues[0] if s.queues else None
        services.append({
            "id": s.id, "name": s.name, "description": s.description,
            "active": s.active,
            "queue": {"id": queue.id, "active": queue.active} if queue else None
        })
    return {"success": True, "location": {
        "id": location.id, "name": location.name, "type": location.type,
        "address": location.address, "pincode": location.pincode,
        "services": services
    }}

@locations_bp.get("/<location_id>/services")
def services(location_id):
    location = Location.query.get(location_id)
    if not location:
        return {"success": False, "message": "Location not found."}, 404
    return {"success": True, "services": [
        {"id": s.id, "name": s.name, "description": s.description, "active": s.active}
        for s in location.services
    ]}

import uuid
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db
from ..models.user import User
from ..utils.validators import require_fields, valid_phone

auth_bp = Blueprint("auth", __name__)

def user_json(user):
    return {"id": user.id, "name": user.name, "phone": user.phone}

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    ok, error = require_fields(data, ["name", "phone", "password"])
    if not ok:
        return {"success": False, "message": error}, 400
    if not valid_phone(data["phone"]):
        return {"success": False, "message": "Invalid phone number."}, 400
    if len(data["password"]) < 6:
        return {"success": False, "message": "Password must be at least 6 characters."}, 400
    if User.query.filter_by(phone=data["phone"]).first():
        return {"success": False, "message": "Phone number already registered."}, 409

    user = User(id="user_" + uuid.uuid4().hex[:20], name=data["name"].strip(),
                phone=data["phone"], password_hash=generate_password_hash(data["password"]))
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return {"success": True, "message": "Registration successful", "token": token, "user": user_json(user)}, 201

@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    user = User.query.filter_by(phone=data.get("phone")).first()
    if not user or not check_password_hash(user.password_hash, data.get("password", "")):
        return {"success": False, "message": "Invalid phone or password."}, 401
    token = create_access_token(identity=user.id)
    return {"success": True, "message": "Login successful", "token": token, "user": user_json(user)}

@auth_bp.get("/me")
@jwt_required()
def me():
    user = User.query.get(get_jwt_identity())
    if not user:
        return {"success": False, "message": "User not found."}, 404
    return {"success": True, "user": user_json(user)}

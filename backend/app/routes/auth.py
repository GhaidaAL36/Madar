from flask import Blueprint, request, make_response
from flask_jwt_extended import create_access_token, jwt_required, unset_jwt_cookies
from app.extensions import db, bcrypt
from app.models.user import User
from app.models.profile import Profile
from app.schemas.auth import SignupSchema, LoginSchema
from app.utils.errors import bad_request, unauthorized
from app.utils.response import success_response
from marshmallow import ValidationError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    raw = request.get_json()
    try:
        data = SignupSchema().load(raw)
    except ValidationError as e:
        return bad_request(str(e.messages))

    if User.query.filter_by(email=data["email"]).first():
        return bad_request("البريد الإلكتروني مستخدم بالفعل")

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        password_hash=hashed_password
    )
    db.session.add(user)
    db.session.flush()

    initials = "".join([part[0] for part in data["name"].split() if part])[:2]
    profile = Profile(
        user_id=user.id,
        initials=initials
    )
    db.session.add(profile)
    db.session.commit()

    token = create_access_token(identity=user.id)

    return success_response({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "initials": initials
        }
    }, 201)


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = LoginSchema().load(request.get_json())
    except ValidationError as e:
        return bad_request(str(e.messages))

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة")

    token = create_access_token(identity=user.id)

    return success_response({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "initials": user.profile.initials if user.profile else ""
        }
    })


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = make_response(success_response({"message": "تم تسجيل الخروج"}))
    unset_jwt_cookies(response)
    return success_response({"message": "تم تسجيل الخروج بنجاح"})
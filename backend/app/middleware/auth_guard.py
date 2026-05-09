from functools import wraps
from flask import request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.utils.errors import unauthorized

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return unauthorized("يجب تسجيل الدخول أولاً")
        return f(*args, **kwargs)
    return decorated
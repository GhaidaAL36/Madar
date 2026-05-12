from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt

def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        if not claims.get("is_admin", False):
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function
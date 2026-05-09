from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User
from app.utils.errors import unauthorized, forbidden

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return unauthorized("يجب تسجيل الدخول أولاً")

        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != "admin":
            return forbidden("هذه الصفحة للمدراء فقط")

        return f(*args, **kwargs)
    return decorated
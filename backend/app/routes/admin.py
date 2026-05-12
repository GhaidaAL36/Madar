from flask import Blueprint
from app.utils.admin_guard import require_admin
from app.utils.response import success_response

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@require_admin
def get_all_users():
    return success_response({"users": []})
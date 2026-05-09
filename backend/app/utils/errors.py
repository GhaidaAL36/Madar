from .response import error_response

def bad_request(message="طلب غير صالح"):
    return error_response("BAD_REQUEST", message, 400)

def unauthorized(message="غير مصرح"):
    return error_response("UNAUTHORIZED", message, 401)

def forbidden(message="ممنوع"):
    return error_response("FORBIDDEN", message, 403)

def not_found(message="غير موجود"):
    return error_response("NOT_FOUND", message, 404)

def server_error(message="خطأ في الخادم"):
    return error_response("SERVER_ERROR", message, 500)
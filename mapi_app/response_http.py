def Ok(message):
    response = {}
    response["status"] = 200
    response["message"] = message
    response["status_code"] = "OK"
    return response

def Bad_request(message):
    response = {}
    response["status"] = 400
    response["message"] = message
    response["status_code"] = "BAD_REQUEST"
    return response

def Forbidden(message):
    response = {}
    response["status"] = 403
    response["message"] = message
    response["status_code"] = "FORBIDDEN"
    return response

def Not_found(message):
    response = {}
    response["status"] = 404
    response["message"] = message
    response["status_code"] = "NOT_FOUND"
    return response

def Internal_server_error(message):
    response = {}
    response["status"] = 500
    response["message"] = message
    response["status_code"] = "INTERNAL_SERVER_ERROR"
    return response
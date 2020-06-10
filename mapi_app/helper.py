from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder

def Json(data):
    return JsonResponse(
        data, 
        DjangoJSONEncoder, 
        safe=False,
        json_dumps_params={"ensure_ascii": False}
    )
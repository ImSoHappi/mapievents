from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.template.context_processors import request
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, JsonResponse
import json

from .models import Event, Entertainment_areas, Workshop

@require_GET
def home(request):
    response = {}
    response["message"] = "Test api rest"
    response["status"] = "200"
    response["status_code"] = "OK"
    response["data"] = list(User.objects.all().values())
    return JsonResponse(response, safe = False)

@require_GET
def map_all_events_list(request):
    event_list = []
    events = Event.objects.filter(event_available = 1).values("id", "event_name", "event_coordinates_altitude",
    "event_coordinates_latitude")
    areas = Entertainment_areas.objects.filter(area_available = 1).values("id", "area_name",
    "area_coordinates_altitude", "area_coordinates_latitude")
    try:
        for event in events:
            event_list.append({
                "id": event.id,
                "name": event.event_name,
                "altitude": event.event_coordinates_altitude,
                "latitude": event.event_coordinates_latitude,
                "table": "event"
            })
    except:
        pass
    try: 
        for area in areas:
            event_list.append({
                "id": event.id,
                "name": event.event_name,
                "altitude": event.event_coordinates_altitude,
                "latitude": event.event_coordinates_latitude,
                "table": "area"
            })
    except:
        pass
    if len(event_list):
        response = {}
        response["status"] = 404
        response["message"] = "No data found"
        response["status_code"] = "NOT_FOUND"
        return JsonResponse(response, safe = False)
    return JsonResponse(event_list, safe = False)

@require_POST
def event_details(request):
    id_event = int(request.POST.get("idEvent"))
    table = request.POST.get("table")
    if(table == "event"):
        event = Event.objects.get(pk = id_event).values("id", "event_name", "event_address",
        "image_route", "event_coordinates_altitude", "event_coordinates_latitude", "event_description",
        "event_start_date", "event_start_time", "event_type", "event_commune", "one_stars",
        "two_stars", "thress_stars", "three_stars", "four_stars", "five_stars")
        return JsonResponse(event, safe = False)
    elif table == "area":
        area = Entertainment_areas.objects.get(pk = id_event).values("id", "area_name", "area_address", "image_route", "area_coordinates_altitude",
        "area_coordinates_latitude", "area_description", "area_days", "area_commune")
        pass
    elif table == "workshop":
        workshop = Workshop.objects.get(pk = id_event).values("id", "workshop_name", "workshop_address",
        "image_route", "workshop_coordinates_altitude", "workshop_coordinates_latitude", "workshop_description",
        "workshop_start_date", "workshop_start_time", "workshop_type", "workshop_commune")
        return HttpResponse(json.dumps(event), content_type = "application/json")
        pass
    pass
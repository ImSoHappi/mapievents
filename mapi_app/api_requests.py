from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.template.context_processors import request
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.views.decorators.http import require_GET, require_POST
from django.http import HttpResponse, JsonResponse
import json

from .models import Event, Entertainment_areas, Workshop, Commune, Event_type

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
    #Devuelve vacio
    event_list = []
    events = Event.objects.filter(event_available = 1).values("id", "event_name", "event_coordinates_longitude",
    "event_coordinates_latitude")
    areas = Entertainment_areas.objects.filter(area_available = 1).values("id", "area_name",
    "area_coordinates_longitude", "area_coordinates_latitude")
    workshops = Workshop.objects.filter(workshop_available = 1).values("id", "workshop_name",
    "workshop_coordinates_longitude", "workshop_coordinates_latitude")
    try:
        for event in events:
            tempEvent = {}
            tempEvent["id"] = event.get("id")
            tempEvent["name"] = event.get("event_name")
            tempEvent["longitude"] = event.get("event_coordinates_longitude")
            tempEvent["latitude"] = event.get("event_coordinates_latitude")
            tempEvent["table"] = "event"
            event_list.append(tempEvent)
    except:
        response = {}
        response["status"] = 500
        response["message"] = "Error in event list"
        response["status_code"] = "INTERNAL_SERVER_ERROR"
        return JsonResponse(response, safe = False)
    try: 
        for area in areas:
            tempArea = {}
            tempArea["id"] = area.get("id")
            tempArea["name"] = area.get("area_name")
            tempArea["longitude"] = area.get("area_coordinates_longitude")
            tempArea["latitude"] = area.get("area_coordinates_latitude")
            tempArea["table"] = "area"
            event_list.append(tempArea)
    except:
        response = {}
        response["status"] = 500
        response["message"] = "Error in area list"
        response["status_code"] = "INTERNAL_SERVER_ERROR"
        return JsonResponse(response, safe = False)
    try:
        for workshop in workshops:
            tempWorkshop = {}
            tempWorkshop["id"] = workshop.get("id")
            tempWorkshop["name"] = workshop.get("workshop_name")
            tempWorkshop["longitude"] = workshop.get("workshop_coordinates_longitude")
            tempWorkshop["latitude"] = workshop.get("workshop_coordinates_latitude")
            tempWorkshop["table"] = "workshop"
            event_list.append(tempWorkshop)
    except:
        response = {}
        response["status"] = 500
        response["message"] = "Error in workshop list"
        response["status_code"] = "INTERNAL_SERVER_ERROR"
        return JsonResponse(response, safe = False)
    if len(event_list) <= 0:
        response = {}
        response["status"] = 404
        response["message"] = "Not data found"
        response["status_code"] = "NOT_FOUND"
        return JsonResponse(response, safe = False)
    return JsonResponse(event_list, safe = False)

@require_GET
def event_details(request, type, id):
    response = {}
    if(type == "event"):
        event = Event.objects.filter(pk = id).values("event_name", "event_address", "image_route", "event_coordinates_longitude",
        "event_coordinates_latitude", "event_quotas", "event_description", "event_start_date", "event_ended_date", "event_start_time",
        "event_ended_time", "event_available", "event_type", "event_commune", "one_stars", "two_stars", "three_stars", "four_stars",
        "five_stars")
        response["name"] = list(event.values_list("event_name", flat= True))[0]
        response["address"] = list(event.values_list("event_address", flat=True))[0]
        response["image"] = list(event.values_list("image_route", flat=True))[0]
        response["longitude"] = list(event.values_list("event_coordinates_longitude", flat=True))[0]
        response["latitude"] = list(event.values_list("event_coordinates_latitude", flat=True))[0]
        response["quotas"] = list(event.values_list("event_quotas", flat=True))[0]
        response["description"] = list(event.values_list("event_description", flat=True))[0]
        response["start_date"] = list(event.values_list("event_start_date", flat=True))[0]
        response["ended_date"] = list(event.values_list("event_ended_date", flat=True))[0]
        response["start_time"] = list(event.values_list("event_start_time", flat=True))[0]
        response["ended_time"] = list(event.values_list("event_ended_time", flat=True))[0]
        response["available"] = list(event.values_list("event_available", flat=True))[0]
        response["event_type"] = list(Event_type.objects.filter(id = list(event.values_list("event_type", flat=True))[0]).values_list("event_type_name" ,flat=True))[0]
        response["commune"] = list(Commune.objects.filter(id = list(event.values_list("event_commune", flat=True))[0]).values_list("commune_name" ,flat=True))[0]
        response["one_star"] = list(event.values_list("one_stars", flat=True))[0]
        response["two_star"] = list(event.values_list("two_stars", flat=True))[0]
        response["three_star"] = list(event.values_list("three_stars", flat=True))[0]
        response["four_start"] = list(event.values_list("four_stars", flat=True))[0]
        response["five_start"] = list(event.values_list("five_stars", flat=True))[0]
        return JsonResponse(response, safe = False)
    elif type == "workshop":
        workshop = Workshop.objects.filter(pk = id).values("workshop_name", "workshop_address", "image_route", "workshop_coordinates_longitude",
            "workshop_coordinates_latitude", "workshop_quotas", "workshop_description", "workshop_days", "workshop_start_date",
            "workshop_ended_date", "workshop_start_time", "workshop_ended_time", "workshop_available", "workshop_type", "workshop_commune")
        response["name"] = list(workshop.values_list("workshop_name", flat=True))[0]
        response["address"] = list(workshop.values_list("workshop_address", flat=True))[0]
        response["image"] = list(workshop.values_list("image_route", flat=True))[0]
        response["longitude"] = list(workshop.values_list("workshop_coordinates_longitude", flat=True))[0]
        response["latitude"] = list(workshop.values_list("workshop_coordinates_latitude", flat=True))[0]
        response["quotas"] = list(workshop.values_list("workshop_quotas", flat=True))[0]
        response["description"] = list(workshop.values_list("workshop_description", flat=True))[0]
        response["days"] = list(workshop.values_list("workshop_days", flat=True))[0]
        response["start_date"] = list(workshop.values_list("workshop_start_date", flat=True))[0]
        response["ended_date"] = list(workshop.values_list("workshop_ended_date", flat=True))[0]
        response["start_time"] = list(workshop.values_list("workshop_start_time", flat=True))[0]
        response["ended_time"] = list(workshop.values_list("workshop_ended_time", flat=True))[0]
        response["available"] = list(workshop.values_list("workshop_available", flat=True))[0]
        response["event_type"] = list(Event_type.objects.filter(id = list(workshop.values_list("workshop_type", flat=True))[0]).values_list("event_type_name" ,flat=True))[0]
        response["commune"] = list(Commune.objects.filter(id = list(workshop.values_list("workshop_commune", flat=True))[0]).values_list("commune_name" ,flat=True))[0]
        return JsonResponse(response, safe = False)
    elif type == "area":
        area = Entertainment_areas.objects.filter(pk = id).values("area_name", "area_address", "image_route", "area_coordinates_longitude",
            "area_coordinates_latitude", "area_description", "area_days", "area_available", "area_commune")
        response["name"] = list(area.values_list("area_name", flat=True))[0]
        response["address"] = list(area.values_list("area_address", flat=True))[0]
        response["image"] = list(area.values_list("image_route", flat=True))[0]
        response["longitude"] = list(area.values_list("area_coordinates_longitude", flat=True))[0]
        response["latitude"] = list(area.values_list("area_coordinates_latitude", flat=True))[0]
        response["description"] = list(area.values_list("area_description", flat=True))[0]
        response["days"] = list(area.values_list("area_days", flat=True))[0]
        response["available"] = list(area.values_list("area_available", flat=True))[0]
        response["commune"] = list(Commune.objects.filter(id = list(area.values_list("area_commune", flat=True))[0]).values_list("commune_name" ,flat=True))[0]
        return JsonResponse(response, safe = False)
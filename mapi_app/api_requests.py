# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.decorators import login_required, user_passes_test
# from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.template.context_processors import request
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.conf import settings

from .helper import Json
from .response_http import Bad_request, Internal_server_error, Not_found, Ok
from .models import Event, Entertainment_areas, Workshop, Commune, Event_type, Workshop_type, Comments

@require_GET
def home(request):
    return Json({Ok("Test api rest"), list(User.objects.all().values())})


@require_GET
def map_all_events_list(request):
    event_list = []
    events = Event.objects.filter(event_available = 1).values("id", "event_name", "event_coordinates_longitude",
    "event_coordinates_latitude", "event_type")
    try:
        for event in events.values():
            event_list.append({
                "id": event["id"],
                "name": event["event_name"],
                "latitude": event["event_coordinates_latitude"],
                "longitude": event["event_coordinates_longitude"],
                "table": "event",
                "icon": Event_type.objects.get(pk = event["event_type_id"]).event_type_icon.url if bool(Event_type.objects.get(pk = event["event_type_id"]).event_type_icon) else "undefined"
            })
    except:
        return Json(Internal_server_error("Error in event list"))
    areas = Entertainment_areas.objects.filter(area_available = 1).values("id", "area_name",
    "area_coordinates_longitude", "area_coordinates_latitude", "icon_route")
    try:
        for area in areas.values():
            event_list.append({
                "id": area["id"],
                "name": area["area_name"],
                "latitude": area["area_coordinates_latitude"],
                "longitude": area["area_coordinates_longitude"],
                "table": "area",
                "icon": "{0}{1}".format(settings.MEDIA_URL, area["icon_route"]) if area["icon_route"] is not None else "undefined"
            })
    except:
        return Json(Internal_server_error("Error in area list"))

    workshops = Workshop.objects.filter(workshop_available = 1).values("id", "workshop_name",
    "workshop_coordinates_longitude", "workshop_coordinates_latitude", "workshop_type")
    try:
        for workshop in workshops.values():
            event_list.append({
                "id": workshop["id"],
                "name": workshop["workshop_name"],
                "latitude": workshop["workshop_coordinates_latitude"],
                "longitude": workshop["workshop_coordinates_longitude"],
                "table": "workshop",
                "icon": Workshop_type.objects.get(pk = workshop["workshop_type_id"]).workshop_type_icon.url if bool(Workshop_type.objects.get(pk = workshop["workshop_type_id"]).workshop_type_icon) else "undefined"
            })
    except:
        return Json(Internal_server_error("Error in workshop list"))
    if len(event_list) <= 0:
        return Json(Not_found("Not data found"))
    return Json(event_list)

@require_GET
def event_details(request, table, id):
    if(table == "event"):
        try:
            event_queryset = Event.objects.get(pk = id)
            event = {
                "name": event_queryset.event_name,
                "address": event_queryset.event_address,
                "image": event_queryset.image_route.url if bool(event_queryset.image_route) else "undefined",
                "longitude": event_queryset.event_coordinates_longitude,
                "latitude": event_queryset.event_coordinates_latitude,
                "quotas": event_queryset.event_quotas,
                "description": event_queryset.event_description,
                "start_date": event_queryset.event_start_date,
                "ended_date": event_queryset.event_ended_date,
                "start_time": event_queryset.event_start_time,
                "ended_time": event_queryset.event_ended_time,
                "type": event_queryset.event_type.event_type_name,
                "commune": event_queryset.event_commune.commune_name,
                "one_stars": event_queryset.one_stars,
                "two_stars": event_queryset.two_stars,
                "three_stars": event_queryset.three_stars,
                "four_stars": event_queryset.four_stars,
                "five_stars": event_queryset.five_stars,
                "comments": [{
                    "username": comment["username"],
                    "comment_date": comment["comment_date"],
                    "comment_time": comment["comment_time"],
                    "likes": comment["likes"]
                } for comment in Comments.objects.filter(event = id).values("username", "comment_date", "comment_time", "likes")]
            }
            return Json(event)
        except:
            pass
    elif table == "workshop":
        try: 
            workshop_queryset = Workshop.objects.get(pk = id)
            workshop = {
                "name": workshop_queryset.workshop_name,
                "address": workshop_queryset.workshop_address,
                "image": workshop_queryset.image_route.url if bool(workshop_queryset.image_route) else "undefined",
                "longitude": workshop_queryset.workshop_coordinates_longitude,
                "latitude": workshop_queryset.workshop_coordinates_latitude,
                "quotas": workshop_queryset.workshop_quotas,
                "description": workshop_queryset.workshop_description,
                "days": workshop_queryset.workshop_days,
                "start_date": workshop_queryset.workshop_start_date,
                "ended_date": workshop_queryset.workshop_ended_date,
                "start_time": workshop_queryset.workshop_start_time,
                "ended_time": workshop_queryset.workshop_ended_time,
                "type": workshop_queryset.workshop_type.workshop_type_name,
                "commune": workshop_queryset.workshop_commune.commune_name,
                "one_stars": workshop_queryset.one_stars,
                "two_stars": workshop_queryset.two_stars,
                "three_stars": workshop_queryset.three_stars,
                "four_stars": workshop_queryset.four_stars,
                "five_stars": workshop_queryset.five_stars,
                "comments": [{
                    "username": comment["username"],
                    "comment_date": comment["comment_date"],
                    "comment_time": comment["comment_time"],
                    "likes": comment["likes"]
                } for comment in Comments.objects.filter(workshop = id).values("username", "comment_date", "comment_time", "likes")]
            }
            return Json(workshop)
        except:
            pass
    elif table == "area":
        try:
            area_queryset = Entertainment_areas.objects.get(pk = id)
            area = {
                "name": area_queryset.area_name,
                "address": area_queryset.area_address,
                "image": area_queryset.image_route.url if bool(area_queryset.image_route) else "undefined",
                "longitude": area_queryset.area_coordinates_longitude,
                "latitude": area_queryset.area_coordinates_latitude,
                "description": area_queryset.area_description,
                "days": area_queryset.area_days,
                "commune": area_queryset.area_commune.commune_name,
                "start_time": area_queryset.area_start_time,
                "ended_time": area_queryset.area_ended_time,
                "one_stars": area_queryset.one_stars,
                "two_stars": area_queryset.two_stars,
                "three_stars": area_queryset.three_stars,
                "four_stars": area_queryset.four_stars,
                "five_stars": area_queryset.five_stars,
                "comments": [{
                    "username": comment["username"],
                    "comment_date": comment["comment_date"],
                    "comment_time": comment["comment_time"],
                    "likes": comment["likes"]
                } for comment in Comments.objects.filter(area = id).values("username", "comment_date", "comment_time", "likes")]
            }
            return Json(area)
        except:
            pass

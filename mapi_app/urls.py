from . import views
from . import api_requests
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #views
    path("", views.home, name="home"),

    #api rest
    path("api/api-test", api_requests.home),
    path("api/events/list", api_requests.map_all_events_list),
    path("api/events/detail/<str:table>/<int:id>", api_requests.event_details),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
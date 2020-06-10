from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

marital_situation = [
    (0, "Casado(a)"),
    (1, "Separado(a) Judicialmente"),
    (2, "Divorciado(a)"),
    (3, "Viudo(a)"),
    (4, "Soltero(a)"),
    (5, "Conviviente Civil")
]

available = [
    (0, "No Disponible"),
    (1, "Disponible")
]

gender = [
    (0, "Hombre"),
    (1, "Mujer"),
    (2, "Prefiero no decir"),
    (3, "Otro")
]

days = [#basado en javascript getDay()
    (0, "Domingo"),
    (1, "Lunes"),
    (2, "Martes"),
    (3, "Miercoles"),
    (4, "Jueves"),
    (5, "Viernes"),
    (6, "Sabado")
]

class Commune(models.Model):
    commune_name = models.CharField(max_length = 255)

    def __str__(self):
        return self.commune_name

    def __dict__(self):
        return {
            "commune_name": self.commune_name
        }

class Event_type(models.Model):
    event_type_name = models.CharField(max_length = 255, null = False, default = "")
    event_type_description = models.CharField(max_length = 255, null = True, default = "")
    event_type_icon = models.ImageField(upload_to = "events_type/%Y/%m/%d", blank = True, null = True)

    def __str__(self):
        return self.event_type_name

class Workshop_type(models.Model):
    workshop_type_name = models.CharField(max_length = 255, null = False, default = "")
    workshop_type_description = models.CharField(max_length = 255, null = True, default = "")
    workshop_type_icon = models.ImageField(upload_to = "workshop_type/%Y/%m/%d", blank = True, null = True)

    def __str__(self):
        return self.workshop_type_name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    phone_number = models.IntegerField(null = True)
    address = models.CharField(max_length = 300, null = True)
    birthday = models.DateField(auto_now = False, auto_now_add = True, null = True)
    marital_situation = models.IntegerField(null = True, default = 4, choices = marital_situation)
    gender = models.IntegerField(null = True, default = 2, choices = gender)
    commune = models.ForeignKey(Commune, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender = User)
def create_user_profile(sender, instance, created, **kwargs):
    if created: 
        Profile.objects.create(user = instance)

@receiver(post_save, sender = User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Event(models.Model):
    event_name = models.CharField(max_length = 255, null = False, default = "Sin nombre")
    event_address = models.CharField(max_length = 500, null = False, default = "Sin indicar")
    image_route = models.ImageField(upload_to = "events/%Y/%m/%d", blank = True, null = True)
    event_coordinates_longitude = models.CharField(max_length = 100, null = False, blank = False)
    event_coordinates_latitude = models.CharField(max_length = 100, null = False, blank = False)
    event_quotas = models.IntegerField(null = False, blank = False, default = -1)
    event_description = models.CharField(max_length = 500, null = True, blank = True, default = "Sin descripción")
    event_start_date = models.DateField(auto_now = False, auto_now_add = True, null = False)
    event_ended_date = models.DateField(auto_now = False, auto_now_add = True, null = False)
    event_start_time = models.TimeField(auto_now = False, auto_now_add = True, null = False)
    event_ended_time = models.TimeField(auto_now = False, auto_now_add = True, null = False)
    event_available = models.IntegerField(null = False, default = 1, choices = available)
    event_type = models.ForeignKey(Event_type, on_delete = models.SET_NULL, null = True, default = None)
    event_commune = models.ForeignKey(Commune, on_delete = models.SET_NULL, null = True, default = None)
    one_stars = models.IntegerField(null = False, blank = False, default = 0)
    two_stars = models.IntegerField(null = False, blank = False, default = 0)
    three_stars = models.IntegerField(null = False, blank = False, default = 0)
    four_stars = models.IntegerField(null = False, blank = False, default = 0)
    five_stars = models.IntegerField(null = False, blank = False, default = 0)

    def __str__(self):
        return self.event_name

class Workshop(models.Model):
    workshop_name = models.CharField(max_length = 255, null = False, default = "Sin nombre")
    workshop_address = models.CharField(max_length = 500, null = False, default = "Sin indicar")
    image_route = models.ImageField(upload_to = "workshops/%Y/%m/%d", blank = True, null = True)
    workshop_coordinates_longitude = models.CharField(max_length = 100, null = False, blank = False)
    workshop_coordinates_latitude = models.CharField(max_length = 100, null = False, blank = False)
    workshop_quotas = models.IntegerField(null = False, blank = False, default = -1)
    workshop_description = models.CharField(max_length = 500, null = True, blank = True, default = "Sin descripción")
    workshop_days = models.CharField(max_length = 13, null = False, blank = False, default = "Sin especificar")
    workshop_start_date = models.DateField(auto_now = False, auto_now_add = True, null = False)
    workshop_ended_date = models.DateField(auto_now = False, auto_now_add = True, null = False)
    workshop_start_time = models.TimeField(auto_now = False, auto_now_add = True, null = False)
    workshop_ended_time = models.TimeField(auto_now = False, auto_now_add = True, null = False)
    workshop_available = models.IntegerField(null = False, default = 1, choices = available)
    workshop_type = models.ForeignKey(Workshop_type, on_delete = models.SET_NULL, null = True, default = None)
    workshop_commune = models.ForeignKey(Commune, on_delete = models.SET_NULL, null = True, default = None)
    one_stars = models.IntegerField(null = False, blank = False, default = 0)
    two_stars = models.IntegerField(null = False, blank = False, default = 0)
    three_stars = models.IntegerField(null = False, blank = False, default = 0)
    four_stars = models.IntegerField(null = False, blank = False, default = 0)
    five_stars = models.IntegerField(null = False, blank = False, default = 0)

    def __str__(self):
        return self.workshop_name

class Entertainment_areas(models.Model):
    area_name = models.CharField(max_length = 255, null = False, default = "Sin nombre")
    area_address = models.CharField(max_length = 500, null = False, default = "Sin indicar")
    image_route = models.ImageField(upload_to = "areas/%Y/%m/%d", blank = True, null = True)
    icon_route = models.ImageField(upload_to = "areas/icons/%Y/%m/%d" , blank = True, null = True)
    area_coordinates_longitude = models.CharField(max_length = 100, null = False, blank = False)
    area_coordinates_latitude = models.CharField(max_length = 100, null = False, blank = False)
    area_description = models.CharField(max_length = 500, null = True, blank = True, default = "Sin descripción")
    area_days = models.CharField(max_length = 13, null = False, blank = False, default = "Sin especificar")
    area_available = models.IntegerField(null = False, default = 1, choices = available)
    area_commune = models.ForeignKey(Commune, on_delete = models.SET_NULL, null = True, default = None)
    area_start_time = models.TimeField(auto_now = False, auto_now_add = True, null = True)
    area_ended_time = models.TimeField(auto_now = False, auto_now_add = True, null = True)
    one_stars = models.IntegerField(null = False, blank = False, default = 0)
    two_stars = models.IntegerField(null = False, blank = False, default = 0)
    three_stars = models.IntegerField(null = False, blank = False, default = 0)
    four_stars = models.IntegerField(null = False, blank = False, default = 0)
    five_stars = models.IntegerField(null = False, blank = False, default = 0)

    def __str__(self):
        return self.area_name

class Comments(models.Model):
    username = models.CharField(max_length = 255, null = False, blank = False, default = "Sin nombre")
    event = models.ForeignKey(Event, null = True, on_delete = models.SET_NULL)
    workshop = models.ForeignKey(Workshop, null = True, on_delete = models.SET_NULL)
    area = models.ForeignKey(Entertainment_areas, null = True, on_delete = models.SET_NULL)
    comment_date = models.DateField(auto_now_add = False, auto_now = True, null = False, blank = False)
    comment_time = models.TimeField(auto_now_add = False, auto_now = True, null = False, blank = False)
    likes = models.IntegerField(null = False, blank = False, default = 0)

    def __str__(self):
        return "Comment by: " + self.username + " at " + self.comment_date

class Logs(models.Model):
    user = models.CharField(max_length = 10, null = False, blank = False, default = "Sin identificar")
    table_name = models.CharField(max_length = 100, null = False, blank = False, default = "Sin identificar")
    action = models.CharField(max_length = 100, null = False, blank = False, default = "Sin especificar")
    description = models.CharField(max_length = 500, null = True, blank = True, default = "Sin descripción")
    log_date = models.DateField(auto_now_add = False, auto_now = False, null = False, blank = False, default = timezone.now)
    log_time = models.TimeField(auto_now_add = False, auto_now = False, null = False, blank = False, default = timezone.now)

    def __str__(self):
        return self.user + " did " + self.action + " into " + self.table_name
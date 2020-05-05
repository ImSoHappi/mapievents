from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Commune)
admin.site.register(models.Event_type)
admin.site.register(models.Workshop_type)
admin.site.register(models.Profile)
admin.site.register(models.Event)
admin.site.register(models.Workshop)
admin.site.register(models.Entertainment_areas)
admin.site.register(models.Comments)
admin.site.register(models.Logs)

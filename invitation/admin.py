from django.contrib import admin
from .models import RSVP

@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "guests", "attendance", "created_at")
    list_filter = ("attendance", "created_at")
    search_fields = ("name", "phone", "message")

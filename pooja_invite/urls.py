from django.contrib import admin
from django.urls import path
from invitation import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("rsvp/", views.rsvp, name="rsvp"),
]

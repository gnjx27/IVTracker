# Imports
from django.urls import path
from .views import GetIVPoints

urlpatterns = [
    path("ivpoints/", GetIVPoints.as_view(), name="get_iv_points"),
]
# Imports
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/options/", include("options.urls")),
    path("api/user/", include("user.urls")),
    path("api/tracker/", include("tracker.urls"))
]

from django.urls import path
from .views import TrackerListCreateView, TrackerSnapshotsView, TrackerDetailView

urlpatterns = [
    path("", TrackerListCreateView.as_view(), name="tracker-list-create"),
    path("<int:pk>/", TrackerDetailView.as_view(), name="tracker-detail"),
    path("<int:tracker_id>/snapshots/", TrackerSnapshotsView.as_view(), name="tracker-snapshots")
]
from django.db import models
from django.conf import settings

# Create your models here.

class Tracker(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10)
    q = models.FloatField()
    min_strike_pct = models.FloatField()
    max_strike_pct = models.FloatField()
    interval =  models.PositiveIntegerField(default=60) # minutes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.ticker}"


class Snapshot(models.Model):
    tracker = models.ForeignKey(Tracker, on_delete=models.CASCADE, related_name="snapshots")
    sequence_id = models.PositiveIntegerField()
    datapoints = models.JSONField(null=True, blank=True) # {"strikes": [...], "times": [...], "iv_surface": [...]}
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sequence_id"]

    def clean(self):
        # Convert empty strings to None
        if self.error_message == "":
            self.error_message = None

    def __str__(self):
        return f"{self.tracker.ticker} Snapshot {self.sequence_id}"


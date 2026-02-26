from rest_framework import serializers
from .models import Tracker, Snapshot

class TrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracker
        fields = ["id", "ticker", "q", "min_strike_pct", "max_strike_pct", "interval", "created_at"]
        read_only_fields = ["id", "created_at"]


class SnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snapshot
        fields = ["id", "sequence_id", "datapoints", "error_message", "created_at"]

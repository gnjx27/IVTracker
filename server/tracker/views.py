from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import TrackerSerializer, SnapshotSerializer
from .models import Tracker, Snapshot
from rest_framework.exceptions import PermissionDenied, APIException
from user.models import CustomUser
import yfinance as yf

# Create your views here.

class TrackerListCreateView(generics.ListCreateAPIView):
    serializer_class = TrackerSerializer
    permission_classes = [permissions.IsAuthenticated]

    MAX_FREE_TICKERS = 3
    MAX_PREMIUM_TICKERS = 10

    def get_queryset(self):
        # Only trackers belonging to the current user
        return Tracker.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        user = self.request.user
        current_count = Tracker.objects.filter(user=user).count()

        # Validate ticker symbol before saving
        ticker_symbol = serializer.validated_data.get("ticker").upper()
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        if not info or 'regularMarketPrice' not in info:
            raise APIException(detail=f"Ticker symbol '{ticker_symbol}' is invalid. Please enter a valid ticker symbol.")

        # Validate tracker limit
        if user.subscription_tier == CustomUser.FREE and current_count >= self.MAX_FREE_TICKERS:
            raise PermissionDenied("Free tier allows a maximum of 3 tickers.")
        
        elif user.subscription_tier == CustomUser.PREMIUM and current_count >= self.MAX_PREMIUM_TICKERS:
            raise PermissionDenied(f"Premium tier allows a maximum of {self.MAX_PREMIUM_TICKERS} tickers.")
        
        # Proceed to save tracker
        serializer.save(user=user)

class TrackerDetailView(generics.DestroyAPIView):
    serializer_class = TrackerSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        # Only allow access to trackers that the user owns
        return Tracker.objects.filter(user=self.request.user)

class TrackerSnapshotsView(generics.ListAPIView):
    serializer_class = SnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tracker_id = self.kwargs.get("tracker_id")
        return Snapshot.objects.filter(tracker__id=tracker_id, tracker__user=self.request.user).order_by("sequence_id")
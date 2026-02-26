from celery import shared_task
from .models import Tracker, Snapshot
from options.services.calculate_iv import fetch_us_treasury_rates, create_interpolator, calculate_iv

@shared_task
def generate_snapshots():
    # Filter trackers
    trackers = Tracker.objects.all().filter(interval=60)

    try:
        # Fetch U.S treasury rates
        rates = fetch_us_treasury_rates()

        # Create interpolator
        r_interp = create_interpolator(rates)
        
    except Exception as e:
        print(f"Failed to fetch rates or create interpolator: {str(e)}")
        error_message = "Unable to fetch risk-free interest rate data at this time. This snapshot was skipped. We’ll try again at the next scheduled interval."
        # Save error message in all snapshots
        for tracker in trackers:
            Snapshot.objects.create(
                tracker=tracker,
                sequence_id=tracker.snapshots.count() + 1,
                error_message=error_message
            )
        return 
    
    # Calculate and save data points to snapshot model
    for tracker in trackers:
        try:
            # Calculate iv points
            iv_data = calculate_iv(
                ticker_symbol=tracker.ticker,
                q=tracker.q,
                min_strike_pct=tracker.min_strike_pct,
                max_strike_pct=tracker.max_strike_pct,
                r_interp=r_interp
            )
            # Save data in snapshot
            Snapshot.objects.create(
                tracker=tracker,
                sequence_id=tracker.snapshots.count() + 1,
                datapoints=iv_data,
                error_message=None
            )

        except Exception as e:
            print(f"Tracker {tracker.id} skipped: {str(e)}")
            # Save error message in snapshot
            Snapshot.objects.create(
                tracker=tracker,
                sequence_id=tracker.snapshots.count() + 1,
                datapoints=None,
                error_message=str(e)
            )
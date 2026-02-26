import os
from celery import Celery

# Set default django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ivtracker.settings")

# Initialise Celery app
app = Celery("ivtracker")

# Load settings from Django, using the CELERY_prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover tasks from all registered Django apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
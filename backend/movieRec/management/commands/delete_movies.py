import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from ...models import *

class Command(BaseCommand):
    help = 'Import movies from a CSV file'

    def handle(self, *args, **options):
        try:
            deleted_count, _ = Movie.objects.all().delete()
            print(f"Successfully deleted {deleted_count} movies.")
        except Exception as e:
            print(f"Error deleting movies: {e}")


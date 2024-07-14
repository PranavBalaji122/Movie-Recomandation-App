import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from ...models import *

class Command(BaseCommand):
    help = 'Import movies from a CSV file'

    def handle(self, *args, **options):
        file_path = "/Users/pranavbalaji/Documents/Personal CS Projects/Movie Recomandation App/backend/data/movies4.csv"
        
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            count =0
            reader = csv.DictReader(csvfile)
            for row in reader:
                id = row['id']
                title = row['title']
                overview = row['overview']
                release_date_str = row['release_date'].strip() 
                genereOfMovie = row['genre_names']
                poster_path = row['poster_path']
                
                if not release_date_str:
                    self.stdout.write(self.style.WARNING(f'Skipping movie import for {title}: Empty release_date'))
                    continue

                try:
                    release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
                except ValueError as e:
                    self.stdout.write(self.style.ERROR(f'Error parsing release_date for {title}: {e}'))
                    continue

                movie, created = Movie.objects.update_or_create(
                    name=title,
                    description=overview,
                    date=release_date,
                    genere = genereOfMovie,
                    poster_path = poster_path,
                    id = id,
                )

                count+=1
                

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Successfully created movie: {movie.name}'))
                    self.stdout.write(self.style.SUCCESS(f'MovieNumber: {count}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Updated movie: {movie.name}'))
            
            self.stdout.write(self.style.SUCCESS(f'Total movies imported: {count}'))

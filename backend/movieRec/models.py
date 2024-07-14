from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver




class Movie(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    genere = models.TextField(blank=True)
    poster_path = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name







class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    favorite_movie = models.ForeignKey(Movie, null=True, blank=True, on_delete=models.SET_NULL)
    top10_Favorite_movies = models.TextField(null=True, blank=True)
    moviesInColelction = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return self.user.username






@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


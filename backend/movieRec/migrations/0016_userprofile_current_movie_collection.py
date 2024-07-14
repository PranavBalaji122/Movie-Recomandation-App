# Generated by Django 5.0.6 on 2024-07-03 04:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movieRec', '0015_alter_userprofile_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='current_movie_collection',
            field=models.ManyToManyField(blank=True, related_name='user_profiles', to='movieRec.movie'),
        ),
    ]

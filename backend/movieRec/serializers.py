from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, UserProfile





class UserProfileSerializer(serializers.ModelSerializer):
    favorite_movie = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all(), allow_null=True, required=False)
    class Meta:
        model = UserProfile
        fields = ['favorite_movie','top10_Favorite_movies','moviesInColelction']




class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'profile']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create_user(**validated_data)
        for attr, value in profile_data.items():
            setattr(user.profile, attr, value)
        user.profile.save()
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()

        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance

   
    


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id','name','description','date','genere','poster_path']
    
    
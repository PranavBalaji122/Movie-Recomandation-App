from django.contrib import admin
from django.urls import path, include

from movieRec import views 
from movieRec.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("register/", CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name='get_token'),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("auth/", include("rest_framework.urls")),
    path('movies/', ViewAllMovies.as_view(), name='all_movies'),
    path("getUserByID/<int:pk>/", GetUserViewByID.as_view(), name="get_user"),
    path("getUserByUsername/<str:username>/", GetUserByUsername.as_view(), name="get_user_by_username"),
    path("getMovieByID/<int:pk>/", GetMovieByID.as_view(), name = "get_movie_by_id"),
    path("UpdateMovieCollection/", UpdateMoviesInCollection.as_view(), name = "updateMovieCollection"),
    path("DeleteMoviesInCollection/", DeleteMoviesInCollection.as_view(), name = "deleteMoviesInCollection"),
    path("GetRecomendation/", RecomendMovies.as_view(), name = "recomendMovies"),


]

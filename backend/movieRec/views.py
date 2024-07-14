from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework import filters
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle


# df = pd.read_csv('/Users/pranavbalaji/Documents/Personal CS Projects/Movie Recomandation App/backend/data/movies4.csv')
# df['title'] = df['title'].fillna('')
# df['overview'] = df['overview'].fillna('')
# df['genre_names'] = df['genre_names'].fillna('')
# df['combined_features'] = df['title'] + ' ' + df['overview'] + ' ' + df['genre_names']
# tfidf = TfidfVectorizer(stop_words='english')
# tfidf_matrix = tfidf.fit_transform(df['combined_features'])
# cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)


with open('/Users/pranavbalaji/Documents/Personal CS Projects/DataBase Stuff For Movie Rec APP/tfidf_matrix.pkl', 'rb') as f:
    tfidf_matrix = pickle.load(f)

with open('/Users/pranavbalaji/Documents/Personal CS Projects/DataBase Stuff For Movie Rec APP/cosine_sim.pkl', 'rb') as f:
    cosine_sim = pickle.load(f)

df = pd.read_pickle('/Users/pranavbalaji/Documents/Personal CS Projects/DataBase Stuff For Movie Rec APP/movies_df.pkl')


class RecomendMovies(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        user_profile = request.user.profile
        watched_movies_ids = user_profile.moviesInColelction.split(', ')
        watched_movies = [Movie.objects.get(id=movie_id).name for movie_id in watched_movies_ids]
        if(len(watched_movies)==0):
            return Response({'error': 'No movies in collection'}, status=status.HTTP_400_BAD_REQUEST)

        def get_recommendations(watched_movies, cosine_sim=cosine_sim):
            watched_indices = [df[df['title'] == movie].index[0] for movie in watched_movies]
            sim_scores = cosine_sim[watched_indices]
            mean_sim_scores = np.mean(sim_scores, axis=0)
            sim_indices = mean_sim_scores.argsort()[::-1]
            recommended_titles = df['title'].iloc[sim_indices[1:11]].values

            recommended_titles = [title for title in recommended_titles if title not in watched_movies]
            return recommended_titles[:12] 
        
        recomandations = get_recommendations(watched_movies)
        recomended_movies = Movie.objects.filter(name__in=recomandations)

        serializers =MovieSerializer(recomended_movies,many=True)
        return Response(serializers.data)














class DeleteMoviesInCollection(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user_profile = request.user.profile
        movie_id = request.data.get('moviesInColelction', None)

        if movie_id is not None:
            if user_profile.moviesInColelction:
                movies_ids = user_profile.moviesInColelction.split(', ')
                if movie_id in movies_ids:
                    movies_ids.remove(movie_id)
                    user_profile.moviesInColelction = ', '.join(movies_ids)
                    user_profile.save()

                    serializer = UserProfileSerializer(user_profile)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Movie ID not found in collection'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'No movies in collection'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'moviesInColelction ID not provided'}, status=status.HTTP_400_BAD_REQUEST)







class UpdateMoviesInCollection(APIView):
     permission_classes = [IsAuthenticated]
     def put(self, request, *args, **kwargs):
        user_profile = request.user.profile  
        movie_id = request.data.get('moviesInColelction', None)

        if movie_id is not None:
            if user_profile.moviesInColelction:
                movies_ids = user_profile.moviesInColelction.split(', ')
                if movie_id not in movies_ids:
                    movies_ids.append(movie_id)
                user_profile.moviesInColelction = ', '.join(movies_ids)
            else:
                user_profile.moviesInColelction = movie_id
            user_profile.save()

            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'moviesInColelction ID not provided'}, status=status.HTTP_400_BAD_REQUEST)








class CreateUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]




class ViewAllMovies(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']




class GetUserViewByID(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        user_id = self.kwargs.get('pk') 
        return get_object_or_404(User, pk=user_id)



class GetUserByUsername(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
         username = self.kwargs.get('username')
         return get_object_or_404(User,username=username)
    


class GetMovieByID(generics.RetrieveAPIView):
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        movie_id = self.kwargs.get('pk')
        return get_object_or_404(Movie, pk = movie_id)







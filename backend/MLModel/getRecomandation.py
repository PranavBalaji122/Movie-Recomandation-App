import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import precision_score, recall_score, f1_score


df = pd.read_csv('/Users/pranavbalaji/Documents/Personal CS Projects/Movie Recomandation App/backend/data/movies4.csv')


df['title'] = df['title'].fillna('')
df['overview'] = df['overview'].fillna('')
df['genre_names'] = df['genre_names'].fillna('')


df['combined_features'] = df['title'] + ' ' + df['overview'] + ' ' + df['genre_names']


tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])


cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)


def get_recommendations(watched_movies, cosine_sim=cosine_sim):
    watched_indices = [df[df['title'] == movie].index[0] for movie in watched_movies]
    sim_scores = cosine_sim[watched_indices]
    mean_sim_scores = np.mean(sim_scores, axis=0)
    sim_indices = mean_sim_scores.argsort()[::-1]
    return df['title'].iloc[sim_indices[1:11]].values  


watched_movies = ['Inception', 'Interstellar']  
recommendations = get_recommendations(watched_movies)
print(recommendations)




ground_truth = ['The Matrix', 'Inception', 'The Dark Knight', 'Interstellar', 'Avatar']
recommended_movies = recommendations.tolist()
y_true = [1 if movie in ground_truth else 0 for movie in df['title']]
y_pred = [1 if movie in recommended_movies else 0 for movie in df['title']]

# Precision, Recall, and F1 Score
precision = precision_score(y_true, y_pred, average='binary')
recall = recall_score(y_true, y_pred, average='binary')
f1 = f1_score(y_true, y_pred, average='binary')

print(f'Precision: {precision}')
print(f'Recall: {recall}')
print(f'F1 Score: {f1}')
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle


df = pd.read_csv('/Users/pranavbalaji/Documents/Personal CS Projects/Movie Recomandation App/backend/data/movies4.csv')
df['title'] = df['title'].fillna('')
df['overview'] = df['overview'].fillna('')
df['genre_names'] = df['genre_names'].fillna('')
df['combined_features'] = df['title'] + ' ' + df['overview'] + ' ' + df['genre_names']


tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)


with open('tfidf_matrix.pkl', 'wb') as f:
    pickle.dump(tfidf_matrix, f)

with open('cosine_sim.pkl', 'wb') as f:
    pickle.dump(cosine_sim, f)


df.to_pickle('movies_df.pkl')
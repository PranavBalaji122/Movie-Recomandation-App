import pandas as pd
import json

def extractGenresNames(genre_str):
    try:
        if pd.isnull(genre_str):
            return []
        geners = json.loads(genre_str.replace("'", '"'))
        return [genere['name'] for genere in geners]
    except (json.JSONDecodeError, KeyError):
        return []

def parseData(file):

    dtype_dict = {'genres': str}  
    df = pd.read_csv(file, dtype=dtype_dict)
    df = df[["title", "overview", "release_date", "poster_path", "genres"]]
    df['genre_names'] = df['genres'].apply(extractGenresNames)
    df = df[["title", "overview", "release_date", "genre_names", "poster_path"]]
    df.reset_index(drop=True, inplace=True)
    df.index.name = 'id'
    output_file = "/Users/pranavbalaji/Documents/Personal CS Projects/Movie Recomandation App/backend/data/movies4.csv"
    df.to_csv(output_file, index=True)
    


parseData("/Users/pranavbalaji/Documents/Personal CS Projects/Movie Recomandation App/backend/data/movies_metadata.csv")

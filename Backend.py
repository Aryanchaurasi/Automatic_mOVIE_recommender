import numpy as np
import pandas as pd
credits = pd.read_csv("tmdb_5000_credits.csv")
movies = pd.read_csv("tmdb_5000_movies.csv")
credits = credits[["movie_id", "cast", "crew"]]
credits.rename(columns={"movie_id": "id"}, inplace=True)
df = movies.merge(credits, on="id")
c = df["vote_average"].mean()
m = 25000
def weighted_rating(row, m=m, c=c):
    v = row["vote_count"]
    R = row["vote_average"]
    return (v/(v+m) * R) + (m/(m+v) * c)
df["wr"] = df.apply(weighted_rating, axis=1)
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(stop_words="english")
df["overview"].fillna(" ", inplace=True)
overview_matrix = cv.fit_transform(df["overview"])
from sklearn.metrics.pairwise import cosine_similarity
similarity_score = cosine_similarity(overview_matrix)
sorted(list(enumerate(similarity_score[200])), reverse=True, key=lambda x: x[1])
def recommend_movie(movie_name):
    index_position = df[df["title"] == movie_name].index[0]
    recommend_movie_indices = sorted(list(enumerate(similarity_score[index_position])), reverse=True, key=lambda x: x[1])[1:6]

    for i in recommend_movie_indices:
        print(df.iloc[i[0]].title)

recommend_movie("Avatar")

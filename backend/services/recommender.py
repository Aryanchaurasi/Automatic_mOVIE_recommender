import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any
import os
import requests

class MovieRecommenderService:
    def __init__(self):
        self.df = None
        self.similarity_score = None
        self.cv = None
        self.load_data()
        
    def load_data(self):
        # Load the existing movie data
        credits_path = "../tmdb_5000_credits.csv"
        movies_path = "../tmdb_5000_movies.csv"
        
        if os.path.exists(credits_path) and os.path.exists(movies_path):
            credits = pd.read_csv(credits_path)
            movies = pd.read_csv(movies_path)
            
            credits = credits[["movie_id", "cast", "crew"]]
            credits.rename(columns={"movie_id": "id"}, inplace=True)
            self.df = movies.merge(credits, on="id")
            
            # Calculate weighted rating
            c = self.df["vote_average"].mean()
            m = 25000
            
            def weighted_rating(row, m=m, c=c):
                v = row["vote_count"]
                R = row["vote_average"]
                return (v/(v+m) * R) + (m/(m+v) * c)
            
            self.df["wr"] = self.df.apply(weighted_rating, axis=1)
            
            # Create similarity matrix
            self.cv = CountVectorizer(stop_words="english")
            self.df["overview"].fillna(" ", inplace=True)
            overview_matrix = self.cv.fit_transform(self.df["overview"])
            self.similarity_score = cosine_similarity(overview_matrix)
    
    def recommend_movies(self, user_id: int, top_n: int = 10) -> List[Dict[str, Any]]:
        """Get movie recommendations for a user"""
        if self.df is None:
            return []
        
        # For demo, recommend top-rated movies
        top_movies = self.df.nlargest(top_n, 'wr')
        
        recommendations = []
        for _, movie in top_movies.iterrows():
            recommendations.append({
                "id": int(movie["id"]),
                "title": movie["title"],
                "genre": movie.get("genres", ""),
                "poster_url": self.get_poster_url(movie.get("poster_path", "")),
                "overview": movie.get("overview", ""),
                "vote_average": float(movie.get("vote_average", 0)),
                "vote_count": int(movie.get("vote_count", 0)),
                "release_date": movie.get("release_date", ""),
                "similarity_score": 0.9,
                "reason": "Highly rated movie"
            })
        
        return recommendations
    
    def recommend_by_movie(self, movie_name: str, top_n: int = 5) -> List[Dict[str, Any]]:
        """Get similar movies based on a movie name"""
        if self.df is None:
            return []
        
        try:
            movie_matches = self.df[self.df["title"].str.contains(movie_name, case=False, na=False)]
            if movie_matches.empty:
                return []
            
            index_position = movie_matches.index[0]
            recommend_movie_indices = sorted(
                list(enumerate(self.similarity_score[index_position])), 
                reverse=True, 
                key=lambda x: x[1]
            )[1:top_n+1]
            
            recommendations = []
            for i, score in recommend_movie_indices:
                movie = self.df.iloc[i]
                recommendations.append({
                    "id": int(movie["id"]),
                    "title": movie["title"],
                    "genre": movie.get("genres", ""),
                    "poster_url": self.get_poster_url(movie.get("poster_path", "")),
                    "overview": movie.get("overview", ""),
                    "vote_average": float(movie.get("vote_average", 0)),
                    "vote_count": int(movie.get("vote_count", 0)),
                    "release_date": movie.get("release_date", ""),
                    "similarity_score": float(score),
                    "reason": f"Similar to {movie_name}"
                })
            
            return recommendations
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return []
    
    def get_movie_details(self, movie_id: int) -> Dict[str, Any]:
        """Get detailed information about a movie"""
        if self.df is None:
            return {}
        
        movie = self.df[self.df["id"] == movie_id]
        if movie.empty:
            return {}
        
        movie_data = movie.iloc[0]
        return {
            "id": int(movie_data["id"]),
            "title": movie_data["title"],
            "genre": movie_data.get("genres", ""),
            "poster_url": self.get_poster_url(movie_data.get("poster_path", "")),
            "overview": movie_data.get("overview", ""),
            "vote_average": float(movie_data.get("vote_average", 0)),
            "vote_count": int(movie_data.get("vote_count", 0)),
            "release_date": movie_data.get("release_date", ""),
            "cast": movie_data.get("cast", ""),
            "crew": movie_data.get("crew", "")
        }
    
    def get_poster_url(self, poster_path: str) -> str:
        """Get full poster URL from TMDB"""
        if not poster_path:
            return ""
        return f"https://image.tmdb.org/t/p/w500{poster_path}"

# Global instance
recommender_service = MovieRecommenderService()
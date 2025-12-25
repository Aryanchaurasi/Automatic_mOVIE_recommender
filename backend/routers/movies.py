from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import Movie, MovieRecommendation, User
from routers.auth import get_current_user
from services.recommender import recommender_service
import crud

router = APIRouter()

@router.get("/recommend/{user_id}", response_model=List[MovieRecommendation])
def get_recommendations(
    user_id: int, 
    top_n: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized movie recommendations for a user"""
    recommendations = recommender_service.recommend_movies(user_id, top_n)
    return recommendations

@router.get("/recommend/similar/{movie_name}", response_model=List[MovieRecommendation])
def get_similar_movies(
    movie_name: str,
    top_n: int = 5,
    current_user: User = Depends(get_current_user)
):
    """Get movies similar to the given movie name"""
    recommendations = recommender_service.recommend_by_movie(movie_name, top_n)
    if not recommendations:
        raise HTTPException(status_code=404, detail="Movie not found or no similar movies")
    return recommendations

@router.get("/{movie_id}", response_model=dict)
def get_movie_details(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific movie"""
    movie_details = recommender_service.get_movie_details(movie_id)
    if not movie_details:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie_details

@router.get("/", response_model=List[Movie])
def get_movies(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of movies"""
    movies = crud.get_movies(db, skip=skip, limit=limit)
    return movies
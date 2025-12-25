from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import Rating, RatingCreate, User
from routers.auth import get_current_user
import crud

router = APIRouter()

@router.get("/{user_id}/history", response_model=List[Rating])
def get_user_history(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's watch history and ratings"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    history = crud.get_user_history(db, user_id)
    return history

@router.get("/{user_id}/ratings", response_model=List[Rating])
def get_user_ratings(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's movie ratings"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    ratings = crud.get_user_ratings(db, user_id)
    return ratings

@router.post("/{user_id}/ratings", response_model=Rating)
def create_user_rating(
    user_id: int,
    rating: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new movie rating for the user"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check if movie exists in our recommendation system
    movie_details = crud.get_movie_by_id(db, rating.movie_id)
    
    new_rating = crud.create_rating(db, rating, user_id)
    return new_rating
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class MovieBase(BaseModel):
    title: str
    genre: Optional[str] = None
    poster_url: Optional[str] = None
    overview: Optional[str] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    release_date: Optional[str] = None

class Movie(MovieBase):
    id: int
    
    class Config:
        from_attributes = True

class MovieRecommendation(Movie):
    similarity_score: Optional[float] = None
    reason: Optional[str] = None

class RatingCreate(BaseModel):
    movie_id: int
    rating: float

class Rating(BaseModel):
    id: int
    user_id: int
    movie_id: int
    rating: float
    created_at: datetime
    movie: Movie
    
    class Config:
        from_attributes = True
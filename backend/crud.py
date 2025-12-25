from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import User, Movie, Rating
from schemas import UserCreate, RatingCreate
from passlib.context import CryptContext
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user

def get_movie_by_id(db: Session, movie_id: int) -> Optional[Movie]:
    return db.query(Movie).filter(Movie.id == movie_id).first()

def get_movies(db: Session, skip: int = 0, limit: int = 100) -> List[Movie]:
    return db.query(Movie).offset(skip).limit(limit).all()

def create_rating(db: Session, rating: RatingCreate, user_id: int) -> Rating:
    db_rating = Rating(**rating.dict(), user_id=user_id)
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

def get_user_ratings(db: Session, user_id: int) -> List[Rating]:
    return db.query(Rating).filter(Rating.user_id == user_id).order_by(desc(Rating.created_at)).all()

def get_user_history(db: Session, user_id: int) -> List[Rating]:
    return db.query(Rating).filter(Rating.user_id == user_id).order_by(desc(Rating.created_at)).all()
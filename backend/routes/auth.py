from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.auth import verify_password, get_password_hash, create_access_token
from pydantic import BaseModel
from datetime import timedelta

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer",
            "user": {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name}}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer",
            "user": {"id": db_user.id, "email": db_user.email, "full_name": db_user.full_name}}

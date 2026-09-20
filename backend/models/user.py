from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(100))
    role = Column(String(50), default="student")
    readiness_score = Column(Float, default=0.0)
    previous_readiness_score = Column(Float, default=0.0)
    resume_score = Column(Float, default=0.0)
    weak_areas = Column(JSON, default=list)
    score_history = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

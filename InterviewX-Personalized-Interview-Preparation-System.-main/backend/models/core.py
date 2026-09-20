from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    file_path = Column(String(255))
    parsed_skills = Column(JSON)
    experience_text = Column(Text, nullable=True)
    ats_score = Column(Float)
    feedback = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role_type = Column(String(100))
    score = Column(Float)
    feedback_summary = Column(Text)
    qa_history = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CodingAttempt(Base):
    __tablename__ = "coding_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question_title = Column(String(200))
    code_submitted = Column(Text)
    language = Column(String(50))
    passed = Column(Integer)
    feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

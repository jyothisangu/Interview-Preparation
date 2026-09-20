from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.core import InterviewSession
from agents.interview_agent import interview_agent, PERSONALITY_PROMPTS
from pydantic import BaseModel
from typing import Optional, List, Dict

router = APIRouter()

class QuestionRequest(BaseModel):
    role: str = "SDE"
    context: Optional[List[str]] = None

class AnswerEvaluation(BaseModel):
    question: str
    user_answer: str
    role: str = "SDE"

class AIFollowupRequest(BaseModel):
    question: str
    user_answer: str
    personality: str = "friendly_hr"
    role: str = "SDE"
    conversation_history: Optional[List[Dict]] = None

@router.post("/question")
def get_question(request: QuestionRequest):
    question_data = interview_agent.generate_question(request.role, request.context)
    return {"question": question_data["question"]}

@router.post("/evaluate")
def evaluate_answer(request: AnswerEvaluation, db: Session = Depends(get_db)):
    try:
        evaluation = interview_agent.evaluate_answer(request.question, request.user_answer, request.role)
        return {
            "score": evaluation["score"],
            "feedback": evaluation["feedback"],
            "ideal_answer": evaluation["ideal_answer"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai-followup")
def ai_followup(request: AIFollowupRequest):
    """Get AI-powered personality-driven feedback and follow-up questions."""
    try:
        result = interview_agent.get_ai_response(
            question=request.question,
            user_answer=request.user_answer,
            personality=request.personality,
            role=request.role,
            conversation_history=request.conversation_history
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/personalities")
def get_personalities():
    """Return available interviewer personalities."""
    return {
        key: {
            "name": val["name"],
            "icon": val["icon"],
            "style": val["followup_style"]
        }
        for key, val in PERSONALITY_PROMPTS.items()
    }

class FinalizeRequest(BaseModel):
    user_id: Optional[int] = None
    qa_history: List[Dict]

@router.post("/finalize")
def finalize_interview(request: FinalizeRequest, db: Session = Depends(get_db)):
    """Analyze interview results and update user performance."""
    try:
        analysis = interview_agent.detect_skill_gaps(request.qa_history)
        
        if request.user_id:
            from models.user import User
            user = db.query(User).filter(User.id == request.user_id).first()
            if user:
                user.previous_readiness_score = user.readiness_score
                user.readiness_score = analysis["readiness_score"]
                user.weak_areas = analysis["weak_areas"]
                
                # Update history
                history = list(user.score_history or [])
                history.append(analysis["readiness_score"])
                user.score_history = history[-5:] # Keep last 5
                
                db.commit()
                analysis["score_history"] = user.score_history
        
        return {
            "status": "success",
            "analysis": analysis
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/report")
def get_interview_report(request: FinalizeRequest):
    """Generate a detailed AI report for the interview session."""
    try:
        report = interview_agent.generate_comprehensive_feedback(request.qa_history)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.core import CodingAttempt
from agents.coding_agent import coding_agent
from pydantic import BaseModel

router = APIRouter()

class CodeSubmit(BaseModel):
    question_id: int
    code: str
    language: str

@router.get("/questions")
def get_questions(role: str = "SDE"):
    return coding_agent.get_questions(role)

@router.post("/submit")
def submit_code(submission: CodeSubmit, db: Session = Depends(get_db)):
    try:
        evaluation = coding_agent.evaluate_code(
            submission.code, submission.language, submission.question_id
        )
        attempt = CodingAttempt(
            question_title=str(submission.question_id),
            code_submitted=submission.code,
            language=submission.language,
            passed=1 if evaluation["passed"] else 0,
            feedback=evaluation["feedback"]
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

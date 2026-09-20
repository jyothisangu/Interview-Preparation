from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.core import Resume
from agents.resume_agent import resume_agent
import os
import uuid
import shutil

router = APIRouter()
UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    role: str = Query(default="SDE"),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = resume_agent.parse_pdf(file_path)
        evaluation = resume_agent.evaluate_resume(text, role=role)

        db_resume = Resume(
            file_path=file_path,
            parsed_skills=evaluation["skills"],
            ats_score=evaluation["score"],
            feedback=evaluation["feedback"]
        )
        db.add(db_resume)
        db.commit()
        
        from models.user import User
        u = db.query(User).first()
        if u:
            u.resume_score = evaluation["score"]
            db.commit()

        return {
            "status": "success",
            "score": evaluation["score"],
            "skills": evaluation["skills"],
            "feedback": evaluation["feedback"],
            "missing_keywords": evaluation["missing_keywords"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

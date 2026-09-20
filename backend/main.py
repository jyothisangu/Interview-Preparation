from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models.user
import models.core
from routes import auth, resume, interview, coding, misc

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InterviewX API",
    description="Agentic AI-based platform for interview preparation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
app.include_router(coding.router, prefix="/api/coding", tags=["coding"])
app.include_router(misc.router, prefix="/api", tags=["misc"])






@app.get("/")
def root():
    return {"message": "Welcome to InterviewX API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

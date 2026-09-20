from fastapi import APIRouter
from agents.misc_agents import company_agent, roadmap_agent
from pydantic import BaseModel

router = APIRouter()

class CompanyRequest(BaseModel):
    company_name: str

class RoadmapRequest(BaseModel):
    role: str
    duration_weeks: int = 4

@router.post("/company")
def get_company_prep(request: CompanyRequest):
    return company_agent.get_company_prep(request.company_name)

@router.post("/roadmap")
def get_roadmap(request: RoadmapRequest):
    return roadmap_agent.generate_roadmap(request.role, request.duration_weeks)

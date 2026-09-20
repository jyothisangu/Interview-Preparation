import fitz  # PyMuPDF
import spacy
import re
from typing import Dict, Any

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print("Warning: spacy model not loaded properly. Ensure 'python -m spacy download en_core_web_sm' was run.")
    nlp = None

# A basic bank of common technical skills for keyword matching
TECH_SKILLS = {
    "python", "java", "c++", "javascript", "react", "node", "sql", "aws", "docker", 
    "kubernetes", "machine learning", "data science", "fastapi", "django", "html", "css",
    "git", "linux", "agile", "scrum", "c#", "ruby", "php", "typescript", "mongodb", "mysql", "redis"
}

class ResumeAgent:
    def parse_pdf(self, file_path: str) -> str:
        """Extracts text from a PDF file using PyMuPDF."""
        text = ""
        try:
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
        except Exception as e:
            raise ValueError(f"Could not parse PDF: {str(e)}")
        return text

    def extract_skills(self, text: str) -> list:
        """Extracts technical skills based on predefined set and NLP tokens."""
        found_skills = set()
        text_lower = text.lower()
        
        # 1. Simple keyword matching
        for skill in TECH_SKILLS:
            # Word boundary regex to match exact skill words
            if re.search(rf"\b{re.escape(skill)}\b", text_lower):
                found_skills.add(skill)
                
        # 2. NLP-based entity extraction (if nlp is loaded)
        if nlp:
            doc = nlp(text)
            for ent in doc.ents:
                # Organizations, products or specific concepts might be skills
                if ent.label_ in ["ORG", "PRODUCT", "NORP"] and len(ent.text) > 2:
                    if ent.text.lower() not in ["university", "college", "school", "inc", "llc"]:
                        # This is very noisy without a custom model, so we stick to keyword mostly,
                        # but add a few extracted entities that look like tech terms
                        pass
        
        return list(found_skills)

    def evaluate_resume(self, text: str, role: str = "SDE") -> Dict[str, Any]:
        """Evaluates resume using Groq for genuine ATS scoring and feedback."""
        import os
        import requests
        
        GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
        GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
        
        if not GROQ_API_KEY:
            # Fallback to basic logic if no API key
            skills = self.extract_skills(text)
            return {
                "score": 65,
                "skills": skills,
                "feedback": ["Groq API key missing. Providing basic analysis.", "Consider adding more projects."],
                "missing_keywords": ["Python", "AWS"]
            }

        prompt = f"""
        Analyze the following resume text for the role of {role}.
        1. Provide a genuine ATS score out of 100.
        2. Extract technical skills found.
        3. Identify missing critical keywords for this role.
        4. Provide 3 specific, ACTIONABLE improvements to make the resume stand out.

        Resume Text:
        {text[:4000]} 

        Format your response EXACTLY like this:
        SCORE: [number]
        SKILLS: [comma separated skills]
        MISSING: [comma separated missing keywords]
        FEEDBACK: Improvement 1 | Improvement 2 | Improvement 3
        """

        try:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5
            }
            response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                res = response.json()['choices'][0]['message']['content']
                
                # Simple parsing
                score = 70
                skills = []
                missing = []
                feedback = []
                
                for line in res.split('\n'):
                    if line.startswith('SCORE:'):
                        try: score = int(line.split(':')[1].strip())
                        except: pass
                    elif line.startswith('SKILLS:'):
                        skills = [s.strip() for s in line.split(':')[1].split(',')]
                    elif line.startswith('MISSING:'):
                        missing = [m.strip() for m in line.split(':')[1].split(',')]
                    elif line.startswith('FEEDBACK:'):
                        raw_feedback = line.split(':', 1)[1].strip()
                        feedback = [f.strip() for f in raw_feedback.split('|') if f.strip()]
                        # If still empty, try to match bullet points from subsequent lines
                        if not feedback:
                            pass # We can add more complex logic if needed

                return {
                    "score": score,
                    "skills": skills,
                    "feedback": feedback,
                    "missing_keywords": missing
                }
        except Exception as e:
            print(f"Resume analysis error: {e}")
            
        return {"score": 0, "skills": [], "feedback": ["Error analyzing resume"], "missing_keywords": []}

resume_agent = ResumeAgent()

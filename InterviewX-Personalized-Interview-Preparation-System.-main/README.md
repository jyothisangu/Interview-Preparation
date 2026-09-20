# 🚀 InterviewX - AI-Driven Personalized Interview Preparation System

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rawhan1819/InterviewX-Personalized-Interview-Preparation-System./blob/main/LICENSE)
[![AI Engine](https://img.shields.io/badge/AI-Groq_Llama_3.3-orange.svg)](https://groq.com/)
[![Platform](https://img.shields.io/badge/Platform-Vignan_University-red.svg)](https://vignan.ac.in/)

**InterviewX** is a cutting-edge, agentic AI platform designed to bridge the gap between academic preparation and professional industry standards. Tailored for students at **Vignan's Foundation for Science, Technology & Research**, it leverages a sophisticated Multi-Agent System (MAS) to provide an immersive, adaptive, and deeply analytical interview preparation experience.

---

## 🌟 Real-World Solutions
- **The "Experience Gap"**: Traditional preparation often lacks the pressure and nuance of real interviews. InterviewX provides a high-fidelity 3D simulation with dynamic NLP-driven conversations.
- **Vague Feedback**: Instead of generic scores, our AI provides actionable updates—identifying exactly which keywords are missing from a resume and why a specific follow-up question was asked.
- **Skill Fragmentation**: By embedding **SkillForge**, the platform integrates learning (quizzes/coding) directly into the preparation workflow, ensuring users can "Practice then Perform" in one unified interface.
- **Adaptive Difficulty**: The platform monitors real-time performance and adjusts question depth (e.g., system design fundamentals vs. deep-dive scaling) to push candidates to their limits.

---

## 🛠️ Key Features

### 🏴‍☠️ Luffy AI Interviewer (3D Avatar)
A custom-built, professional-grade 3D interviewer modeled after **Luffy (One Piece)** in a formal suit.
- **Dynamic Gestures**: Synchronized hand and facial movements powered by R3F.
- **NLP Interaction**: Real-time voice and text interaction with sentiment-aware responses.
- **Adaptive Follow-ups**: Explains the *reasoning* behind every follow-up question.

### 📄 Intelligent Resume Analytics
- **ATS Genuine Scoring**: Industry-standard evaluation of resume impact and formatting.
- **Keyword Gap Analysis**: Identifies critical missing industry keywords for specific roles (SDE, Frontend, Data Science).
- **Actionable Improvements**: 3 specific, data-driven updates suggested for every resume upload.

### 💻 Integrated Coding & Skill Development
- **SkillForge Integration**: Seamlessly practice DSA, system design, and technical quizzes inside the platform.
- **Real-time IDE**: Monaco-based code editor with automated evaluation and AI-driven complexity analysis.

### 📊 Performance Ecosystem
- **Rolling Trends**: Visualizes improvement across the last 5 sessions (e.g., `5.5 → 6.8 → 7.2`).
- **Qualitative Summaries**: Comprehensive session wrap-ups (e.g., "Strong in core Java, but needs improvement in distributed systems explanation").
- **Readiness Score**: A live metric updated after every interview to track placement eligibility.

---

## ⚙️ Technical Architecture

### Multi-Agent Orchestration
InterviewX operates using specialized AI agents built on **FastAPI** and powered by **Groq (Llama-3.3-70B)**:
1. **Resume Agent**: Parses PDF/Text and matches against role taxonomies.
2. **Interview Agent**: Manages conversation state, context retention, and follow-up logic.
3. **Coding Agent**: Evaluates algorithmic logic and code quality beyond basic test cases.
4. **Analytics Agent**: Aggregates cross-session data for trend visualization.

### Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **3D Graphics**: React Three Fiber, Three.js, React Three Drei.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy, Uvicorn.
- **Database**: SQLite (SQLAlchemy ORM) with JSON-based history tracking.
- **AI/NLP**: Groq Cloud SDK, Classical NLP (TF-IDF for similarity).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Rawhan1819/InterviewX-Personalized-Interview-Preparation-System..git
   cd InterviewX
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # Create .env and add GROQ_API_KEY
   python main.py
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
---
---

## 🏢 Academic Branding
This project is officially branded for **Vignan's Foundation for Science, Technology & Research**. All authentication and dashboard layouts utilize the university's official design language and visual identity.

## 👨‍💻 Author
**Rawhan Ramzi Mohammed**
[GitHub Profile](https://github.com/Rawhan1819) | [LinkedIn](https://www.linkedin.com/in/rawhan-ramzi-mohammed-42861a257/)

---
*InterviewX - Empowering the next generation of engineers through Agentic AI.*

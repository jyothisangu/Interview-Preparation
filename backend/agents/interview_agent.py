from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, Any, Optional
import random
import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN", "")
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# ─── Personality System Prompts ─────────────────────────────────────────
PERSONALITY_PROMPTS = {
    "strict_faang": {
        "name": "Strict FAANG Interviewer",
        "icon": "🔥",
        "system": (
            "You are a strict, senior FAANG interviewer at Google/Meta. You are cold, precise, and demanding. "
            "You expect quantified metrics, Big-O analysis, and concrete examples. If the candidate gives a vague answer, "
            "you push back hard: 'That's too vague. Give me numbers.' 'What was the exact complexity?' "
            "You never praise unless the answer is truly exceptional. You interrupt with tough follow-ups. "
            "Keep responses under 3 sentences. Be direct and intimidating but professional."
        ),
        "followup_style": "aggressive_technical"
    },
    "friendly_hr": {
        "name": "Friendly HR",
        "icon": "😊",
        "system": (
            "You are a warm, encouraging HR interviewer. You make the candidate feel comfortable and safe. "
            "You give positive reinforcement: 'That's a great start!' 'I love how you framed that.' "
            "You ask soft follow-ups to help the candidate elaborate: 'Could you tell me more about how that felt?' "
            "You focus on cultural fit, teamwork, and communication. Be supportive and empathetic. "
            "Keep responses under 3 sentences. Always find something positive to highlight."
        ),
        "followup_style": "supportive_behavioral"
    },
    "startup_founder": {
        "name": "Startup Founder",
        "icon": "🚀",
        "system": (
            "You are a fast-paced, visionary startup founder interviewing a potential early employee. "
            "You care about passion, speed, ownership, and 'getting things done'. You ask rapid-fire questions. "
            "You want to know: 'Can you ship fast?' 'Would you work weekends if the product needed it?' "
            "You test for creativity and scrappiness. You're informal but intense. "
            "Keep responses under 3 sentences. Show excitement when the candidate shows hustle."
        ),
        "followup_style": "rapid_creative"
    },
    "aggressive_panelist": {
        "name": "Aggressive Panelist",
        "icon": "😤",
        "system": (
            "You are a confrontational, skeptical panel interviewer. You challenge EVERYTHING the candidate says. "
            "You interrupt: 'Wait, that doesn't add up.' 'I disagree with that approach entirely.' "
            "You play devil's advocate aggressively. You test stress tolerance and ability to defend decisions under pressure. "
            "If the candidate says they 'optimized' something, you demand proof: 'Optimized by how much? Prove it.' "
            "Keep responses under 3 sentences. Be relentless but fair."
        ),
        "followup_style": "confrontational"
    }
}

# ─── Expanded Question Bank ────────────────────────────────────────────
QUESTION_BANK = {
    "SDE": [
        {
            "question": "Explain the difference between a process and a thread.",
            "ideal_answer": "A process is an executing program with its own memory space. A thread is a lightweight sub-process that shares memory and resources with other threads within the same process. Context switching between threads is faster than between processes."
        },
        {
            "question": "What is polymorphism in Object-Oriented Programming?",
            "ideal_answer": "Polymorphism allows objects of different classes to be treated as objects of a common superclass. It means 'many forms' and is typically achieved through method overriding (runtime) and method overloading (compile-time)."
        },
        {
            "question": "How does a hash map work?",
            "ideal_answer": "A hash map uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found. It provides O(1) average time complexity for lookups, insertions, and deletions, handling collisions via chaining or open addressing."
        },
        {
            "question": "Explain the concept of database indexing and when you would use it.",
            "ideal_answer": "Database indexing creates a data structure (like B-tree or hash index) that improves the speed of data retrieval operations at the cost of additional writes and storage space. Use indexing on columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY operations."
        },
        {
            "question": "What is the CAP theorem and how does it apply to distributed systems?",
            "ideal_answer": "CAP theorem states that a distributed system can only provide two of three guarantees: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition tolerance (system continues operating despite network failures). In practice, you must choose between CP or AP systems."
        },
        {
            "question": "Describe the differences between REST and GraphQL APIs.",
            "ideal_answer": "REST uses fixed endpoints returning predefined data structures, while GraphQL uses a single endpoint where clients specify exactly what data they need. GraphQL reduces over-fetching and under-fetching, supports real-time subscriptions, and provides strong typing, but has complexity in caching and rate limiting."
        }
    ],
    "ML": [
        {
            "question": "What is the bias-variance tradeoff?",
            "ideal_answer": "The bias-variance tradeoff is the balance between a model's ability to minimize errors from erroneous assumptions (bias) and its ability to minimize errors from sensitivity to fluctuations in the training set (variance). High bias causes underfitting, high variance causes overfitting."
        },
        {
            "question": "Explain gradient descent and its variants.",
            "ideal_answer": "Gradient descent is an optimization algorithm that iteratively adjusts parameters in the direction of steepest descent of the loss function. Variants include batch GD (uses all data), stochastic GD (uses one sample), and mini-batch GD (uses a subset). Advanced optimizers like Adam combine momentum and adaptive learning rates."
        }
    ],
    "FRONTEND DEV": [
        {
            "question": "Explain the Virtual DOM and how React uses it.",
            "ideal_answer": "The Virtual DOM is a lightweight in-memory representation of the real DOM. React creates a virtual copy, computes diffs when state changes (reconciliation), and batch-updates only the changed real DOM nodes. This minimizes expensive DOM operations and improves performance."
        }
    ],
    "BACKEND DEV": [
        {
            "question": "How would you design a rate limiter for an API?",
            "ideal_answer": "Implement using token bucket or sliding window algorithm. Track requests per client using Redis with TTL keys. Set limits per endpoint (e.g., 100 req/min). Return 429 status with Retry-After header. Consider distributed rate limiting across multiple server instances using a shared cache."
        }
    ],
    "DATA SCIENTIST": [
        {
            "question": "How do you handle imbalanced datasets?",
            "ideal_answer": "Techniques include SMOTE (Synthetic Minority Oversampling), undersampling majority class, using class weights in the loss function, ensemble methods like balanced random forests, and evaluation metrics suited for imbalance like F1-score, precision-recall AUC, and Matthews correlation coefficient."
        }
    ],
    "PRODUCT MANAGER": [
        {
            "question": "How would you prioritize features for a new product launch?",
            "ideal_answer": "Use frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW (Must-have, Should-have, Could-have, Won't-have). Gather data from user research, competitive analysis, and business goals. Prioritize features that deliver maximum user value with minimum engineering effort. Always align with OKRs."
        }
    ]
}


class InterviewAgent:
    """Hybrid interview agent: TF-IDF for scoring + HuggingFace for AI personality responses."""

    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def generate_question(self, role: str, context: list = None) -> str:
        """Fetch a random question based on role, avoiding repeats from context."""
        questions = QUESTION_BANK.get(role.upper(), QUESTION_BANK["SDE"])
        if context:
            # Filter out already-asked questions
            available = [q for q in questions if q["question"] not in context]
            if not available:
                available = questions  # Reset if all asked
        else:
            available = questions
        return random.choice(available)

    def evaluate_answer(self, question: str, user_answer: str, role: str) -> Dict[str, Any]:
        """Evaluates an answer against the ideal answer using TF-IDF Cosine Similarity."""
        # Find the ideal answer
        questions = QUESTION_BANK.get(role.upper(), QUESTION_BANK["SDE"])
        ideal_answer = None
        for q in questions:
            if q["question"] == question:
                ideal_answer = q["ideal_answer"]
                break

        if not ideal_answer:
            return {"score": 0, "feedback": "Question not found in bank."}

        # Calculate similarity
        tfidf_matrix = self.vectorizer.fit_transform([ideal_answer, user_answer])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        # Scale similarity to a 0-10 score
        score = min(round(similarity * 15, 1), 10.0) # Multiply by 15 to be generous with keyword matching

        # Generate feedback rules
        feedback = "Good attempt."
        if score > 8:
            feedback = "Excellent answer! You hit the key technical points."
        elif score > 5:
            feedback = "Good answer, but you could include more specific technical terminology."
        else:
            feedback = "Your answer missed several key concepts. Review the core definitions."

        return {
            "score": score,
            "feedback": feedback,
            "ideal_answer": ideal_answer
        }

    def get_ai_response(
        self,
        question: str,
        user_answer: str,
        personality: str,
        role: str,
        conversation_history: list = None
    ) -> Dict[str, Any]:
        """
        Calls HuggingFace Inference API to generate personality-driven AI feedback
        and follow-up questions.
        """
        persona = PERSONALITY_PROMPTS.get(personality, PERSONALITY_PROMPTS["friendly_hr"])

        # Build the prompt for the instruction-tuned model
        history_context = ""
        if conversation_history:
            for entry in conversation_history[-3:]:  # Last 3 exchanges for context
                history_context += f"Q: {entry.get('question', '')}\nA: {entry.get('answer', '')}\n"

        prompt = f"""
You are interviewing a candidate for the role of {role}.

{f"Previous exchanges:{chr(10)}{history_context}" if history_context else ""}

The interview question was: "{question}"

The candidate answered: "{user_answer}"

Now respond IN CHARACTER as the {persona['name']}. {persona['system']}

Your response MUST include:
1. REACTION: A brief reaction to their answer (1-2 sentences, matching your personality)
2. REASON: A one-line explanation of WHY you are asking the follow-up question (e.g., "Reason: You did not clearly explain the core concept and missed time complexity reasoning.")
3. FOLLOWUP: A follow-up question or challenge (1 sentence)
4. RATING: A confidence rating of 1-10 for how well they answered

Format your response EXACTLY like this:
REACTION: [your reaction]
REASON: [your reason]
FOLLOWUP: [your follow-up question]
RATING: [number 1-10]"""

        try:
            if not GROQ_API_KEY:
                return self._fallback_response(question, user_answer, persona, role)

            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": persona['system']},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 300
            }

            response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)

            if response.status_code == 200:
                result = response.json()
                generated_text = result['choices'][0]['message']['content']
                parsed = self._parse_ai_response(generated_text, persona)
                return parsed
            else:
                print(f"Groq API error: {response.status_code} - {response.text}")
                return self._fallback_response(question, user_answer, persona, role)

        except Exception as e:
            print(f"Groq API error: {e}")
            return self._fallback_response(question, user_answer, persona, role)

        except Exception as e:
            print(f"HuggingFace API error: {e}")
            return self._fallback_response(question, user_answer, persona, role)

    def _parse_ai_response(self, text: str, persona: dict) -> Dict[str, Any]:
        """Parse structured AI response into components."""
        reaction = ""
        reason = ""
        followup = ""
        rating = 5

        lines = text.strip().split("\n")
        for line in lines:
            line = line.strip()
            if line.upper().startswith("REACTION:"):
                reaction = line[len("REACTION:"):].strip()
            elif line.upper().startswith("REASON:"):
                reason = line[len("REASON:"):].strip()
            elif line.upper().startswith("FOLLOWUP:"):
                followup = line[len("FOLLOWUP:"):].strip()
            elif line.upper().startswith("RATING:"):
                try:
                    rating_str = line[len("RATING:"):].strip()
                    import re
                    nums = re.findall(r'\d+', rating_str)
                    if nums:
                        rating = min(int(nums[0]), 10)
                except:
                    rating = 5

        return {
            "reaction": reaction or f"Interesting response. Let me evaluate that.",
            "reason": reason or "To probe deeper into your understanding of the core concept.",
            "followup": followup or "Can you elaborate on your approach?",
            "ai_rating": rating,
            "personality": persona["name"],
            "personality_icon": persona["icon"]
        }

    def _fallback_response(self, question: str, user_answer: str, persona: dict, role: str) -> Dict[str, Any]:
        """Generate a fallback response when HuggingFace API is unavailable."""
        # Use TF-IDF score to generate personality-appropriate response
        eval_result = self.evaluate_answer(question, user_answer, role)
        score = eval_result.get("score", 5)

        fallback_responses = {
            "strict_faang": {
                "high": "Acceptable. But can you prove that with production numbers and real-world metrics?",
                "mid": "Too surface-level. I need you to go deeper — what's the Big-O and why does it matter at scale?",
                "low": "That's not what I was looking for at all. Let's start over — define the core concept first."
            },
            "friendly_hr": {
                "high": "That was really well articulated! I can tell you have strong experience here. 😊",
                "mid": "Great start! I'd love to hear a bit more about how you applied this in practice.",
                "low": "No worries at all — this is a learning opportunity. Let me give you a hint to help you get there."
            },
            "startup_founder": {
                "high": "Love the energy! That's the kind of thinking we need. Can you ship that in a week?",
                "mid": "Interesting, but can you move faster? In a startup, speed beats perfection. How would you hack this?",
                "low": "Hmm, we need people who can figure things out fast. What would you Google first to solve this?"
            },
            "aggressive_panelist": {
                "high": "Alright, that's decent. But I still disagree with your second point — defend it.",
                "mid": "Wait, that doesn't add up. You said X but then contradicted yourself. Which is it?",
                "low": "I'm going to be direct — that answer shows a gap in fundamentals. Convince me otherwise."
            }
        }

        personality_key = next(
            (k for k, v in PERSONALITY_PROMPTS.items() if v["name"] == persona["name"]),
            "friendly_hr"
        )
        responses = fallback_responses.get(personality_key, fallback_responses["friendly_hr"])

        if score > 7:
            reaction = responses["high"]
        elif score > 4:
            reaction = responses["mid"]
        else:
            reaction = responses["low"]

        followup_questions = {
            "strict_faang": "Walk me through the exact time complexity analysis, step by step.",
            "friendly_hr": "Could you share a specific example from your experience that relates to this?",
            "startup_founder": "If you had to build this from scratch in 48 hours, what would you prioritize?",
            "aggressive_panelist": "I've seen candidates fail this question before. What makes your approach different?"
        }

        return {
            "reaction": reaction,
            "reason": "To explore the practical application of your answer.",
            "followup": followup_questions.get(personality_key, "Can you elaborate further?"),
            "ai_rating": round(score),
            "personality": persona["name"],
            "personality_icon": persona["icon"]
        }

    def detect_skill_gaps(self, qa_history: list) -> Dict[str, Any]:
        """Analyzes QA history to detect weak areas and calculate a readiness score."""
        if not qa_history:
            return {"weak_areas": [], "score_impact": 0}

        # Simplified logic for gap detection based on scores
        gaps = []
        total_score = 0
        
        # Mapping common topics to roles
        topic_map = {
            "process vs thread": "OS Fundamentals",
            "polymorphism": "OOP Concepts",
            "hash map": "Data Structures",
            "indexing": "Database Design",
            "CAP theorem": "Distributed Systems",
            "REST vs GraphQL": "API Design",
            "bias-variance": "ML Fundamentals",
            "Virtual DOM": "Frontend Frameworks",
            "rate limiter": "System Design"
        }

        for entry in qa_history:
            q = entry.get("question", "").lower()
            score = entry.get("evaluation", {}).get("score", 0)
            total_score += score
            
            if score < 5:
                for keyword, topic in topic_map.items():
                    if keyword in q:
                        gaps.append(topic)
                        break
                else:
                    gaps.append("General Fundamentals")

        avg_score = (total_score / len(qa_history)) * 10 # Scale to 100
        
        # Unique and relevant gaps
        unique_gaps = list(set(gaps))[:3]
        
        return {
            "weak_areas": unique_gaps,
            "readiness_score": round(avg_score, 1)
        }

    def generate_comprehensive_feedback(self, qa_history: list) -> Dict[str, Any]:
        """Generates a detailed feedback report using Groq based on QA history."""
        if not qa_history:
            return {
                "strengths": ["No interview data available yet."],
                "weaknesses": ["Complete a mock interview to get feedback."],
                "communication_tips": ["Always speak clearly and maintain structure."],
                "readiness_score": 0
            }

        history_text = "\n".join([f"Q: {h['question']}\nA: {h['answer']}\nScore: {h['evaluation']['score']}/10" for h in qa_history])

        prompt = f"""
        Analyze the following mock interview transcript and provide a comprehensive feedback report.
        Transcript:
        {history_text}

        Your response MUST include:
        1. STRENGTHS: 3 bullet points highlighting what the candidate did well.
        2. WEAKNESSES: 3 bullet points highlighting technical or behavioral gaps.
        3. TIPS: 3 actionable communication tips.
        4. SCORE: A final readiness score out of 100.
        5. SUMMARY: 3 bullet points summarizing the overall session (e.g. Strong in basics, Weak in depth).

        Format your response EXACTLY like this:
        STRENGTHS: [point 1] | [point 2] | [point 3]
        WEAKNESSES: [point 1] | [point 2] | [point 3]
        TIPS: [tip 1] | [tip 2] | [tip 3]
        SCORE: [number]
        SUMMARY: [point 1] | [point 2] | [point 3]
        """

        try:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.6
            }
            response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                res = response.json()['choices'][0]['message']['content']
                
                strengths, weaknesses, tips, summary, score = [], [], [], [], 70
                
                for line in res.split('\n'):
                    if line.startswith('STRENGTHS:'):
                        strengths = [s.strip() for s in line.split(':')[1].split('|')]
                    elif line.startswith('WEAKNESSES:'):
                        weaknesses = [w.strip() for w in line.split(':')[1].split('|')]
                    elif line.startswith('TIPS:'):
                        tips = [t.strip() for t in line.split(':')[1].split('|')]
                    elif line.startswith('SUMMARY:'):
                        summary = [s.strip() for s in line.split(':')[1].split('|')]
                    elif line.startswith('SCORE:'):
                        try: score = int(line.split(':')[1].strip())
                        except: pass

                return {
                    "strengths": strengths,
                    "weaknesses": weaknesses,
                    "communication_tips": tips,
                    "session_summary": summary,
                    "readiness_score": score
                }
        except Exception as e:
            print(f"Comprehensive feedback error: {e}")
            
        return {
            "strengths": ["Good effort"],
            "weaknesses": ["Needs more detail"],
            "communication_tips": ["Be more specific"],
            "readiness_score": 50
        }


interview_agent = InterviewAgent()

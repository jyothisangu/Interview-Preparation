import subprocess
import os
import tempfile
from typing import Dict, Any

CODING_QUESTIONS = [
    {
        "id": 1,
        "title": "Two Sum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "difficulty": "Easy",
        "test_cases": [
            {"input": "([2, 7, 11, 15], 9)", "expected_output": "[0, 1]"},
            {"input": "([3, 2, 4], 6)", "expected_output": "[1, 2]"}
        ]
    }
]

class CodingAgent:
    def get_questions(self, role: str):
        return CODING_QUESTIONS

    def evaluate_code(self, code: str, language: str, question_id: int) -> Dict[str, Any]:
        """Evaluates python code against test cases using local subprocess."""
        if language.lower() != "python":
            return {"passed": False, "feedback": "Currently only Python is supported."}
            
        question = next((q for q in CODING_QUESTIONS if q["id"] == question_id), None)
        if not question:
            return {"passed": False, "feedback": "Question not found."}
            
        # We inject test cases at the bottom of their code
        passed_all = True
        feedback_messages = []
        
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as temp_file:
            # Write user code
            temp_file.write(code)
            temp_file.write("\n\n")
            
            # Write a simple test runner
            temp_file.write("try:\n")
            for i, tc in enumerate(question["test_cases"]):
                # This assumes they named their function 'twoSum'
                temp_file.write(f"    res = twoSum(*{tc['input']})\n")
                temp_file.write(f"    assert str(res) == '{tc['expected_output']}', f'Test case {i+1} failed: expected {tc['expected_output']} got {{res}}'\n")
            temp_file.write("    print('ALL_PASSED')\n")
            temp_file.write("except Exception as e:\n")
            temp_file.write("    print(e)\n")
            
            temp_path = temp_file.name

        try:
            # Run the file
            result = subprocess.run(["python", temp_path], capture_output=True, text=True, timeout=5)
            output = result.stdout.strip()
            os.remove(temp_path)
            
            passed = "ALL_PASSED" in output
            test_feedback = "All test cases passed!" if passed else (output or result.stderr.strip())

            # Now get AI Review from Groq
            GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
            GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
            import requests

            ai_feedback = ""
            if GROQ_API_KEY:
                prompt = f"""
                Review the following Python code for the problem: "{question['title']}" ({question['description']}).
                The local test cases resulted in: {test_feedback}

                Code:
                {code}

                Provide a 2-sentence genuine code review focusing on:
                1. Logic correctness.
                2. Time/Space complexity or potential optimizations.
                """
                try:
                    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
                    payload = {
                        "model": "llama-3.3-70b-versatile",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3
                    }
                    ai_res = requests.post(GROQ_URL, headers=headers, json=payload, timeout=10)
                    if ai_res.status_code == 200:
                        ai_feedback = ai_res.json()['choices'][0]['message']['content']
                except:
                    pass

            return {
                "passed": passed,
                "test_feedback": test_feedback,
                "ai_review": ai_feedback or "Code submitted for evaluation."
            }
        except subprocess.TimeoutExpired:
            if os.path.exists(temp_path): os.remove(temp_path)
            return {"passed": False, "test_feedback": "Execution timed out.", "ai_review": "Your code might have an infinite loop or inefficient recursion."}
        except Exception as e:
            if os.path.exists(temp_path): os.remove(temp_path)
            return {"passed": False, "test_feedback": str(e), "ai_review": "Technical error during evaluation."}

coding_agent = CodingAgent()

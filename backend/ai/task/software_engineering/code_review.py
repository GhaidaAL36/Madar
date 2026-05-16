import os
import json
from groq import Groq

class CodeReviewTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "مراجعة الكود"
        self.duration = "25-30 دقيقة"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Code Review task in Software Engineering.
The student already read this explanation about the major:
{major_explanation}

All text must be in Arabic except programming terms like Code Review, Bug, Function, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "مراجعة الكود Code Review",
  "concept_explanation": "شرح بسيط بالعربي لما هو الـ Code Review، 3-4 جمل، بناءً على ما قرأه الطالب",
  "real_world_example": "مثال حقيقي بالعربي لكيف يتم الـ Code Review في فريق برمجي حقيقي",
  "what_will_be_tested": "أخبر الطالب بالعربي بالضبط ماذا سيفعل في هذه المهمة"
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=800
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

    def generateTask(self, concept: dict, major_explanation: str) -> dict:
        prompt = f"""
You are creating a beginner code review task for a Software Engineering student.
The student read this major explanation:
{major_explanation}

And just learned this concept:
{json.dumps(concept, indent=2, ensure_ascii=False)}

IMPORTANT RULES:
- All text must be in Arabic except programming terms like Code Review, Bug, Function, etc.
- The questions must be very simple, a student with zero experience can answer them after reading the explanation
- The choices must be clear and not confusing
- Give them a simple Python code snippet to review

Respond ONLY in valid JSON, no extra text:
{{
  "task_title": "مراجعة الكود",
  "task_description": "وصف قصير بالعربي لما سيفعله الطالب",
  "estimated_time": "25-30 دقيقة",
  "code_snippet": "كود Python بسيط للمراجعة",
  "instructions": "تعليمات بسيطة بالعربي",
  "questions": [
    {{
      "id": 1,
      "question": "السؤال بالعربي",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "B"
    }},
    {{
      "id": 2,
      "question": "السؤال بالعربي",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "A"
    }},
    {{
      "id": 3,
      "question": "السؤال بالعربي",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "C"
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
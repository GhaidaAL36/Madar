import os
import json
from groq import Groq

class WriteFunctionTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "كتابة دالة"
        self.duration = "20-25 دقيقة"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Function Writing task in Software Engineering.
The student already read this explanation about the major:
{major_explanation}

Based on that explanation, explain what Functions are in more detail.
Use real software examples only, no food analogies.
All text must be in Arabic except programming terms like Function, def, return, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "كتابة دالة Function",
  "concept_explanation": "شرح بسيط بالعربي لما هي الـ Function، 3-4 جمل، بناءً على ما قرأه الطالب",
  "real_world_example": "مثال حقيقي بالعربي لـ Function مستخدمة في برنامج حقيقي",
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
You are creating a beginner function writing task for a Software Engineering student.
The student read this major explanation:
{major_explanation}

And just learned this concept:
{json.dumps(concept, indent=2, ensure_ascii=False)}

IMPORTANT RULES:
- All text must be in Arabic except programming terms like def, return, Function, etc.
- The questions must be very simple, a student with zero experience can answer them after reading the explanation
- The choices must be clear and not confusing

Respond ONLY in valid JSON, no extra text:
{{
  "task_title": "كتابة دالة",
  "task_description": "وصف قصير بالعربي لما سيفعله الطالب",
  "estimated_time": "20-25 دقيقة",
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
      "correct_answer": "C"
    }},
    {{
      "id": 3,
      "question": "السؤال بالعربي",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "A"
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
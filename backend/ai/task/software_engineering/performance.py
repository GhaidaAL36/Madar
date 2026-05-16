import os
import json
from groq import Groq

class PerformanceTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "تحسين الأداء"
        self.duration = "35-40 دقيقة"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Performance Optimization task in Software Engineering.
The student already read this explanation about the major:
{major_explanation}

All text must be in Arabic except programming terms like Performance, Optimization, loop, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "تحسين الأداء Performance Optimization",
  "concept_explanation": "شرح بسيط بالعربي لما هو تحسين الأداء، 3-4 جمل، بناءً على ما قرأه الطالب",
  "real_world_example": "مثال حقيقي بالعربي لكود بطيء وكيف تم تحسينه",
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
You are creating a beginner performance optimization task for a Software Engineering student.
The student read this major explanation:
{major_explanation}

And just learned this concept:
{json.dumps(concept, indent=2, ensure_ascii=False)}

IMPORTANT RULES:
- All text must be in Arabic except programming terms like loop, Performance, Optimization, etc.
- The questions must ONLY be based on what is written in the major explanation, nothing extra
- A student who only read the explanation should be able to answer all questions
- Do not ask about technical details that were not mentioned in the explanation
- Keep the code snippet very simple and directly related to what was explained
- The correct answer must be obvious to someone who read the explanation

Respond ONLY in valid JSON, no extra text:
{{
  "task_title": "تحسين الأداء",
  "task_description": "وصف قصير بالعربي لما سيفعله الطالب",
  "estimated_time": "35-40 دقيقة",
  "code_snippet": "كود Python بطيء بسيط",
  "instructions": "تعليمات بسيطة بالعربي",
  "questions": [
    {{
      "id": 1,
      "question": "السؤال بالعربي",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "A"
    }},
    {{
      "id": 2,
      "question": "السؤال بالعربي",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "B"
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
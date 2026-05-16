import os
import json
from groq import Groq

class CleanDataTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "تنظيف البيانات"
        self.duration = "20-25 دقيقة"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Data Cleaning task in Data Science.
The student already read this explanation about the major:
{major_explanation}

All text must be in Arabic except programming terms like null, None, Data Cleaning, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "تنظيف البيانات Data Cleaning",
  "concept_explanation": "شرح بسيط بالعربي لما هو تنظيف البيانات، 3-4 جمل، بناءً على ما قرأه الطالب",
  "real_world_example": "مثال حقيقي بالعربي لبيانات غير نظيفة وكيف تم تنظيفها",
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
You are creating a beginner data cleaning task for a Data Science student.
The student read this major explanation:
{major_explanation}

And just learned this concept:
{json.dumps(concept, indent=2, ensure_ascii=False)}

IMPORTANT RULES:
- All text must be in Arabic except programming terms like null, None, Data Cleaning, etc.
- Generate a small messy dataset with 5 rows and 3 columns: الاسم, العمر, الراتب
- The dataset must contain: exactly ONE null value, exactly ONE obviously wrong value (age 999 ONLY, no other wrong values), and ONE duplicate row
- All other values in the table must be completely normal and realistic
- Never use 0 or negative numbers, only use 999 for wrong age
- The null value and the wrong value must be in DIFFERENT rows, never in the same row
- The duplicate rows must be placed next to each other so the user can clearly see the repetition
- Each problem must be in a different row so each question has a unique answer
- The questions must be directly about the generated dataset
- A student who only read the explanation should be able to answer all questions
- The correct answer must be obvious just from looking at the table
- Use real common Arabic names like أحمد, سارة, محمد, نورة, خالد, ريم, عمر

Respond ONLY in valid JSON, no extra text:
{{
  "task_title": "تنظيف البيانات",
  "task_description": "وصف قصير بالعربي لما سيفعله الطالب",
  "estimated_time": "20-25 دقيقة",
  "instructions": "تعليمات بسيطة بالعربي",
  "table_columns": ["الاسم", "العمر", "الراتب"],
  "table": [
    {{"الاسم": "أحمد", "العمر": 25, "الراتب": 5000}},
    {{"الاسم": "سارة", "العمر": 999, "الراتب": 7000}},
    {{"الاسم": "محمد", "العمر": 30, "الراتب": null}},
    {{"الاسم": "نورة", "العمر": 28, "الراتب": 6000}},
    {{"الاسم": "نورة", "العمر": 28, "الراتب": 6000}}
  ],
  "questions": [
    {{
      "id": 1,
      "question": "سؤال بالعربي عن القيمة الخاطئة في الجدول",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "A"
    }},
    {{
      "id": 2,
      "question": "سؤال بالعربي عن القيمة المفقودة في الجدول",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "C"
    }},
    {{
      "id": 3,
      "question": "سؤال بالعربي عن الصف المكرر في الجدول",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "B"
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
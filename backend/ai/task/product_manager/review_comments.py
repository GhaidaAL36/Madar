import os
import json
from groq import Groq

class ReviewCommentsTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "مراجعة تعليقات المستخدمين"
        self.duration = "20-25 دقيقة"

    def explainConcept(self, job_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a User Comments Review task in Product Management.
The student already read this explanation about the job:
{job_explanation}

All text must be in Arabic except programming terms like Bug, UX, PRD, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "مراجعة تعليقات المستخدمين User Comments Review",
  "concept_explanation": "شرح بسيط بالعربي لما هي مراجعة تعليقات المستخدمين، 3-4 جمل، بناءً على ما قرأه الطالب",
  "real_world_example": "مثال حقيقي بالعربي لكيف يستخدم مدير المنتج تعليقات المستخدمين لاتخاذ قرارات",
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

    def generateTask(self, concept: dict, job_explanation: str) -> dict:
        prompt = f"""
You are creating a beginner user comments review task for a Product Manager student.
The student read this job explanation:
{job_explanation}

And just learned this concept:
{json.dumps(concept, indent=2, ensure_ascii=False)}

IMPORTANT RULES:
- All text must be in Arabic except terms like Bug, UX, Feature, etc.
- Give the student 5 realistic user comments about an app
- Each comment must have a category: bug, feature, ux, or performance
- The questions must be directly based on the comments
- A student who only read the explanation should be able to answer all questions
- The correct answer must be obvious from reading the comments
- The wrong choices must be clearly wrong
- The choices must always have A. B. C. D. labels

Respond ONLY in valid JSON, no extra text:
{{
  "task_title": "مراجعة تعليقات المستخدمين",
  "task_description": "وصف قصير بالعربي لما سيفعله الطالب",
  "estimated_time": "20-25 دقيقة",
  "instructions": "تعليمات بسيطة بالعربي",
  "comments": [
    {{"id": "1", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "bug", "date": "2024-01-15"}},
    {{"id": "2", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "feature", "date": "2024-01-15"}},
    {{"id": "3", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "ux", "date": "2024-01-14"}},
    {{"id": "4", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "performance", "date": "2024-01-14"}},
    {{"id": "5", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "bug", "date": "2024-01-13"}}
  ],
  "questions": [
    {{
      "id": 1,
      "question": "ما هي المشكلة الأكثر تكراراً في التعليقات؟",
      "choices": ["A. خيار أول", "B. خيار ثاني", "C. خيار ثالث", "D. خيار رابع"],
      "correct_answer": "A"
    }},
    {{
      "id": 2,
      "question": "ما هي التعليقات التي يجب معالجتها أولاً؟",
      "choices": ["A. تعليقات الـ Bug", "B. تعليقات الـ Feature", "C. تعليقات الـ UX", "D. تعليقات الـ Performance"],
      "correct_answer": "A"
    }},
    {{
      "id": 3,
      "question": "سؤال بالعربي مباشرة عن التعليقات",
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
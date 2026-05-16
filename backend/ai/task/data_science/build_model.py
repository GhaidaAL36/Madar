import os
import json
from groq import Groq

class BuildModelTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "بناء نموذج"
        self.duration = "30-40 دقيقة"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Predictive Model Building task in Data Science.
The student already read this explanation about the major:
{major_explanation}

All text must be in Arabic except programming terms like Model, Linear Regression, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "بناء نموذج تنبؤي Predictive Model",
  "concept_explanation": "شرح بسيط بالعربي لما هو النموذج التنبؤي، 3-4 جمل، بناءً على ما قرأه الطالب",
  "real_world_example": "مثال حقيقي بالعربي لنموذج تنبؤي مستخدم في الواقع",
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
You are creating a beginner predictive model task for a Data Science student.
The student read this major explanation:
{major_explanation}

And just learned this concept:
{json.dumps(concept, indent=2, ensure_ascii=False)}

IMPORTANT RULES:
- All text must be in Arabic except programming terms like Model, Linear Regression, etc.
- Do NOT ask the student to write any code
- The task is about understanding when and why we use a model, not building one
- The questions must be directly based on what the student read in the explanation
- A student who only read the explanation should be able to answer all questions
- Each question must test a DIFFERENT aspect: when to use a model, what to predict, and which model to start with
- The correct answer must be obvious to someone who read the explanation
- The wrong choices must be clearly wrong so only one answer makes sense
- Never create two choices that could both be correct
- Base the correct answer strictly on exact words or ideas from the explanation
- The scenario must describe the company's problem WITHOUT mentioning what to predict
- Question 2 asks the student to identify what the model should predict based on the problem, the answer must NOT be mentioned in the scenario
- The choices must always have A. B. C. D. labels before each option
- Never put the answer inside the scenario directly

Respond ONLY in valid JSON, no extra text:
{{
  "task_title": "بناء نموذج تنبؤي",
  "task_description": "وصف قصير بالعربي لما سيفعله الطالب",
  "estimated_time": "30-40 دقيقة",
  "instructions": "تعليمات بسيطة بالعربي",
  "scenario": "شركة لديها بيانات عن موظفيها مثل عدد سنوات الخبرة وعدد ساعات العمل والأداء السابق، وتريد الاستفادة من هذه البيانات لاتخاذ قرارات أفضل في المستقبل",
  "questions": [
    {{
      "id": 1,
      "question": "ما الذي يميز النموذج التنبؤي عن التحليل العادي للبيانات؟",
      "choices": ["A. يحذف البيانات", "B. يتعلم من البيانات الماضية ليتنبأ بالمستقبل", "C. يجمع البيانات فقط", "D. يعرض البيانات فقط"],
      "correct_answer": "B"
    }},
    {{
      "id": 2,
      "question": "بناءً على بيانات الشركة في السيناريو، ماذا يمكن أن يتنبأ النموذج؟",
      "choices": ["A. اسم الموظف", "B. لون مكتب الموظف", "C. راتب الموظف المتوقع", "D. رقم هاتف الموظف"],
      "correct_answer": "C"
    }},
    {{
      "id": 3,
      "question": "ما هو أبسط نموذج مذكور في الشرح يمكن البدء به؟",
      "choices": ["A. Neural Network", "B. Decision Tree", "C. Linear Regression", "D. Random Forest"],
      "correct_answer": "C"
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
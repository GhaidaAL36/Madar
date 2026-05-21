import os
import re
import json
from groq import Groq

def clean_arabic(text: str) -> str:
    cleaned = re.sub(r'[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\w\s\d.,،؟!:؛\-\n]', '', text)
    return cleaned.strip()

def clean_dict(obj):
    if isinstance(obj, str):
        return clean_arabic(obj)
    elif isinstance(obj, list):
        return [clean_dict(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_dict(v) for k, v in obj.items()}
    return obj

class ReviewDocumentTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "مراجعة وثيقة المتطلبات"
        self.duration = "25-30 دقيقة"
        self.questions = [
            {"id": 1, "question": "ما هي الثغرات الموجودة في وثيقة المتطلبات؟"},
            {"id": 2, "question": "ما هي المتطلبات غير القابلة للقياس وكيف تقترح تحسينها؟"},
            {"id": 3, "question": "ما هي التحسينات التي تقترحها على هذه الوثيقة؟"}
        ]

    def generateTask(self) -> dict:
        prompt = """
You are creating a PRD review task for a Product Manager student in Arabic.

Generate a realistic PRD document with intentional gaps and weak requirements that the student must identify.

IMPORTANT RULES:
- All text must be in Arabic only
- The context must be long and detailed — at least 7-8 sentences describing the company history, what it does, the product idea, why it was built, who requested it, and what problem it solves
- The context must feel like a real business background not a generic description
- The PRD must have 5 sections: الهدف, المستخدمون المستهدفون, المتطلبات الوظيفية, معايير النجاح, الجدول الزمني
- Intentionally include weak requirements like "يجب أن يكون سريعاً" without specifying how fast
- Intentionally make the target users vague like "جميع المستخدمين"
- Intentionally make success metrics unmeasurable like "زيادة التفاعل"
- keyFindings must describe all the gaps and weaknesses in the PRD
- Author names must be chosen from: هند عبدالعزيز, عبدالله محمد, فاطمة خالد, محمد خالد, سارة أحمد
- The PRD must be detailed and long — each section must have at least 3-4 sentences or points
- المتطلبات الوظيفية must have at least 5 numbered requirements
- الجدول الزمني must include specific phases with durations
- معايير النجاح must have at least 3 metrics
- The document must feel like a real PRD written by a junior PM that needs improvement
- ZERO tolerance for any non-Arabic non-English characters anywhere in the output

Respond ONLY in valid JSON, no extra text:
{
  "task_title": "مراجعة وثيقة المتطلبات",
  "context": "سياق مفصل عن الشركة والمنتج",
  "instructions": "راجع وثيقة متطلبات المنتج التالية. حدّد الثغرات، المتطلبات غير القابلة للقياس، والتحسينات المقترحة.",
  "hints": [
    "هل المتطلبات قابلة للقياس؟ مثال: سريع لا يكفي — كم ثانية؟",
    "هل هناك متطلبات متعارضة مع بعضها؟",
    "من هو المستخدم المستهدف؟ هل هو محدد بوضوح؟"
  ],
  "documentTitle": "وثيقة متطلبات: عنوان الميزة",
  "sections": [
    {"heading": "الهدف", "body": "وصف الهدف"},
    {"heading": "المستخدمون المستهدفون", "body": "وصف المستخدمين"},
    {"heading": "المتطلبات الوظيفية", "body": "قائمة المتطلبات"},
    {"heading": "معايير النجاح", "body": "معايير النجاح"},
    {"heading": "الجدول الزمني", "body": "الجدول الزمني"}
  ],
  "keyFindings": [
    "ثغرة أولى في الوثيقة",
    "ثغرة ثانية في الوثيقة",
    "ثغرة ثالثة في الوثيقة",
    "ثغرة رابعة في الوثيقة"
  ]
}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2000
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        content = content.replace('\n', ' ').replace('\r', ' ')
        result = json.loads(content)
        result = clean_dict(result)
        result["questions"] = self.questions
        return result
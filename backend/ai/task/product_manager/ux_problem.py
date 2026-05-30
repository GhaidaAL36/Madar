import os
import re
import json
from groq import Groq

def clean_arabic(text: str) -> str:
    # Remove any word that contains non-Arabic non-ASCII characters
    words = text.split()
    clean_words = []
    for word in words:
        # Check if word has any character outside Arabic and basic ASCII
        if not re.search(r'[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\x00-\x7F]', word):
            clean_words.append(word)
    return ' '.join(clean_words).strip()

def clean_dict(obj):
    if isinstance(obj, str):
        return clean_arabic(obj)
    elif isinstance(obj, list):
        return [clean_dict(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_dict(v) for k, v in obj.items()}
    return obj

class UXProblemTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "حل مشكلة UX"
        self.duration = "30-35 دقيقة"

    def generateTask(self) -> dict:
        prompt = """
You are creating a UX problem task for a Product Manager student in Arabic.

Generate a realistic UX problem with a user journey and specific drop-off data.

IMPORTANT RULES:
- All text must be in Arabic only
- ZERO tolerance for any non-Arabic non-English characters
- Generate a context describing the app and company in 5-6 sentences
- The ux description must include a specific drop-off percentage and exactly where it happens
- The user journey must have exactly 5-6 steps
- Questions must be open text generated based on the specific UX problem
- Questions must make the student think critically about root cause and solutions
- If you cannot think of the right Arabic word, leave it out entirely — never substitute with a foreign word
- Every single word in every field must be either Arabic or a known English tech term only
- Never use brand names or product names in English inside Arabic text
- The context must describe a fictional company with a fully Arabic name
- Example wrong: "تطبيقنا هو تطبيق mobily"
- Example correct: "تطبيقنا هو تطبيق نجمة للتسوق"

Respond ONLY in valid JSON, no extra text:
{
  "task_title": "حل مشكلة UX",
  "context": "سياق مفصل عن التطبيق والشركة في 5-6 جمل",
  "instructions": "بناءً على رحلة المستخدم والمشكلة الموصوفة أدناه، اكتب تعريفاً واضحاً للمشكلة، حدّد السبب الجذري، واقترح 3 حلول مع ترتيبها حسب الأولوية.",
  "hints": [
    "فكّر في السبب الجذري وليس فقط الأعراض",
    "قيّم كل حل من حيث: التأثير، التكلفة، الوقت",
    "ركّز على الخطوة التي يحدث فيها أعلى معدل تراجع"
  ],
  "uxDescription": "وصف المشكلة مع نسبة تراجع محددة وأين تحدث بالضبط",
  "uxUserJourney": [
    "الخطوة الأولى في رحلة المستخدم",
    "الخطوة الثانية",
    "الخطوة الثالثة",
    "الخطوة الرابعة",
    "الخطوة الخامسة"
  ],
  "keyFindings": [
    "السبب الجذري للمشكلة",
    "الحل المقترح الأول مع تبريره",
    "الحل المقترح الثاني مع تبريره",
    "كيفية قياس نجاح الحل"
  ],
  "questions": [
    {"id": 1, "question": "سؤال مفتوح عن السبب الجذري للمشكلة بناءً على رحلة المستخدم"},
    {"id": 2, "question": "سؤال مفتوح عن 3 حلول مقترحة مع ترتيبها حسب الأولوية"},
    {"id": 3, "question": "سؤال مفتوح عن كيفية قياس نجاح الحل المقترح"}
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
        return result
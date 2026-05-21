import os
import json
from groq import Groq

class CleanDataTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "تحليل البيانات"
        self.duration = "20-25 دقيقة"

    def generateTask(self) -> dict:
        prompt = """
You are creating a data analysis task for a Data Science student in Arabic.

Generate a realistic and detailed company scenario with messy data that needs to be analyzed.

IMPORTANT RULES:
- All text must be in Arabic except programming terms like null, None, etc.
- The context must be long and detailed — at least 5-6 sentences describing the company, its work, the situation, and what is expected from the student
- The context must feel like a real work scenario the student is living
- The table must have 5 columns and 10 rows
- The data must contain: at least 2 null values, at least 1 obviously wrong value (like age 999), at least 1 duplicate row
- Wrong values and null values must be in DIFFERENT rows
- The duplicate rows must be placed next to each other
- Use real Arabic names for people
- keyFindings must describe the exact problems found in the data
- Questions must be generated based on the actual problems in the generated data, not generic questions
- Each question must reference something specific from the table
- Never use the same question twice
- Questions must be open text, no multiple choice
- STRICTLY use Arabic only, no Vietnamese, no Spanish, no English words except programming terms
- All names must be proper Arabic names only, no Latin characters in names
- NEVER mix any non-Arabic characters in text fields — no Chinese, no Vietnamese, no Spanish
- chartData must be meaningful — show the distribution of one of the columns, for example count of each city or nationality, with real values not 0
- stats must have real calculated values from the data, not placeholder text
- stats labels must be pure Arabic only, no Russian, no Chinese, no English words except programming terms
- Example of correct stat: {"label": "متوسط العمر", "value": "32"}
- Example of wrong stat: {"label": "ال сред العمر", "value": "32"}
- keyFindings must be 100% in Arabic, never in English
- questions must be 100% in Arabic, never mix English words like "age 999" — say "العمر 999" instead

Respond ONLY in valid JSON, no extra text:
{
  "task_title": "تحليل البيانات",
  "context": "سياق مفصل وطويل بالعربي — على الأقل 5-6 جمل تصف الشركة وطبيعة عملها والموقف الذي يجد الطالب نفسه فيه وماذا يُتوقع منه",
  "instructions": "تعليمات واضحة بالعربي",
  "chartType": "bar",
  "columns": ["العمود1", "العمود2", "العمود3", "العمود4", "العمود5"],
  "rows": [
    {"العمود1": "قيمة", "العمود2": "قيمة", "العمود3": "قيمة", "العمود4": "قيمة", "العمود5": "قيمة"}
  ],
  "chartData": [
    {"label": "تسمية", "value": 0}
  ],
  "stats": [
    {"label": "متوسط العمر", "value": "احسب المتوسط من البيانات"},
    {"label": "أعلى عمر", "value": "اكتب أعلى قيمة عمر"},
    {"label": "إجمالي السجلات", "value": "اكتب العدد الإجمالي"},
    {"label": "عدد القيم المفقودة", "value": "اكتب عدد القيم المفقودة"},
    {"label": "عدد السجلات المكررة", "value": "اكتب عدد السجلات المكررة"}
  ]
  "keyFindings": [
    "ملاحظة أولى عن مشاكل البيانات بالتفصيل",
    "ملاحظة ثانية عن مشاكل البيانات بالتفصيل",
    "ملاحظة ثالثة عن مشاكل البيانات بالتفصيل"
  ],
  "questions": [
    {"id": 1, "question": "سؤال مفتوح بالعربي مباشرة عن مشكلة محددة موجودة في الجدول"},
    {"id": 2, "question": "سؤال مفتوح بالعربي عن كيفية تصحيح مشكلة محددة في الجدول"},
    {"id": 3, "question": "سؤال مفتوح بالعربي عن أولوية معالجة المشاكل بناءً على البيانات الموجودة"}
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
        return json.loads(content)
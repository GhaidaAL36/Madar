import os
import json
from groq import Groq

class BuildModelTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "بناء نموذج"
        self.duration = "30-40 دقيقة"

    def generateTask(self) -> dict:
        prompt = """
You are creating a predictive model analysis task for a Data Science student in Arabic.

Generate a realistic company scenario with sales or performance data that the student must analyze.

IMPORTANT RULES:
- All text must be in Arabic except programming terms like Model, Linear Regression, etc.
- Generate a context describing a company and why they need data analysis
- The table must have 5 columns and 10 rows with realistic numbers
- All data must be clean and realistic, no errors
- chartType must be "line" since this is trend data
- keyFindings must describe trends and patterns found in the data
- Questions must be open text, no multiple choice
- Questions must ask the student to analyze trends, identify patterns, and make recommendations
- A student who reads the explanation and looks at the data should be able to answer

Respond ONLY in valid JSON, no extra text:
{
  "context": "سياق الشركة بالعربي — أنت محلل بيانات في شركة... الشركة لاحظت... مهمتك هي...",
  "instructions": "تعليمات بسيطة بالعربي",
  "chartType": "line",
  "columns": ["العمود1", "العمود2", "العمود3", "العمود4", "العمود5"],
  "rows": [
    {"العمود1": "قيمة", "العمود2": 0, "العمود3": 0, "العمود4": 0, "العمود5": 0}
  ],
  "chartData": [
    {"label": "تسمية", "value": 0}
  ],
  "stats": [
    {"label": "إحصائية", "value": "قيمة"}
  ],
  "keyFindings": [
    "ملاحظة أولى عن الاتجاهات في البيانات",
    "ملاحظة ثانية عن الأنماط",
    "ملاحظة ثالثة عن التوصيات",
    "ملاحظة رابعة عن النمو",
    "ملاحظة خامسة عن الأداء"
  ],
  "stats": [
    {"label": "إجمالي", "value": "قيمة"},
    {"label": "متوسط", "value": "قيمة"},
    {"label": "أعلى قيمة", "value": "قيمة"},
    {"label": "أدنى قيمة", "value": "قيمة"}
  ],
  "questions": [
    {"id": 1, "question": "سؤال مفتوح بالعربي عن الاتجاه العام في البيانات"},
    {"id": 2, "question": "سؤال مفتوح بالعربي عن أبرز الأنماط في البيانات"},
    {"id": 3, "question": "سؤال مفتوح بالعربي عن توصياتك للشركة بناءً على البيانات"}
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
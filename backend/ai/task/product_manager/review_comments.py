import os
import json
from groq import Groq

class ReviewCommentsTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "مراجعة تعليقات المستخدمين"
        self.duration = "20-25 دقيقة"
        self.questions = [
            {"id": 1, "question": "ما هي أكثر المشاكل تكراراً في التعليقات؟"},
            {"id": 2, "question": "رتّب المشاكل حسب الأولوية وبرر اختيارك"},
            {"id": 3, "question": "ما هي خطة العمل المقترحة لمعالجة هذه المشاكل؟"}
        ]

    def generateTask(self) -> dict:
        prompt = """
You are creating a user comments review task for a Product Manager student in Arabic.

Generate a realistic app with user comments that the student must analyze.

IMPORTANT RULES:
- All text must be in Arabic except terms like bug, feature, ux, performance
- Generate a context describing the app and company in 4-5 sentences
- Generate exactly 8 user comments
- Each comment must have: id, author (Arabic name), content, category (bug/feature/ux/performance), date
- Make sure there are patterns — at least 2 comments about the same issue
- keyFindings must describe the main patterns and priorities found in the comments
- keyFindings are hidden from the user and only used for evaluation
- STRICTLY use Arabic only in all text fields
- No Russian, no Chinese, no Thai, no Vietnamese, no English words except: bug, feature, ux, performance
- Comment content must be 100% in Arabic except the category terms
- Author names must be proper Arabic names only
- Never mix any foreign language characters in any field
- Author names must be FULL Arabic names written in Arabic script only, never in English letters
- Example correct: "هند عبدالعزيز", "عبدالله محمد"
- Example wrong:  "hend abdulaziz", "abdullah mohammed"
- Comments must sound like real natural user feedback, not formulaic sentences
- Never end a comment with "في feature X" or "في bug X" or "في ux X"
- The category is only in the category field, never mentioned inside the comment content
- ZERO tolerance for any non-Arabic non-English characters anywhere
- Before finalizing, check every single character in every field — if any non-Arabic non-English character exists, replace the entire comment with a clean Arabic one




- Author names must be chosen from this list only: هند عبدالعزيز, عبدالله محمد, فاطمة علي, محمد خالد, سارة أحمد, نادر عبدالرحمن, ريم عمر, أحمد علي, نور الهدى, خالد سعيد, أميرة حسن, سلمى فهد
Respond ONLY in valid JSON, no extra text:
{
  "task_title": "مراجعة تعليقات المستخدمين",
  "context": "سياق مفصل عن التطبيق والشركة",
  "instructions": "راجع التعليقات التالية من مستخدمي التطبيق. حدّد الأنماط الرئيسية، رتّب المشاكل حسب الأولوية، واكتب خطة عمل مقترحة.",
  "hints": [
    "ابحث عن المشاكل المتكررة في أكثر من تعليق",
    "ركّز على التعليقات ذات تصنيف bug أولاً",
    "فكّر في التأثير على تجربة المستخدم وليس فقط التقنية"
  ],
  "comments": [
    {"id": "1", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "bug", "date": "2024-01-15"},
    {"id": "2", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "feature", "date": "2024-01-15"},
    {"id": "3", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "ux", "date": "2024-01-14"},
    {"id": "4", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "performance", "date": "2024-01-14"},
    {"id": "5", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "bug", "date": "2024-01-14"},
    {"id": "6", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "feature", "date": "2024-01-13"},
    {"id": "7", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "ux", "date": "2024-01-13"},
    {"id": "8", "author": "اسم عربي", "content": "تعليق المستخدم", "category": "feature", "date": "2024-01-12"}
  ],
  "keyFindings": [
    "الأنماط الرئيسية في التعليقات",
    "الأولويات المقترحة بناءً على التعليقات",
    "خطة العمل المثالية"
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
        result = json.loads(content)
        result["questions"] = self.questions
        return result
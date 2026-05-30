import os
import re
import json
from groq import Groq

def clean_arabic(text: str) -> str:
    words = text.split()
    clean_words = []
    for word in words:
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

class StakeholderNotesTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.task_name = "مراجعة محضر اجتماع"
        self.duration = "30-35 دقيقة"
        self.questions = [
            {"id": 1, "question": "ما هي الطلبات المتعارضة في الاجتماع؟"},
            {"id": 2, "question": "رتّب الطلبات حسب أولوية العمل وبرر اختيارك"},
            {"id": 3, "question": "اكتب ملخصاً تنفيذياً بالخطوات التالية للفريق"}
        ]

    def generateTask(self) -> dict:
        prompt = """
You are creating a stakeholder meeting notes task for a Product Manager student in Arabic.

Generate a realistic meeting where different stakeholders have STRONGLY conflicting requests that cannot all be done at the same time.

IMPORTANT RULES:
- All text must be in Arabic only
- ZERO tolerance for any non-Arabic non-English characters
- Never use brand names or product names in English inside Arabic text
- The context must be 6-7 sentences describing the company, its current situation, challenges it faces, and why this meeting was called
- The context must feel urgent and realistic
- Each stakeholder must have a DIFFERENT and CONFLICTING request — they cannot all be done together
- The CEO wants a new feature for competitive reasons
- The Sales Manager wants to fix performance issues that are losing customers
- The Tech Manager wants to fix technical debt before adding anything new
- The Marketing Manager needs specific features ready for an upcoming campaign
- The budget and team size must make it impossible to do everything
- Make the conflict feel real — if you fix performance you cannot build new features at the same time
- keyFindings must clearly describe the conflicts and suggest the correct priority with reasoning
- Questions must push the student to think critically about tradeoffs and prioritization

Respond ONLY in valid JSON, no extra text:
{
  "task_title": "مراجعة محضر اجتماع",
  "context": "سياق مفصل وعاجل عن الشركة ووضعها الحالي والتحديات التي تواجهها وسبب انعقاد هذا الاجتماع — 6-7 جمل",
  "instructions": "راجع محضر اجتماع أصحاب المصلحة التالي. حدّد القرارات المتعارضة، رتّب الطلبات حسب أولوية العمل، واكتب ملخصاً تنفيذياً بالخطوات التالية.",
  "hints": [
    "ابحث عن الطلبات المتعارضة بين الأطراف المختلفة",
    "ليس كل طلب يستحق التنفيذ — فكّر في قيمة المستخدم أولاً",
    "القرارات يجب أن تكون مبنية على بيانات وليس آراء"
  ],
  "documentTitle": "محضر اجتماع: مراجعة خارطة الطريق",
  "sections": [
    {
      "heading": "الحضور",
      "body": "أسماء الحضور بأدوارهم الوظيفية"
    },
    {
      "heading": "طلبات المدير التنفيذي",
      "body": "طلب محدد وعاجل من المدير التنفيذي مع سبب تجاري واضح"
    },
    {
      "heading": "طلبات مدير المبيعات",
      "body": "طلب مختلف تماماً يتعارض مع طلب المدير التنفيذي مع أرقام وبيانات"
    },
    {
      "heading": "طلبات مدير التقنية",
      "body": "طلب تقني يتعارض مع الطلبين السابقين مع تحذير واضح من المخاطر"
    },
    {
      "heading": "طلبات مدير التسويق",
      "body": "طلب تسويقي عاجل بموعد نهائي محدد يتعارض مع الجميع"
    },
    {
      "heading": "الميزانية والوقت",
      "body": "قيود واضحة تجعل تنفيذ جميع الطلبات مستحيلاً"
    }
  ],
  "keyFindings": [
    "التعارض الأول وتأثيره على العمل",
    "التعارض الثاني وتأثيره على العمل",
    "الأولوية الصحيحة مع التبرير",
    "الخطوات التنفيذية المقترحة"
  ],
  "questions": [
    {"id": 1, "question": "سؤال محدد عن التعارضات الموجودة في الاجتماع وأسبابها"},
    {"id": 2, "question": "سؤال يطلب من الطالب ترتيب الطلبات بالأولوية مع تبرير منطقي"},
    {"id": 3, "question": "سؤال يطلب كتابة ملخص تنفيذي واضح بالخطوات التالية"}
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
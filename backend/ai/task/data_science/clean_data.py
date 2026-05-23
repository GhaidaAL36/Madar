import os
import json
import random
from groq import Groq


DOMAINS = [
    {
        "sector": "مستشفى",
        "context_seed": "إدارة سجلات المرضى وتتبع حالاتهم الصحية",
        "columns": ["اسم المريض", "العمر", "التشخيص", "الجرعة (مل)", "تاريخ الدخول"],
        "chart_axis": "التشخيص",
        "error_pool": [
            "جرعة سالبة (-50)",
            "عمر 0 لمريض بالغ",
            "تاريخ دخول في المستقبل",
            "اسم المريض مكرر مع بيانات مختلفة",
            "حقل التشخيص فارغ",
        ],
    },
    {
        "sector": "متجر إلكتروني",
        "context_seed": "تتبع طلبات العملاء واكتشاف مشاكل البيانات",
        "columns": ["اسم العميل", "المنتج", "الكمية", "السعر (ريال)", "تاريخ الطلب"],
        "chart_axis": "المنتج",
        "error_pool": [
            "كمية سالبة",
            "سعر 0 لمنتج مدفوع",
            "تاريخ طلب في المستقبل البعيد",
            "اسم عميل مكرر بمنتجات مختلفة",
            "اسم المنتج فارغ",
        ],
    },
    {
        "sector": "شركة شحن",
        "context_seed": "متابعة الشحنات وأوقات التسليم",
        "columns": ["رقم الشحنة", "الوزن (كغ)", "المدينة المرسل إليها", "مدة التوصيل (يوم)", "حالة الشحنة"],
        "chart_axis": "المدينة المرسل إليها",
        "error_pool": [
            "وزن شحنة سالب",
            "مدة توصيل 0 يوم لشحنة بعيدة",
            "حالة شحنة غير معرّفة",
            "رقم شحنة مكرر",
            "مدينة فارغة",
        ],
    },
    {
        "sector": "مطعم",
        "context_seed": "تتبع طلبات الطعام والإيرادات اليومية",
        "columns": ["اسم الموظف", "الطبق", "عدد الطلبات", "السعر (ريال)", "تاريخ الوردية"],
        "chart_axis": "الطبق",
        "error_pool": [
            "عدد طلبات سالب",
            "سعر طبق 0",
            "اسم موظف مكرر في نفس الوردية",
            "تاريخ وردية في المستقبل",
            "اسم الطبق فارغ",
        ],
    },
    {
        "sector": "مدرسة",
        "context_seed": "تحليل أداء الطلاب في الاختبارات الفصلية",
        "columns": ["اسم الطالب", "المادة", "الدرجة", "الغيابات", "المستوى الدراسي"],
        "chart_axis": "المادة",
        "error_pool": [
            "درجة أعلى من 100",
            "غيابات سالبة",
            "مادة فارغة",
            "اسم طالب مكرر بدرجات مختلفة",
            "مستوى دراسي غير صحيح",
        ],
    },
    {
        "sector": "فندق",
        "context_seed": "إدارة الحجوزات وتقييمات النزلاء",
        "columns": ["اسم النزيل", "نوع الغرفة", "عدد الليالي", "التقييم", "تاريخ الوصول"],
        "chart_axis": "نوع الغرفة",
        "error_pool": [
            "عدد ليالٍ سالب",
            "تقييم 0 لنزيل فعّال",
            "تاريخ وصول في المستقبل البعيد",
            "اسم النزيل مكرر تماماً",
            "نوع غرفة غير موجود في الفندق",
        ],
    },
    {
        "sector": "صيدلية",
        "context_seed": "مراقبة مخزون الأدوية وتواريخ انتهاء الصلاحية",
        "columns": ["اسم الدواء", "الكمية المتاحة", "السعر (ريال)", "تاريخ الانتهاء", "الفئة العلاجية"],
        "chart_axis": "الفئة العلاجية",
        "error_pool": [
            "كمية متاحة سالبة",
            "تاريخ انتهاء في الماضي البعيد",
            "سعر دواء 0",
            "اسم دواء مكرر بكميات مختلفة",
            "فئة علاجية فارغة",
        ],
    },
    {
        "sector": "شركة توظيف",
        "context_seed": "تتبع طلبات التوظيف ونتائج المقابلات",
        "columns": ["اسم المتقدم", "المسمى الوظيفي", "سنوات الخبرة", "الراتب المطلوب (ريال)", "نتيجة المقابلة"],
        "chart_axis": "المسمى الوظيفي",
        "error_pool": [
            "سنوات خبرة سالبة",
            "راتب مطلوب 0",
            "نتيجة مقابلة غير معرّفة",
            "اسم متقدم مكرر بنتائج مختلفة",
            "مسمى وظيفي فارغ",
        ],
    },
]

ERROR_BLUEPRINTS = [
    {"null_count": 2, "wrong_value": 1, "duplicate": True},
    {"null_count": 1, "wrong_value": 2, "duplicate": True},
    {"null_count": 3, "wrong_value": 1, "duplicate": False},
    {"null_count": 2, "wrong_value": 1, "duplicate": True},
    {"null_count": 1, "wrong_value": 1, "duplicate": True},
]


class DataCleanTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def generateTask(self) -> dict:
        domain = random.choice(DOMAINS)
        blueprint = random.choice(ERROR_BLUEPRINTS)
        errors_to_inject = random.sample(domain["error_pool"], min(2, len(domain["error_pool"])))

        prompt = f"""
You are generating a data cleaning task for an Arabic-speaking data analyst student.
The data must be DIRTY — it contains real problems the student must find and fix.

SECTOR: {domain["sector"]}
WORK CONTEXT: {domain["context_seed"]}
TABLE COLUMNS (use exactly these, in this order): {', '.join(domain["columns"])}
CHART AXIS COLUMN: {domain["chart_axis"]}
ERRORS TO INJECT INTO THE DATA:
{chr(10).join(f'- {e}' for e in errors_to_inject)}
NULL VALUES TO INCLUDE: {blueprint["null_count"]} cells must be null (use null, not empty string)
DUPLICATE ROW: {"Yes — place the duplicate row immediately after the original" if blueprint["duplicate"] else "No"}

STRICT RULES:
1. All text values must be in Arabic only. No Latin characters anywhere except programming terms like null.
2. All person names must be proper Arabic names only. Never use Latin names.
3. The "instructions" field must be 5-6 detailed Arabic sentences describing: the company, the student's role, and that they must find and report all data problems.
4. Use exactly these columns in this exact order: {json.dumps(domain["columns"], ensure_ascii=False)}
5. Generate exactly 10 rows. Errors must be spread across different rows, not clustered.
6. The duplicate row (if required) must appear directly after the row it copies.
7. Null values must be the JSON null keyword, not an empty string or the word "null".
8. chartData must reflect the real distribution of "{domain["chart_axis"]}" values from the generated rows — count occurrences, never use 0.
9. stats must contain real computed values from the actual data — never write placeholder text.
10. keyFindings must describe the exact problems present in the data, referencing specific rows or values — used to evaluate the student.
11. hints must be practical tips that guide the student toward spotting and fixing the problems.
12. Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

Output this exact JSON shape:
{{
  "instructions": "5-6 detailed Arabic sentences describing the scenario and that the student must find all data problems",
  "chartType": "bar",
  "columns": {json.dumps(domain["columns"], ensure_ascii=False)},
  "rows": [
    {{{", ".join(f'"{col}": "value"' for col in domain["columns"])}}}
  ],
  "chartData": [
    {{"label": "Arabic label from {domain['chart_axis']} column", "value": 3}}
  ],
  "stats": [
    {{"label": "إجمالي السجلات", "value": "10"}},
    {{"label": "عدد القيم المفقودة", "value": "{blueprint['null_count']}"}},
    {{"label": "عدد السجلات المكررة", "value": "{'1' if blueprint['duplicate'] else '0'}"}},
    {{"label": "sector-relevant stat label in Arabic", "value": "real computed value"}},
    {{"label": "sector-relevant stat label in Arabic", "value": "real computed value"}}
  ],
  "keyFindings": [
    "Detailed Arabic finding about a specific problem in the data with row reference",
    "Detailed Arabic finding about a specific problem in the data with row reference",
    "Detailed Arabic finding about a specific problem in the data with row reference"
  ],
  "hints": [
    "Practical Arabic hint to help the student spot problems",
    "Practical Arabic hint to help the student spot problems",
    "Practical Arabic hint to help the student spot problems"
  ],
  "questions": []
}}
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=2500,
        )

        content = response.choices[0].message.content.strip()
        start = content.find("{")
        end = content.rfind("}") + 1
        if start != -1 and end > 0:
            content = content[start:end]

        result = json.loads(content)

        result["columns"] = domain["columns"]
        result["task_title"] = f"تنظيف بيانات — {domain['sector']}"
        result["estimated_time"] = "20-25 دقيقة"
        result["sector"] = domain["sector"]
        result["task_type"] = "clean_data"

        return result
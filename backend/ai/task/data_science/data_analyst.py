import os
import json
import random
from groq import Groq


DOMAINS = [
    {
        "sector": "متجر إلكتروني",
        "context_seed": "تحليل أداء المبيعات واتجاهات العملاء",
        "columns": ["المنتج", "الكمية المباعة", "الإيراد (ريال)", "تقييم العميل", "الفئة"],
        "chart_axis": "الفئة",
        "insight_focus": "أي الفئات تحقق أعلى إيراد وأي المنتجات لها أعلى تقييم",
    },
    {
        "sector": "مستشفى",
        "context_seed": "تحليل بيانات المرضى والتشخيصات",
        "columns": ["القسم", "عدد المرضى", "متوسط مدة الإقامة (يوم)", "نسبة الشفاء (%)", "التكلفة (ريال)"],
        "chart_axis": "القسم",
        "insight_focus": "أي الأقسام لها أعلى عبء عمل وأي الأقسام لها أفضل نسبة شفاء",
    },
    {
        "sector": "شركة توظيف",
        "context_seed": "تحليل نتائج التوظيف وأداء المرشحين",
        "columns": ["التخصص", "عدد المتقدمين", "نسبة القبول (%)", "متوسط الراتب (ريال)", "متوسط الخبرة (سنة)"],
        "chart_axis": "التخصص",
        "insight_focus": "أي التخصصات لها أعلى نسبة قبول وأعلى راتب",
    },
    {
        "sector": "فندق",
        "context_seed": "تحليل أداء الحجوزات ورضا النزلاء",
        "columns": ["نوع الغرفة", "عدد الحجوزات", "متوسط الإقامة (ليلة)", "متوسط التقييم", "الإيراد (ريال)"],
        "chart_axis": "نوع الغرفة",
        "insight_focus": "أي أنواع الغرف الأكثر طلباً والأعلى إيراداً",
    },
    {
        "sector": "مدرسة",
        "context_seed": "تحليل الأداء الأكاديمي للطلاب",
        "columns": ["المادة", "متوسط الدرجة", "نسبة النجاح (%)", "عدد الطلاب", "عدد الغيابات"],
        "chart_axis": "المادة",
        "insight_focus": "أي المواد لها أضعف أداء وأعلى غيابات",
    },
    {
        "sector": "شركة شحن",
        "context_seed": "تحليل كفاءة التوصيل ورضا العملاء",
        "columns": ["المنطقة", "عدد الشحنات", "متوسط وقت التوصيل (يوم)", "نسبة التأخير (%)", "تقييم العميل"],
        "chart_axis": "المنطقة",
        "insight_focus": "أي المناطق لها أعلى تأخير وأضعف تقييم",
    },
    {
        "sector": "صيدلية",
        "context_seed": "تحليل مبيعات الأدوية والفئات العلاجية",
        "columns": ["الفئة العلاجية", "عدد الوحدات المباعة", "الإيراد (ريال)", "متوسط السعر (ريال)", "نسبة النمو (%)"],
        "chart_axis": "الفئة العلاجية",
        "insight_focus": "أي الفئات العلاجية الأكثر مبيعاً والأعلى نمواً",
    },
    {
        "sector": "مطعم",
        "context_seed": "تحليل أداء القائمة وتفضيلات العملاء",
        "columns": ["الفئة", "عدد الطلبات", "متوسط السعر (ريال)", "متوسط التقييم", "نسبة الإعادة (%)"],
        "chart_axis": "الفئة",
        "insight_focus": "أي فئات الطعام الأكثر طلباً والأعلى تقييماً",
    },
]


class DataAnalystTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def generateTask(self) -> dict:
        domain = random.choice(DOMAINS)

        prompt = f"""
You are generating a data analysis task for an Arabic-speaking data analyst student.
The data must be CLEAN — no nulls, no wrong values, no duplicates.
The student's job is to READ the data and find meaningful insights.

SECTOR: {domain["sector"]}
WORK CONTEXT: {domain["context_seed"]}
TABLE COLUMNS (use exactly these, in this order): {', '.join(domain["columns"])}
CHART AXIS COLUMN: {domain["chart_axis"]}
INSIGHT FOCUS: {domain["insight_focus"]}

STRICT RULES:
1. All text values must be in Arabic only. No Latin characters except programming terms.
2. The "instructions" field must be 5-6 detailed Arabic sentences describing: the company, the student's analyst role, and what insights they are expected to find.
3. Use exactly these columns in this exact order: {json.dumps(domain["columns"], ensure_ascii=False)}
4. Generate exactly 8 rows of CLEAN, realistic data — no nulls, no errors, no duplicates.
5. Data must have clear patterns the student can discover: one category clearly outperforms others, one has a notable weakness, there is a visible trend.
6. chartData must reflect the real distribution of "{domain["chart_axis"]}" values — use actual values from the rows, never 0.
7. stats must contain real computed values: totals, averages, max, min — computed from the actual rows.
8. keyFindings must be the CORRECT insights a good analyst would find — these are used to evaluate the student. Be specific with numbers from the data.
9. hints must guide the student on how to read the data analytically (compare columns, look for patterns, find the highest/lowest).
10. Respond ONLY with valid JSON. No markdown, no backticks, no explanation.

Output this exact JSON shape:
{{
  "instructions": "5-6 detailed Arabic sentences describing the scenario and what the student must find",
  "chartType": "bar",
  "columns": {json.dumps(domain["columns"], ensure_ascii=False)},
  "rows": [
    {{{", ".join(f'"{col}": "value"' for col in domain["columns"])}}}
  ],
  "chartData": [
    {{"label": "Arabic label from {domain['chart_axis']} column", "value": 3}}
  ],
  "stats": [
    {{"label": "إجمالي السجلات", "value": "8"}},
    {{"label": "sector-relevant stat label in Arabic", "value": "real computed value"}},
    {{"label": "sector-relevant stat label in Arabic", "value": "real computed value"}},
    {{"label": "sector-relevant stat label in Arabic", "value": "real computed value"}},
    {{"label": "sector-relevant stat label in Arabic", "value": "real computed value"}}
  ],
  "keyFindings": [
    "Specific Arabic insight with actual numbers from the data — e.g. فئة الإلكترونيات حققت أعلى إيراد بـ 45,000 ريال",
    "Specific Arabic insight about a weakness or low performer with actual numbers",
    "Specific Arabic insight about a trend or comparison between two categories"
  ],
  "hints": [
    "Practical Arabic hint about how to read the chart or table analytically",
    "Practical Arabic hint about what columns to compare",
    "Practical Arabic hint about what pattern to look for"
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
        result["task_title"] = f"تحليل بيانات — {domain['sector']}"
        result["estimated_time"] = "20-25 دقيقة"
        result["sector"] = domain["sector"]
        result["task_type"] = "data_analyst"

        return result
import os
import json
import random
from groq import Groq

SCENARIOS = [
    {
        "domain": "التجارة الإلكترونية",
        "context": "تطوير نظام للمتجر الإلكتروني",
    },
    {
        "domain": "إدارة المستخدمين",
        "context": "تطوير نظام تسجيل وإدارة المستخدمين",
    },
    {
        "domain": "معالجة البيانات",
        "context": "تطوير أدوات لمعالجة وتحليل البيانات",
    },
    {
        "domain": "إدارة المخزون",
        "context": "تطوير نظام لتتبع المخزون والمنتجات",
    },
    {
        "domain": "الحجوزات والمواعيد",
        "context": "تطوير نظام لإدارة الحجوزات والمواعيد",
    },
    {
        "domain": "الفواتير والمدفوعات",
        "context": "تطوير نظام لإنشاء الفواتير وتتبع المدفوعات",
    },
]

REVIEW_FOCUSES = [
    {
        "type": "readability",
        "label": "وضوح الكود وقابلية القراءة (Readability)",
        "hint": "Poor naming, missing comments, deeply nested logic, long functions",
    },
    {
        "type": "best_practices",
        "label": "أفضل الممارسات (Best Practices)",
        "hint": "DRY violations, magic numbers, no input validation, improper error handling",
    },
    {
        "type": "security",
        "label": "مشاكل الأمان (Security Issues)",
        "hint": "Exposed sensitive data, no input sanitization, insecure defaults, plaintext passwords",
    },
    {
        "type": "maintainability",
        "label": "قابلية الصيانة (Maintainability)",
        "hint": "Hardcoded values, tightly coupled logic, no separation of concerns, missing edge case handling",
    },
]

LANGUAGES = ["python", "javascript"]


class CodeReviewTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Code Review task in Software Engineering.
The student already read this explanation about the major:
{major_explanation}

Based on that explanation, explain what Code Review is in more detail.
Use real software examples only, no food analogies.
All text must be in Arabic except technical terms like Code Review, Pull Request,
Refactor, DRY, naming convention, input validation, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "مراجعة الكود Code Review",
  "concept_explanation": "شرح بسيط بالعربي لما هي الـ Code Review، 3-4 جمل",
  "real_world_example": "مثال حقيقي بالعربي لـ Code Review في شركة حقيقية وما الذي اكتُشف فيها",
  "what_will_be_tested": "أخبر الطالب بالعربي بالضبط ماذا سيفعل في هذه المهمة"
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=800,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

    def generateTask(self, concept: dict, major_explanation: str) -> dict:
        scenario = random.choice(SCENARIOS)
        focus = random.choice(REVIEW_FOCUSES)
        language = random.choice(LANGUAGES)

        prompt = f"""
You are creating a code review task for a Software Engineering student.

DOMAIN: {scenario["domain"]}
CONTEXT: {scenario["context"]}
REVIEW FOCUS: {focus["label"]}
FOCUS DESCRIPTION: {focus["hint"]}
PROGRAMMING LANGUAGE: {language}

STRICT RULES:
1. The student must REVIEW existing code and write structured feedback — not fix it,
   not rewrite it, not answer MCQs.
2. code_to_review must be a realistic, working function related to the domain.
   It must contain 3-5 distinct issues matching the review focus above.
   The code must run correctly (no bugs) but have quality/style/security problems.
3. issues must be real, subtle, and require careful reading to spot — not obvious junk code.
4. instructions must be in Arabic (5-6 sentences): describe the company scenario,
   the context of the Pull Request being reviewed, what the code does, what the student
   must do (identify issues, explain why each is a problem, suggest improvements).
5. review_template must be a blank structured format the student fills in —
   e.g. numbered slots for each issue with fields: المشكلة / السبب / الاقتراح.
   Do NOT pre-fill any issues.
6. review_checklist must be 4-5 Arabic yes/no questions the student asks themselves
   while reviewing (e.g. "هل الأسماء واضحة ومعبّرة؟") — a cognitive guide, not hints.
7. expected_issues must list all 3-5 issues with their location and explanation —
   used for AI evaluation only, NOT shown to the student.
8. hints must be 3 Arabic review strategy tips (not revealing specific issues).
9. evaluation_criteria must describe what a correct review includes:
   number of issues found, quality of explanations, actionability of suggestions.
10. Respond ONLY in valid JSON, no markdown, no backticks.

Output this exact JSON shape:
{{
  "task_title": "مراجعة الكود — {scenario["domain"]}",
  "task_description": "short Arabic description of what the student will do",
  "review_focus": "{focus["type"]}",
  "review_focus_label": "{focus["label"]}",
  "language": "{language}",
  "estimated_time": "20-25 دقيقة",
  "instructions": "5-6 Arabic sentences describing the PR context and what to do",
  "code_to_review": "the realistic working but flawed function in {language}",
  "review_template": "blank structured template the student fills in for each issue",
  "review_checklist": [
    "Arabic yes/no review question 1",
    "Arabic yes/no review question 2",
    "Arabic yes/no review question 3",
    "Arabic yes/no review question 4",
    "Arabic yes/no review question 5"
  ],
  "hints": [
    "Arabic review strategy hint 1",
    "Arabic review strategy hint 2",
    "Arabic review strategy hint 3"
  ],
  "expected_issues": [
    {{
      "issue": "Arabic name of the issue",
      "location": "where in the code it appears",
      "explanation": "Arabic explanation of why it is a problem",
      "suggestion": "Arabic suggested improvement"
    }}
  ],
  "evaluation_criteria": "Arabic description of what a correct review submission must include"
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=2000,
        )
        content = response.choices[0].message.content.strip()
        start = content.find("{")
        end = content.rfind("}") + 1
        if start != -1 and end > 0:
            content = content[start:end]

        def fix_json_strings(text):
            result = []
            in_string = False
            i = 0
            while i < len(text):
                c = text[i]
                if c == '"' and (i == 0 or text[i - 1] != "\\"):
                    in_string = not in_string
                    result.append(c)
                elif in_string and c == "\n":
                    result.append("\\n")
                elif in_string and c == "\t":
                    result.append("\\t")
                else:
                    result.append(c)
                i += 1
            return "".join(result)

        content = fix_json_strings(content)
        result = json.loads(content)
        result["task_type"] = "code_review"
        return result
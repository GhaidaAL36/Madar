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

LANGUAGES = ["python", "javascript"]


class WriteFunctionTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Function Writing task in Software Engineering.
The student already read this explanation about the major:
{major_explanation}

Based on that explanation, explain what Functions are in more detail.
Use real software examples only, no food analogies.
All text must be in Arabic except programming terms like Function, def, return, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "كتابة دالة Function",
  "concept_explanation": "شرح بسيط بالعربي لما هي الـ Function، 3-4 جمل",
  "real_world_example": "مثال حقيقي بالعربي لـ Function مستخدمة في برنامج حقيقي",
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
        language = random.choice(LANGUAGES)

        prompt = f"""
You are creating a function writing task for a Software Engineering student.

DOMAIN: {scenario["domain"]}
CONTEXT: {scenario["context"]}
PROGRAMMING LANGUAGE: {language}

STRICT RULES:
1. The student must write ONE real function — not answer questions, not fill blanks.
2. The function must be realistic and related to the domain above.
3. instructions must be in Arabic (5-6 sentences): describe the company context, what the function should do, what parameters it takes, what it should return, and any edge cases to handle.
4. starter_code must be in {language} — include the function signature and docstring only, body should be empty or have a placeholder comment. No solution.
5. expected_output must show 2-3 example calls with their expected results so the student can test their code.
6. hints must be practical Arabic coding tips (not the solution).
7. evaluation_criteria must describe what a correct solution looks like (used for AI evaluation later).
8. Respond ONLY in valid JSON, no markdown, no backticks.

Output this exact JSON shape:
{{
  "task_title": "كتابة دالة — {scenario["domain"]}",
  "task_description": "short Arabic description of what the student will do",
  "estimated_time": "20-25 دقيقة",
  "language": "{language}",
  "instructions": "5-6 Arabic sentences describing the scenario and exactly what function to write",
  "starter_code": "the function signature + docstring in {language}, empty body",
  "expected_output": "2-3 example calls and their expected output as a string",
  "hints": [
    "practical Arabic hint 1",
    "practical Arabic hint 2",
    "practical Arabic hint 3"
  ],
  "evaluation_criteria": "Arabic description of what a correct solution must do"
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=1500,
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
                if c == '"' and (i == 0 or text[i-1] != '\\'):
                    in_string = not in_string
                    result.append(c)
                elif in_string and c == '\n':
                    result.append('\\n')
                elif in_string and c == '\t':
                    result.append('\\t')
                else:
                    result.append(c)
                i += 1
            return ''.join(result)

        content = fix_json_strings(content)
        result = json.loads(content)
        result["task_type"] = "write_function"
        return result
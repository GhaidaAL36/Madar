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

BUG_TYPES = [
    {
        "type": "logic_error",
        "label": "خطأ منطقي (Logic Error)",
        "hint": "The code runs without crashing but produces wrong output due to flawed logic",
    },
    {
        "type": "runtime_error",
        "label": "خطأ وقت التشغيل (Runtime Error)",
        "hint": "The code crashes during execution — e.g. index out of range, division by zero, None reference",
    },
    {
        "type": "edge_case_bug",
        "label": "خطأ في الحالات الحدية (Edge Case Bug)",
        "hint": "The code works for normal inputs but fails on empty lists, zero values, or boundary conditions",
    },
    {
        "type": "off_by_one_error",
        "label": "خطأ الإزاحة بمقدار واحد (Off-by-One Error)",
        "hint": "Loop boundaries or index access is off by one, causing missed or extra iterations",
    },
]

LANGUAGES = ["python", "javascript"]


class DebugCodeTask:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def explainConcept(self, major_explanation: str) -> dict:
        prompt = f"""
You are preparing a student for a Debugging task in Software Engineering.
The student already read this explanation about the major:
{major_explanation}

Based on that explanation, explain what Debugging is in more detail.
Use real software examples only, no food analogies.
All text must be in Arabic except technical terms like Bug, Debugger,
Logic Error, Runtime Error, Stack Trace, Breakpoint, etc.

Respond ONLY in valid JSON, no extra text:
{{
  "concept_title": "تصحيح الأخطاء Debugging",
  "concept_explanation": "شرح بسيط بالعربي لما هو الـ Debugging، 3-4 جمل",
  "real_world_example": "مثال حقيقي بالعربي لـ Bug حدث في برنامج حقيقي وكيف تم اكتشافه وإصلاحه",
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
        bug_type = random.choice(BUG_TYPES)
        language = random.choice(LANGUAGES)

        prompt = f"""
You are creating a debugging task for a Software Engineering student.

DOMAIN: {scenario["domain"]}
CONTEXT: {scenario["context"]}
BUG TYPE: {bug_type["label"]}
BUG DESCRIPTION: {bug_type["hint"]}
PROGRAMMING LANGUAGE: {language}

STRICT RULES:
1. The student must FIND and FIX a real bug — not answer MCQs, not write from scratch.
2. buggy_code must be a realistic, complete function related to the domain.
   It must contain EXACTLY ONE bug matching the bug type above. The rest of the code must be correct.
3. The bug must be subtle enough to require careful reading — not an obvious syntax error.
4. instructions must be in Arabic (5-6 sentences): describe the company scenario,
   what the function is supposed to do, what wrong behavior the student is seeing
   (e.g. wrong output, crash), and what they must do (find the bug, fix it, explain it).
5. failing_test_cases must show 2-3 concrete input/output pairs that expose the bug,
   so the student can reproduce and verify the fix.
6. bug_location must describe WHERE the bug is (line concept, not line number) — used
   for AI evaluation only, NOT shown to the student.
7. correct_fix must show the fixed version of ONLY the buggy line(s) with a brief
   Arabic explanation — used for AI evaluation only, NOT shown to the student.
8. hints must be 3 Arabic investigative hints that guide without revealing the bug.
9. evaluation_criteria must describe what a correct submission includes:
   found the right bug, fixed it correctly, explained it in Arabic.
10. Respond ONLY in valid JSON, no markdown, no backticks.

Output this exact JSON shape:
{{
  "task_title": "تصحيح الأخطاء — {scenario["domain"]}",
  "task_description": "short Arabic description of what the student will do",
  "bug_type": "{bug_type["type"]}",
  "bug_type_label": "{bug_type["label"]}",
  "language": "{language}",
  "estimated_time": "20-25 دقيقة",
  "instructions": "5-6 Arabic sentences describing the scenario, wrong behavior, and what to do",
  "buggy_code": "the complete realistic function in {language} with exactly one bug",
  "failing_test_cases": "2-3 input/output pairs that expose the bug as a string",
  "hints": [
    "Arabic investigative hint 1",
    "Arabic investigative hint 2",
    "Arabic investigative hint 3"
  ],
  "bug_location": "Arabic description of where the bug is — for AI evaluation only",
  "correct_fix": "the fixed line(s) + Arabic explanation — for AI evaluation only",
  "evaluation_criteria": "Arabic description of what a correct submission must include"
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=1800,
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
        result["task_type"] = "debug_code"
        return result
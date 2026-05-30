import os
import json
from groq import Groq


class EvaluationService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def _callLLM(self, prompt: str, max_tokens: int = 1500) -> dict:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=max_tokens,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

    def evaluateOpenResponse(self, task_data: dict, user_answers: dict) -> dict:
        context = task_data.get("context", "")
        rows = task_data.get("rows", [])
        chart_data = task_data.get("chartData", [])
        stats = task_data.get("stats", [])
        key_findings = task_data.get("keyFindings", [])
        questions = task_data.get("questions", [])

        answers_text = ""
        for q in questions:
            qid = str(q["id"])
            answers_text += f"السؤال {qid}: {q['question']}\nإجابة الطالب: {user_answers.get(qid, 'لم يجب')}\n\n"

        prompt = f"""
أنت مقيّم لإجابات طالب في مجال علم البيانات.

السياق: {context}
البيانات (الجدول): {json.dumps(rows, ensure_ascii=False, indent=2)}
البيانات (المخطط البياني): {json.dumps(chart_data, ensure_ascii=False, indent=2)}
الإحصائيات: {json.dumps(stats, ensure_ascii=False, indent=2)}
الملاحظات الرئيسية (الإجابات الصحيحة): {json.dumps(key_findings, ensure_ascii=False, indent=2)}

إجابات الطالب:
{answers_text}

IMPORTANT RULES:
- All text must be in Arabic
- Be fair — partial correct answers deserve partial credit
- Score must be between 0 and 100
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام بالعربي للطالب في جملتين",
  "answer_review": [
    {{"id": 1, "question": "نص السؤال", "user_answer": "إجابة الطالب", "is_correct": true, "correct_feedback": "ما كان يجب أن يقوله الطالب"}}
  ]
}}
"""
        return self._callLLM(prompt)

    def evaluateDataReport(self, task_data: dict, user_answers: dict) -> dict:
        key_findings = task_data.get("keyFindings", [])
        problems = user_answers.get("problems", [])
        conclusion = user_answers.get("conclusion", "")

        problems_text = ""
        for i, p in enumerate(problems, 1):
            problems_text += (
                f"مشكلة {i}: الصف [{p.get('row')}] — العمود [{p.get('column')}] "
                f"— النوع: {p.get('problemType')} — الحل: {p.get('fix')}\n"
            )

        prompt = f"""
You are evaluating a data analyst student's data cleaning report.

ACTUAL DATA PROBLEMS (ground truth):
{json.dumps(key_findings, ensure_ascii=False, indent=2)}

STUDENT'S REPORTED PROBLEMS:
{problems_text or "لم يسجل الطالب أي مشاكل"}

STUDENT'S CONCLUSION:
{conclusion or "لم يكتب الطالب استنتاجاً"}

EVALUATION RULES:
- Score 0-100 based on: how many real problems the student found, quality of proposed fixes, and conclusion accuracy
- The student selects rows by NAME not by row number — treat name-based identification as correct
- If the student found the same TYPE of problem in the correct column, count it as correct even if they didn't find every single row
- Partial credit: finding some instances of a problem = partial score, not zero
- A reasonable fix (even if not perfect wording) = correct
- Do NOT penalize for not finding every single affected row — finding the majority is enough for full credit
- Be generous — the goal is to assess understanding, not exact memorization
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين
- All response text must be in Arabic
- answer_review must have one item per key finding

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام في جملتين",
  "answer_review": [
    {{"id": 1, "question": "هل اكتشف الطالب هذه المشكلة: <key finding>", "user_answer": "ملخص ما ذكره الطالب", "is_correct": true, "correct_feedback": "تفسير مختصر للمشكلة الصحيحة"}}
  ]
}}
"""
        return self._callLLM(prompt, max_tokens=1000)

    def evaluateAnalysisReport(self, task_data: dict, user_answers: dict) -> dict:
        key_findings = task_data.get("keyFindings", [])
        insights = user_answers.get("insights", [])
        conclusion = user_answers.get("conclusion", "")

        insights_text = ""
        for i, ins in enumerate(insights, 1):
            insights_text += f"ملاحظة {i}: {ins.get('observation')}\n"

        prompt = f"""
You are evaluating a data analyst student's analysis report.

CORRECT INSIGHTS (ground truth):
{json.dumps(key_findings, ensure_ascii=False, indent=2)}

STUDENT'S REPORTED INSIGHTS:
{insights_text or "لم يسجل الطالب أي ملاحظات"}

STUDENT'S CONCLUSION:
{conclusion or "لم يكتب الطالب استنتاجاً"}

EVALUATION RULES:
- Score 0-100 based on: how many correct insights the student found, quality of observations, and conclusion accuracy
- Each insight that matches a key finding = high partial score
- Vague or generic observations = low partial score
- Missing key insights = deduct points
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين
- All response text must be in Arabic

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام في جملتين",
  "answer_review": [
    {{"id": 1, "question": "هل حدد الطالب الاستنتاجات الرئيسية؟", "user_answer": "ملخص ما لاحظه الطالب", "is_correct": true, "correct_feedback": "الاستنتاجات الصحيحة كانت: ..."}}
  ]
}}
"""
        return self._callLLM(prompt, max_tokens=1000)

    def evaluateWriteFunction(self, task_data: dict, user_answers: dict) -> dict:
        prompt = f"""
You are evaluating a student's function writing submission.

TASK: {task_data.get("task_title", "")}
INSTRUCTIONS: {task_data.get("instructions", "")}
EXPECTED OUTPUT: {task_data.get("expected_output", "")}
EVALUATION CRITERIA: {task_data.get("evaluation_criteria", "")}

STUDENT SUBMISSION:
{user_answers.get("code", "لم يكتب الطالب أي كود")}

EVALUATION RULES:
- Score 0-100
- Test the logic mentally against the expected output examples
- Partial credit for partially correct logic
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين
- All response text must be in Arabic

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام في جملتين",
  "answer_review": [
    {{"id": 1, "question": "هل الدالة تعطي النتائج الصحيحة؟", "user_answer": "ملخص", "is_correct": true, "correct_feedback": "ما كان يجب كتابته"}},
    {{"id": 2, "question": "هل الكود يتعامل مع الحالات الحدية؟", "user_answer": "ملخص", "is_correct": true, "correct_feedback": "الحالات الحدية المطلوبة"}},
    {{"id": 3, "question": "هل جودة الكود وأسلوب الكتابة مناسبان؟", "user_answer": "ملخص", "is_correct": true, "correct_feedback": "ملاحظات على جودة الكود"}}
  ]
}}
"""
        return self._callLLM(prompt)

    def evaluateDebugCode(self, task_data: dict, user_answers: dict) -> dict:
        prompt = f"""
You are evaluating a student's debugging submission.

TASK: {task_data.get("task_title", "")}
BUG TYPE: {task_data.get("bug_type_label", "")}
BUGGY CODE:
{task_data.get("buggy_code", "")}
BUG LOCATION (ground truth): {task_data.get("bug_location", "")}
CORRECT FIX (ground truth): {task_data.get("correct_fix", "")}
EVALUATION CRITERIA: {task_data.get("evaluation_criteria", "")}

STUDENT SUBMISSION:
Fixed code: {user_answers.get("code", "لم يقدم الطالب كوداً")}

EVALUATION RULES:
- Score 0-100
- Did the student fix the correct bug?
- Partial credit if they found the right area but fixed incorrectly
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين
- All response text must be in Arabic

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام في جملتين",
  "answer_review": [
    {{"id": 1, "question": "هل حدد الطالب موقع الخطأ بشكل صحيح؟", "user_answer": "ملخص", "is_correct": true, "correct_feedback": "موقع الخطأ الصحيح"}},
    {{"id": 2, "question": "هل الإصلاح المقدم صحيح؟", "user_answer": "ملخص", "is_correct": true, "correct_feedback": "الإصلاح الصحيح"}},
    {{"id": 3, "question": "هل الكود يعمل بشكل صحيح بعد الإصلاح؟", "user_answer": "ملخص", "is_correct": true, "correct_feedback": "الحل الكامل"}}
  ]
}}
"""
        return self._callLLM(prompt)

    def evaluateCodeReview(self, task_data: dict, user_answers: dict) -> dict:
        expected_issues = task_data.get("expected_issues", [])
        issues = user_answers.get("issues", [])
        summary = user_answers.get("summary", "")

        issues_text = ""
        for i, issue in enumerate(issues, 1):
            issues_text += (
                f"ملاحظة {i}: المشكلة: {issue.get('problem')} — "
                f"السبب: {issue.get('reason')} — "
                f"الاقتراح: {issue.get('suggestion', 'لم يذكر')}\n"
            )

        prompt = f"""
You are evaluating a software engineering student's code review.

EXPECTED ISSUES (ground truth):
{json.dumps(expected_issues, ensure_ascii=False, indent=2)}

STUDENT'S REVIEW:
{issues_text or "لم يسجل الطالب أي ملاحظات"}

STUDENT'S SUMMARY:
{summary or "لم يكتب الطالب ملخصاً"}

EVALUATION RULES:
- Score 0-100 based on: how many real issues the student found, quality of explanations, actionability of suggestions
- Each correctly identified issue with good explanation = high partial score
- Missing issues = deduct points
- Vague explanations = partial credit
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين
- All response text must be in Arabic
- answer_review must have one item per expected issue

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام في جملتين",
  "answer_review": [
    {{"id": 1, "question": "هل اكتشف الطالب هذه المشكلة: <issue name>", "user_answer": "ما قاله الطالب", "is_correct": true, "correct_feedback": "المشكلة الصحيحة وكيف كان يجب توضيحها"}}
  ]
}}
"""
        return self._callLLM(prompt, max_tokens=1000)

    def evaluatePMResponse(self, task_data: dict, user_answers: dict) -> dict:
        context = task_data.get("context", "")
        key_findings = task_data.get("keyFindings", [])
        questions = task_data.get("questions", [])

        answers_text = ""
        for q in questions:
            qid = str(q["id"])
            answers_text += f"السؤال {qid}: {q['question']}\nإجابة الطالب: {user_answers.get(qid, 'لم يجب')}\n\n"

        prompt = f"""
أنت مقيّم لإجابات طالب في مجال إدارة المنتج.

السياق:
{context}

المحتوى الكامل للمهمة:
{json.dumps(task_data, ensure_ascii=False, indent=2)}

الإجابات المثالية المرجعية:
{json.dumps(key_findings, ensure_ascii=False, indent=2)}

إجابات الطالب:
{answers_text}

EVALUATION RULES:
- All text must be in Arabic
- There are no strictly correct or incorrect answers — evaluate quality of thinking
- Judge based on: هل حدد التعارضات بشكل صحيح؟ هل تبريره منطقي؟ هل قراراته مبنية على بيانات؟
- Score 0-100 based on depth of analysis, logical reasoning, and business understanding
- Be fair and generous — partial credit for partially good answers
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام بالعربي للطالب في جملتين",
  "answer_review": [
    {{"id": 1, "question": "نص السؤال", "user_answer": "إجابة الطالب", "is_correct": true, "correct_feedback": "تعليق على جودة الإجابة وما كان يمكن إضافته"}},
    {{"id": 2, "question": "نص السؤال", "user_answer": "إجابة الطالب", "is_correct": true, "correct_feedback": "تعليق على جودة الإجابة وما كان يمكن إضافته"}},
    {{"id": 3, "question": "نص السؤال", "user_answer": "إجابة الطالب", "is_correct": true, "correct_feedback": "تعليق على جودة الإجابة وما كان يمكن إضافته"}}
  ]
}}
"""
        return self._callLLM(prompt)
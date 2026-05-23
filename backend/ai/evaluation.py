import os
import json
from groq import Groq


class EvaluationService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def evaluateOpenResponse(self, task_data: dict, user_answers: dict) -> dict:
        context = task_data.get("context", "")
        columns = task_data.get("columns", [])
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

السياق:
{context}

البيانات (الجدول):
{json.dumps(rows, ensure_ascii=False, indent=2)}

البيانات (المخطط البياني):
{json.dumps(chart_data, ensure_ascii=False, indent=2)}

الإحصائيات:
{json.dumps(stats, ensure_ascii=False, indent=2)}

الملاحظات الرئيسية (الإجابات الصحيحة):
{json.dumps(key_findings, ensure_ascii=False, indent=2)}

إجابات الطالب:
{answers_text}

قيّم إجابة الطالب لكل سؤال بناءً على البيانات والملاحظات الرئيسية.

IMPORTANT RULES:
- All text must be in Arabic
- Be fair — partial correct answers deserve partial credit
- Score must be between 0 and 100
- If the student identified the main problems correctly give high score
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين

Respond ONLY in valid JSON, no extra text:
{{
  "score": <number 0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام بالعربي للطالب في جملتين",
  "answer_review": [
    {{
      "id": 1,
      "question": "نص السؤال",
      "user_answer": "إجابة الطالب",
      "is_correct": true,
      "correct_feedback": "ما كان يجب أن يقوله الطالب"
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

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
- If the student found the same TYPE of problem (e.g. قيمة مفقودة) in the correct column, count it as correct even if they didn't find every single row
- Partial credit: finding some instances of a problem = partial score, not zero
- A reasonable fix (even if not perfect wording) = correct
- Do NOT penalize for not finding every single affected row — finding the majority is enough for full credit
- Be generous — the goal is to assess understanding, not exact memorization
- performance_label must be one of: أداء عالي, أداء جيد, يحتاج تحسين
- All response text must be in Arabic
- answer_review must have one item per key finding — did the student identify this category of problem?

Respond ONLY in valid JSON:
{{
  "score": <0-100>,
  "performance_label": "أداء عالي or أداء جيد or يحتاج تحسين",
  "feedback": "تقييم عام في جملتين",
  "answer_review": [
    {{
      "id": 1,
      "question": "هل اكتشف الطالب هذه المشكلة: <key finding>",
      "user_answer": "ملخص ما ذكره الطالب عن هذه المشكلة",
      "is_correct": true or false,
      "correct_feedback": "تفسير مختصر للمشكلة الصحيحة"
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

    def evaluateAnalysisReport(self, task_data: dict, user_answers: dict) -> dict:
        key_findings = task_data.get("keyFindings", [])
        insights = user_answers.get("insights", [])
        conclusion = user_answers.get("conclusion", "")

        insights_text = ""
        for i, ins in enumerate(insights, 1):
            insights_text += (
                f"ملاحظة {i}: النوع [{ins.get('type')}] — "
                f"الملاحظة: {ins.get('observation')}\n"
            )

        prompt = f"""
You are evaluating a data analyst student's analysis report.

CORRECT INSIGHTS (ground truth — what a good analyst should find):
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
    {{
      "id": 1,
      "question": "هل حدد الطالب الاستنتاجات الرئيسية من البيانات؟",
      "user_answer": "ملخص ما لاحظه الطالب",
      "is_correct": true,
      "correct_feedback": "الاستنتاجات الصحيحة كانت: ..."
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
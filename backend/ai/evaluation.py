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
    }},
    {{
      "id": 2,
      "question": "نص السؤال",
      "user_answer": "إجابة الطالب",
      "is_correct": false,
      "correct_feedback": "ما كان يجب أن يقوله الطالب"
    }},
    {{
      "id": 3,
      "question": "نص السؤال",
      "user_answer": "إجابة الطالب",
      "is_correct": false,
      "correct_feedback": "ما كان يجب أن يقوله الطالب"
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
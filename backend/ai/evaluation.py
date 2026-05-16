class EvaluationService:
    def evaluateResponse(self, questions: list, user_answers: dict) -> dict:
        total = len(questions)
        correct = 0
        answer_review = []

        for question in questions:
            question_id = question["id"]
            correct_answer = question["correct_answer"]
            user_answer = user_answers.get(str(question_id), "")

            is_correct = user_answer == correct_answer
            if is_correct:
                correct += 1

            answer_review.append({
                "id": question_id,
                "question": question["question"],
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct
            })

        score = int((correct / total) * 100)

        if score >= 80:
            performance_label = "أداء عالي"
            feedback = "أحسنت! لديك فهم قوي لهذا المجال."
        elif score >= 50:
            performance_label = "أداء جيد"
            feedback = "جيد! لكن هناك بعض النقاط التي تحتاج إلى مراجعة."
        else:
            performance_label = "يحتاج تحسين"
            feedback = "لا بأس، هذا أول تجربة لك. راجع الشرح وحاول مرة أخرى."

        return {
            "score": score,
            "performance_label": performance_label,
            "correct_count": correct,
            "total_questions": total,
            "feedback": feedback,
            "answer_review": answer_review
        }
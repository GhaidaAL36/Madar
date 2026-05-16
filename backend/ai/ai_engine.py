import os
from dotenv import load_dotenv
load_dotenv()

from ai.majors_data import MAJORS
from ai.evaluation import EvaluationService
from ai.task.software_engineering.debug_code import DebugCodeTask
from ai.task.software_engineering.write_function import WriteFunctionTask
from ai.task.software_engineering.code_review import CodeReviewTask
from ai.task.software_engineering.requirements import RequirementsTask
from ai.task.software_engineering.performance import PerformanceTask
from ai.task.data_science.clean_data import CleanDataTask
from ai.task.data_science.build_model import BuildModelTask

evaluation_service = EvaluationService()

tasks = {
    "software-engineer": {
        "debug_code": DebugCodeTask(),
        "write_function": WriteFunctionTask(),
        "code_review": CodeReviewTask(),
        "requirements": RequirementsTask(),
        "performance": PerformanceTask()
    },
    "data-scientist": {
        "clean_data": CleanDataTask(),
        "build_model": BuildModelTask()
    }
}

def getMajors() -> list:
    return [
        {
            "id": major_id,
            "title": major["title"],
            "subtitle": major["subtitle"],
            "tasks": major["tasks"]
        }
        for major_id, major in MAJORS.items()
    ]

def getMajor(major_id: str) -> dict:
    return MAJORS.get(major_id)

def getTask(major_id: str, task_id: str) -> dict:
    major_explanation = MAJORS[major_id]["explanation"]
    task = tasks[major_id][task_id]
    concept = task.explainConcept(major_explanation)
    return task.generateTask(concept, major_explanation)

def evaluateResponse(questions: list, user_answers: dict) -> dict:
    return evaluation_service.evaluateResponse(questions, user_answers)
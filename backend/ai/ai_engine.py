import os
from dotenv import load_dotenv
load_dotenv()

from ai.majors_data import job
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

def getJobs() -> list:
    return [
        {
            "id": job_id,
            "title": j["title"],
            "subtitle": j["subtitle"],
            "tasks": j["tasks"]
        }
        for job_id, j in job.items()
    ]

def getJob(job_id: str) -> dict:
    return job.get(job_id)

def getTask(job_id: str, task_id: str) -> dict:
    job_explanation = job[job_id]["explanation"]
    task = tasks[job_id][task_id]
    concept = task.explainConcept(job_explanation)
    return task.generateTask(concept, job_explanation)

def evaluateResponse(questions: list, user_answers: dict) -> dict:
    return evaluation_service.evaluateResponse(questions, user_answers)
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models import Job, Task

def seed():
    app = create_app()

    with app.app_context():
        db.create_all()
        Task.query.delete()
        Job.query.delete()
        db.session.commit()

        with open("seed/jobs.json", encoding="utf-8") as f:
            jobs = json.load(f)

        for job_data in jobs:
            job = Job(**job_data)
            db.session.add(job)

        db.session.commit()
        print(f"✓ {len(jobs)} jobs seeded")

        with open("seed/tasks.json", encoding="utf-8") as f:
            tasks = json.load(f)

        for task_data in tasks:
            task = Task(**task_data)
            db.session.add(task)

        db.session.commit()
        print(f"✓ {len(tasks)} tasks seeded")

        # summary
        for job in Job.query.all():
            tasks = Task.query.filter_by(job_id=job.id).all()
            types = {}
            for t in tasks:
                types[t.type] = types.get(t.type, 0) + 1
            print(f"  {job.title_en}: {dict(types)}")

        print("\nSeed complete.")

if __name__ == "__main__":
    seed()
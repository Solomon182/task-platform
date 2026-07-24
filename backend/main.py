from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

import models
from database import engine, get_db
from models import Task
from schemas import TaskCreate, TaskResponse

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Platform API",
    description="Backend API for the Kubernetes portfolio project",
    version="1.0.0",
)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Task Platform API is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/ready")
def readiness(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))

    return {
        "status": "ready",
        "database": "connected",
    }
@app.post("/api/tasks", response_model=TaskResponse, status_code=201)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
):
    new_task = Task(
        title=task.title,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task
@app.get("/api/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.id).all()


@app.patch("/api/tasks/{task_id}", response_model=TaskResponse)
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed

    db.commit()
    db.refresh(task)

    return task


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}
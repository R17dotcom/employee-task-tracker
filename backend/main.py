from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from database import create_table, get_connection

@asynccontextmanager
async def lifespan(app:FastAPI):
    create_table()
    yield

app = FastAPI(
title="Employee Task Tracker API",
description="REST API fro managing employee tasks",
version="1.0.0",
lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://employee-task-tracker-[a-z0-9]+-rithikhaaa\.vercel\.app",
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
)

@app.get("/cors-check")
def cors_check():
    return {"message": "CORS diagnostic endpoint is working"}

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "Medium"
    assigned_employee: str


class TaskStatusUpdate(BaseModel):
    status: str

def get_task_or_404(task_id: int):
    connection = get_connection()
    task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?", (task_id,)
    ).fetchone()
    connection.close()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return dict(task)
@app.get("/")
def home():
    return {"message": "Employee Task Tracker API is running"}


@app.get("/tasks")
def get_tasks():
    connection = get_connection()
    tasks = connection.execute(
        "SELECT * FROM tasks ORDER BY id DESC"
    ).fetchall()
    connection.close()

    return [dict(task) for task in tasks]
@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    return get_task_or_404(task_id)


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    title = task.title.strip()
    employee = task.assigned_employee.strip()

    if not title or not employee:
        raise HTTPException(
            status_code=422,
            detail="Title and assigned employee are required",
        )

    if task.priority not in ["Low", "Medium", "High"]:
        raise HTTPException(
            status_code=422,
            detail="Priority must be Low, Medium, or High",
        )

    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO tasks (title, description, priority, assigned_employee)
        VALUES (?, ?, ?, ?)
        """,
        (title, task.description, task.priority, employee),
    )
    connection.commit()
    task_id = cursor.lastrowid
    connection.close()

    return get_task_or_404(task_id)


@app.patch("/tasks/{task_id}")
def update_task_status(task_id: int, update: TaskStatusUpdate):
    allowed_statuses = ["Pending", "In Progress", "Completed"]

    if update.status not in allowed_statuses:
        raise HTTPException(
            status_code=422,
            detail="Status must be Pending, In Progress, or Completed",
        )

    connection = get_connection()
    cursor = connection.execute(
        "UPDATE tasks SET status = ? WHERE id = ?",
        (update.status, task_id),
    )
    connection.commit()
    updated_rows = cursor.rowcount
    connection.close()

    if updated_rows == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    return get_task_or_404(task_id)


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    connection = get_connection()
    cursor = connection.execute(
        "DELETE FROM tasks WHERE id = ?", (task_id,)
    )
    connection.commit()
    deleted_rows = cursor.rowcount
    connection.close()

    if deleted_rows == 0:
        raise HTTPException(status_code=404, detail="Task not found")
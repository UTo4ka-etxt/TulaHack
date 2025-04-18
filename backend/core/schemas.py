from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Enums для валидации
class TaskStatus(str, Enum):
    backlog = "backlog"
    todo = "todo"
    in_progress = "in_progress"
    in_review = "in_review"
    in_testing = "in_testing"
    done = "done"
    cancelled = "cancelled"

class TaskType(str, Enum):
    feature = "feature"
    bug = "bug"
    improvement = "improvement"
    technical_debt = "technical_debt"
    research = "research"

# Базовые схемы
class EmployeeBase(BaseModel):
    last_name: str
    first_name: str
    login: str
    access_level: str
    position: str

class TaskBase(BaseModel):
    title: str
    project_id: int
    status: TaskStatus = TaskStatus.backlog
    task_type: TaskType = TaskType.feature

# Схемы для создания
class TaskCreate(TaskBase):
    description: Optional[str] = None
    sprint_id: Optional[int] = None
    story_points: Optional[int] = None

# Схемы для ответов
class Task(TaskBase):
    id: int
    created_at: datetime
    description: Optional[str]
    
    class Config:
        orm_mode = True

class TaskWithWorkflow(Task):
    workflow: List["WorkflowStage"] = []

class WorkflowStage(BaseModel):
    stage: str
    start_date: datetime
    end_date: Optional[datetime]
    
    class Config:
        orm_mode = True
from enum import Enum
from typing import Optional, List
from datetime import datetime

class TaskStatus(str, Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class Task:
    def __init__(
        self,
        id: int,
        title: str,
        project_id: int,
        status: TaskStatus = TaskStatus.BACKLOG,
        assignees: Optional[List[str]] = None
    ):
        self.id = id
        self.title = title
        self.project_id = project_id
        self.status = status
        self.assignees = assignees or []

class Sprint:
    def __init__(
        self,
        id: int,
        project_id: int,
        name: str,
        start_date: datetime,
        end_date: datetime,
        goal: str,
        status: str = "planned"
    ):
        self.id = id
        self.project_id = project_id
        self.name = name
        self.start_date = start_date
        self.end_date = end_date
        self.goal = goal
        self.status = status

class Project:
    def __init__(
        self,
        id: int,
        name: str,
        description: str,
        created_at: datetime,
        planned_end_date: datetime,
        actual_end_date: datetime,
        status: str = "planned"
    ):
        self.id = id
        self.name = name
        self.description = description
        self.created_at = created_at
        self.planned_end_date = planned_end_date
        self.actual_end_date = actual_end_date
        self.status = status

class Employee:
    def __init__(
        self,
        id: int,
        last_name: str,
        first_name: str,
        middle_name: str,
        login: str,
        access_level: str,
        position: str,
        is_active: bool = True
    ):
        self.id = id
        self.last_name = last_name
        self.first_name = first_name
        self.middle_name = middle_name
        self.login = login
        self.access_level = access_level
        self.position = position
        self.is_active = is_active
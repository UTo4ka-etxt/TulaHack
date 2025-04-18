from typing import Optional, List
from datetime import datetime
from enum import Enum

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
        assignees: List[str] = None
    ):
        self.id = id
        self.title = title
        self.project_id = project_id
        self.status = status
        self.assignees = assignees or []
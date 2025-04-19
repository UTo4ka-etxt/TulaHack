# filepath: d:\GitHub\planer\backend\modules\visualization\dashboard_builder.py

from fastapi import APIRouter
from typing import Dict, Any
from modules.analytics.sprint_metrics import get_sprint_burndown, get_planning_accuracy
from modules.analytics.developer_performance import get_developer_load, get_developer_performance
from modules.analytics.bug_analysis import get_post_release_bugs

router = APIRouter()

@router.get("/dashboard/overview", response_model=Dict[str, Any])
async def dashboard_overview():
    # Placeholder for key project metrics
    return {
        "total_tasks": 0,  # Replace with actual data retrieval
        "completed_tasks": 0,  # Replace with actual data retrieval
        "active_sprints": 0  # Replace with actual data retrieval
    }

@router.get("/dashboard/sprint-metrics/{sprint_id}", response_model=Dict[str, Any])
async def sprint_metrics(sprint_id: int):
    burndown = get_sprint_burndown(sprint_id)
    planning_accuracy = get_planning_accuracy(sprint_id)
    return {
        "burndown": burndown,
        "planning_accuracy": planning_accuracy
    }

@router.get("/dashboard/developer-performance/{developer_id}", response_model=Dict[str, Any])
async def developer_performance(developer_id: int):
    load = get_developer_load(developer_id)
    performance = get_developer_performance(developer_id)
    return {
        "load": load,
        "performance": performance
    }

@router.get("/dashboard/bug-analysis/{project_id}", response_model=Dict[str, Any])
async def bug_analysis(project_id: int):
    bugs = get_post_release_bugs(project_id)
    return {
        "total_bugs": bugs["total_bugs"],
        "regression_bugs": bugs["regression_bugs"],
        "rollbacks": bugs["rollbacks"]
    }

@router.get("/dashboard/tasks", response_model=Dict[str, Any])
async def task_management():
    # Placeholder for task management data
    return {
        "tasks": []  # Replace with actual task retrieval logic
    }

@router.get("/dashboard/user-interaction", response_model=Dict[str, Any])
async def user_interaction():
    # Placeholder for user interaction options
    return {
        "filters": ["date_range", "project", "team_member"],
        "notifications": []  # Replace with actual notification logic
    }
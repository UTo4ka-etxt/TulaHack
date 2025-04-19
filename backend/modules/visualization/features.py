# filepath: d:\GitHub\planer\backend\modules\visualization\features.py

from typing import Dict, List
from modules.analytics import sprint_metrics, developer_performance, bug_analysis
from core.database import db

def get_dashboard_overview() -> Dict:
    """Retrieve key project metrics for the dashboard overview."""
    total_tasks_query = "SELECT COUNT(*) FROM Tasks"
    completed_tasks_query = "SELECT COUNT(*) FROM Tasks WHERE status = 'done'"
    active_sprints_query = "SELECT COUNT(*) FROM Sprints WHERE status = 'active'"

    total_tasks = db.execute_query(total_tasks_query, fetch=True)[0][0]
    completed_tasks = db.execute_query(completed_tasks_query, fetch=True)[0][0]
    active_sprints = db.execute_query(active_sprints_query, fetch=True)[0][0]

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "active_sprints": active_sprints
    }

def get_sprint_metrics(sprint_id: int) -> Dict:
    """Retrieve sprint metrics for the specified sprint."""
    burndown_data = sprint_metrics.get_sprint_burndown(sprint_id)
    planning_accuracy = sprint_metrics.get_planning_accuracy(sprint_id)

    return {
        "burndown_data": burndown_data,
        "planning_accuracy": planning_accuracy
    }

def get_developer_performance(developer_id: int) -> Dict:
    """Retrieve performance metrics for a specific developer."""
    load_metrics = developer_performance.get_developer_load(developer_id)
    performance_metrics = developer_performance.get_developer_performance(developer_id)

    return {
        "load_metrics": load_metrics,
        "performance_metrics": performance_metrics
    }

def get_bug_analysis(project_id: int) -> Dict:
    """Retrieve bug analysis data for the specified project."""
    post_release_bugs = bug_analysis.get_post_release_bugs(project_id)
    resolution_stats = bug_analysis.get_bug_resolution_stats(project_id)

    return {
        "post_release_bugs": post_release_bugs,
        "resolution_stats": resolution_stats
    }

def get_task_management_data() -> List[Dict]:
    """Retrieve task management data for display on the dashboard."""
    query = "SELECT * FROM Tasks ORDER BY created_at DESC"
    return db.execute_query(query, fetch=True)
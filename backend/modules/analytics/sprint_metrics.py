from core.database import db
from typing import List, Dict

def get_sprint_burndown(sprint_id: int) -> list:
    """Retrieve burndown data for a specific sprint."""
    query = """
    SELECT 
        sh.recorded_at::date AS day,
        sh.total_tasks - sh.completed_tasks AS remaining_tasks
    FROM SprintHistory sh
    WHERE sh.sprint_id = %s
    ORDER BY day
    """
    return db.execute_query(query, (sprint_id,), fetch=True)

def get_planning_accuracy(sprint_id: int) -> dict:
    """Calculate planning accuracy for a specific sprint."""
    query = """
    SELECT 
        SUM(t.story_points) AS planned_points,
        SUM(CASE WHEN t.status = 'done' THEN t.story_points ELSE 0 END) AS completed_points
    FROM Tasks t
    WHERE t.sprint_id = %s
    """
    planned, actual = db.execute_query(query, (sprint_id,), fetch=True)[0]
    return {
        "planned": planned or 0,
        "actual": actual or 0,
        "accuracy": actual / planned if planned else 0
    }

def get_time_to_market(project_id: int) -> float:
    """Вычисляет Time to Market для проекта."""
    query = """
    SELECT 
        MIN(t.created_at) AS project_start,
        MAX(t.actual_end_date) AS project_end
    FROM tasks t
    WHERE t.project_id = %s
    """
    result = db.execute_query(query, (project_id,), fetch=True)[0]
    if result["project_start"] and result["project_end"]:
        return (result["project_end"] - result["project_start"]).total_seconds() / 3600
    return 0.0
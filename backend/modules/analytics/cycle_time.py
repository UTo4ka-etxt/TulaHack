from typing import Dict, List
from core.database import db

def get_cycle_time(task_id: int) -> Dict[str, float]:
    """Returns the cycle time for a specific task by stages (in hours)"""
    query = """
    SELECT 
        stage,
        EXTRACT(EPOCH FROM (end_date - start_date))/3600 AS duration_hours
    FROM taskworkflow
    WHERE task_id = %s AND end_date IS NOT NULL
    """
    stages = db.execute_query(query, (task_id,), fetch=True)
    return {stage: duration for stage, duration in stages}

def get_avg_cycle_time(project_id: int) -> Dict[str, float]:
    """Calculates the average cycle time for tasks by stages for a project"""
    query = """
    SELECT 
        tw.stage,
        AVG(EXTRACT(EPOCH FROM (tw.end_date - tw.start_date)))/3600 AS avg_hours
    FROM taskworkflow tw
    JOIN tasks t ON tw.task_id = t.id
    WHERE t.project_id = %s AND tw.end_date IS NOT NULL
    GROUP BY tw.stage
    """
    return dict(db.execute_query(query, (project_id,), fetch=True))
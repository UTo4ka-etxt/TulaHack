from core.database import db
from typing import Dict

def get_developer_load(developer_id: int) -> dict:
    """Calculate the load of a developer (0-1)"""
    query = """
    SELECT 
        COUNT(t.id) AS current_tasks
    FROM employeetasks et
    JOIN tasks t ON et.task_id = t.id
    WHERE et.employee_id = %s AND t.status NOT IN ('done', 'cancelled')
    """
    data = db.execute_query(query, (developer_id,), fetch=True)
    if not data:
        return {"load": 0.0}
    
    current_tasks = data[0][0]
    capacity = 40  # Задаем фиксированное значение рабочей нагрузки
    return {
        "load": min(current_tasks / capacity, 1.0),
        "capacity": capacity
    }

def get_developer_performance(developer_id: int) -> dict:
    """Average time to complete tasks and number of bugs"""
    query = """
    SELECT 
        AVG(EXTRACT(EPOCH FROM (t.actual_end_date - t.created_at)))/3600 AS avg_hours_per_task,
        COUNT(b.id) AS total_bugs
    FROM tasks t
    LEFT JOIN bugs b ON t.id = b.task_id
    JOIN employeetasks et ON t.id = et.task_id
    WHERE et.employee_id = %s AND et.role = 'assignee'
    GROUP BY et.employee_id
    """
    result = db.execute_query(query, (developer_id,), fetch=True)
    return result[0] if result else {"avg_hours_per_task": 0, "total_bugs": 0}
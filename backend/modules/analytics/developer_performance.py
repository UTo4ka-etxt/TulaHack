from core.database import db

def get_developer_load(developer_id: int) -> dict:
    """Calculate the load of a developer (0-1)"""
    query = """
    SELECT 
        COUNT(t.id) AS current_tasks,
        e.workload_capacity
    FROM employeetasks et
    JOIN tasks t ON et.task_id = t.id
    JOIN employees e ON et.employee_id = e.id
    WHERE et.employee_id = %s AND t.status NOT IN ('done', 'cancelled')
    GROUP BY e.id
    """
    data = db.execute_query(query, (developer_id,), fetch=True)
    if not data:
        return {"load": 0.0}
    
    current_tasks, capacity = data[0]
    return {
        "load": min(current_tasks / capacity, 1.0) if capacity > 0 else 0.0,
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
    return db.execute_query(query, (developer_id,), fetch=True)[0] or {}
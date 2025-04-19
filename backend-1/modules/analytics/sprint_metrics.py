from core.database import db

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
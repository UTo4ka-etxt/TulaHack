from core.database import db

def get_post_release_bugs(project_id: int, days: int = 30) -> Dict:
    """Количество багов после релиза и частота откатов"""
    query = """
    SELECT 
        COUNT(*) AS total_bugs,
        SUM(CASE WHEN b.is_regression THEN 1 ELSE 0 END) AS regression_bugs,
        SUM(CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) AS rollbacks
    FROM bugs b
    LEFT JOIN rollbacks r ON b.task_id = r.task_id
    WHERE b.project_id = %s 
      AND b.reported_at >= NOW() - INTERVAL '%s days'
    """
    return db.execute_query(query, (project_id, days), fetch=True)[0]

def get_bug_resolution_stats(project_id: int) -> Dict:
    """Среднее время исправления багов по severity"""
    query = """
    SELECT 
        severity,
        AVG(EXTRACT(EPOCH FROM (resolved_at - reported_at)))/3600 AS avg_hours
    FROM bugs
    WHERE project_id = %s AND resolved_at IS NOT NULL
    GROUP BY severity
    """
    return dict(db.execute_query(query, (project_id,), fetch=True)
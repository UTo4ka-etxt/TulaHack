# filepath: d:\GitHub\planer\backend\core\database.py
import psycopg2
from psycopg2 import OperationalError
from typing import List, Dict, Optional
from .config import settings

class Database:
    def __init__(self):
        self.connection = None
        self.connect()

    def connect(self):
        """Establish a connection to PostgreSQL"""
        try:
            self.connection = psycopg2.connect(
                dbname=settings.DB_NAME,
                user=settings.DB_USER,
                password=settings.DB_PASSWORD,
                host=settings.DB_HOST,
                port=settings.DB_PORT
            )
            print("✅ Successfully connected to PostgreSQL")
        except OperationalError as e:
            print(f"❌ Connection error: {e}")
            raise

    def execute_query(self, query: str, params: tuple = None, fetch: bool = False):
<<<<<<< Updated upstream
        """Universal method for executing queries"""
=======
        """Универсальный метод для выполнения запросов"""
        if not self.connection:
            raise OperationalError("Нет активного соединения с базой данных")
>>>>>>> Stashed changes
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params or ())
                cursor.execute(query)
                return cursor.fetchall()
        except Exception as e:
            self.connection.rollback()
            print(f"⚠️ Query execution error: {e}")
            raise

<<<<<<< Updated upstream
=======
    def get_task(self, task_id: int) -> Optional[Dict]:
        query = """
        SELECT t.*, 
               STRING_AGG(et.role || ':' || e.id || ':' || e.first_name, ', ') as assignees
        FROM tasks t
        LEFT JOIN employeetasks et ON t.id = et.task_id
        LEFT JOIN employees e ON et.employee_id = e.id
        WHERE t.id = %s
        GROUP BY t.id
        """
        result = self.execute_query(query, (task_id,), fetch=True)
        return result[0] if result else None

    def create_task(self, title: str, project_id: int, **kwargs) -> int:
        query = """
        INSERT INTO tasks (title, project_id, sprint_id, status, task_type, story_points)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """
        params = (
            title,
            project_id,
            kwargs.get('sprint_id'),
            kwargs.get('status', 'backlog'),
            kwargs.get('task_type', 'feature'),
            kwargs.get('story_points')
        )
        return self.execute_query(query, params, fetch=True)[0][0]

>>>>>>> Stashed changes
    def get_sprint_metrics(self, sprint_id: int) -> Dict:
        query = """
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed_tasks,
            COALESCE(SUM(story_points), 0) as total_story_points
        FROM tasks
        WHERE sprint_id = %s
        """
        return self.execute_query(query, (sprint_id,), fetch=True)[0]

    def get_developer_performance(self, developer_id: int) -> Dict:
        query = """
        SELECT 
            COUNT(t.id) as total_tasks,
            AVG(EXTRACT(EPOCH FROM (t.actual_end_date - t.created_at))/3600) as avg_hours_per_task
        FROM tasks t
        JOIN employeetasks et ON t.id = et.task_id
        WHERE et.employee_id = %s AND et.role = 'assignee'
        """
        return self.execute_query(query, (developer_id,), fetch=True)[0]

<<<<<<< Updated upstream
    def create_task(self, title: str, project_id: int, **kwargs) -> int:
        query = """
        INSERT INTO tasks (title, project_id, sprint_id, status, task_type, story_points)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """
        params = (
            title,
            project_id,
            kwargs.get('sprint_id'),
            kwargs.get('status', 'backlog'),
            kwargs.get('task_type', 'feature'),
            kwargs.get('story_points')
        )
        return self.execute_query(query, params, fetch=True)[0][0]

# Global database instance
=======
>>>>>>> Stashed changes
db = Database()
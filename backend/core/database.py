import psycopg2
from psycopg2 import OperationalError

def connect_to_database():
    try:
        connection = psycopg2.connect(
            dbname="Planer",
            user="postgres",
            password="2002",
            host="localhost",
            port="5432"
        )
        print("Успешно подключено к базе данных")
        return connection
    except OperationalError as e:
        print(f"Ошибка подключения к базе данных: {e}")
        return None
    
# Получение всех задач
def get_all_tasks(connection):
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Tasks")
        tasks = cursor.fetchall()
        cursor.close()
        return tasks
    except Exception as e:
        print(f"Ошибка при получении задач: {e}")
        return []

# Добавление новой задачи
def add_task(connection, title, description, project_id, status="backlog"):
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO Tasks (title, description, project_id, status)
            VALUES (%s, %s, %s, %s) RETURNING id
            """,
            (title, description, project_id, status)
        )
        task_id = cursor.fetchone()[0]
        connection.commit()
        cursor.close()
        print(f"Задача добавлена с ID: {task_id}")
        return task_id
    except Exception as e:
        print(f"Ошибка при добавлении задачи: {e}")
        return None

# Обновление задачи
def update_task(connection, task_id, title=None, description=None, status=None):
    try:
        cursor = connection.cursor()
        query = sql.SQL("""
            UPDATE Tasks
            SET {fields}
            WHERE id = %s
        """).format(
            fields=sql.SQL(", ").join(
                sql.Composed([sql.Identifier(field), sql.SQL(" = %s")])
                for field in ["title", "description", "status"] if locals()[field] is not None
            )
        )
        values = [value for value in [title, description, status] if value is not None] + [task_id]
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        print(f"Задача с ID {task_id} обновлена")
    except Exception as e:
        print(f"Ошибка при обновлении задачи: {e}")

# Удаление задачи
def delete_task(connection, task_id):
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM Tasks WHERE id = %s", (task_id,))
        connection.commit()
        cursor.close()
        print(f"Задача с ID {task_id} удалена")
    except Exception as e:
        print(f"Ошибка при удалении задачи: {e}")
# filepath: d:\GitHub\planer\backend\modules\auth\login.py
import hashlib
from core.database import connect_to_database

# Хэширование пароля
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Логика авторизации
def login_user(connection, login, password):
    cursor = connection.cursor()
    try:
        hashed_password = hash_password(password)
        cursor.execute(
            """
            SELECT id, last_name, first_name, middle_name, access_level, position, is_active
            FROM Employees
            WHERE login = %s AND password_hash = %s
            """,
            (login, hashed_password)
        )
        user = cursor.fetchone()

        if user:
            if not user[6]:
                return {"error": "Пользователь неактивен"}
            return {
                "id": user[0],
                "last_name": user[1],
                "first_name": user[2],
                "middle_name": user[3],
                "access_level": user[4],
                "position": user[5],
                "is_active": user[6]
            }
        else:
            return {"error": "Неверный логин или пароль"}
    except Exception as e:
        print(f"Ошибка при авторизации: {e}")
        return {"error": "Ошибка при авторизации"}
    finally:
        cursor.close()
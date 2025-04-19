# filepath: d:\GitHub\planer\backend\modules\auth\register.py
import hashlib
from core.database import connect_to_database

# Хэширование пароля
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Логика регистрации
def register_user(connection, last_name, first_name, middle_name, birth_date, login, password, access_level, position):
    try:
        cursor = connection.cursor()
        hashed_password = hash_password(password)
        
        # Проверка уникальности логина
        cursor.execute(
            "SELECT id FROM Employees WHERE login = %s",
            (login,)
        )
        if cursor.fetchone():
            return {"error": "Пользователь с таким логином уже существует"}
        
        # Добавление нового пользователя
        cursor.execute(
            """
            INSERT INTO Employees (last_name, first_name, middle_name, birth_date, login, password_hash, access_level, position)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """,
            (last_name, first_name, middle_name, birth_date, login, hashed_password, access_level, position)
        )
        user_id = cursor.fetchone()[0]
        connection.commit()
        cursor.close()
        return {"message": "Пользователь успешно зарегистрирован", "user_id": user_id}
    except Exception as e:
        print(f"Ошибка при регистрации: {e}")
        return {"error": "Ошибка при регистрации"}
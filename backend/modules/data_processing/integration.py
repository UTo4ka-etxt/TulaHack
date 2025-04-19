<<<<<<< Updated upstream
<<<<<<< Updated upstream
# filepath: d:\GitHub\planer\backend\modules\data_processing\integration.py

# This file is intentionally left blank.
=======
=======
>>>>>>> Stashed changes
import csv
import requests
from datetime import datetime
from core.database import db


def import_jira_data(csv_file_path: str):
    """
    Импорт данных из выгрузки JIRA в базу данных.
    :param csv_file_path: Путь к CSV-файлу с данными JIRA.
    """
    with open(csv_file_path, encoding="cp1251") as csv_file:  # Указана кодировка cp1251
        reader = csv.DictReader(csv_file)
        for row in reader:
            try:
                # Проверка существования проекта
                project_name = "JIRA Integration Project"
                project_id = db.execute_query(
                    "SELECT id FROM Projects WHERE name = %s", (project_name,), fetch=True
                )
                if not project_id:
                    project_id = db.execute_query(
                        """
                        INSERT INTO Projects (name, description, status)
                        VALUES (%s, %s, %s) RETURNING id
                        """,
                        (project_name, "Проект для интеграции с JIRA", "active"),
                        fetch=True,
                    )[0]["id"]
                else:
                    project_id = project_id[0]["id"]

                # Вставка задачи в таблицу Tasks
                task_id = db.execute_query(
                    """
                    INSERT INTO Tasks (project_id, title, description, created_at, status, priority, task_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
                    """,
                    (
                        project_id,
                        row["Название задачи"],  # Название задачи
                        row["Тип задачи"],  # Тип задачи
                        datetime.now(),  # Текущая дата как дата создания
                        "done" if row["Статус"] == "Done" else "todo",  # Статус
                        row["Приоритет"],  # Приоритет
                        "bug" if row["Тип задачи"] == "Bug" else "feature",  # Тип задачи
                    ),
                    fetch=True,
                )[0]["id"]

                # Вставка данных в таблицу Bugs
                db.execute_query(
                    """
                    INSERT INTO Bugs (task_id, project_id, title, severity, status, reported_at, resolved_at, is_regression)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        task_id,
                        project_id,
                        row["Название задачи"],  # Название задачи
                        row["Приоритет"],  # Severity
                        "fixed" if row["Статус"] == "Done" else "reported",  # Статус
                        row["Дата создания"],  # Дата создания
                        row["Дата завершения"],  # Дата завершения
                        False,  # Пример значения для is_regression
                    ),
                )

                # Вставка данных в таблицу EmployeeTasks
                db.execute_query(
                    """
                    INSERT INTO EmployeeTasks (employee_id, task_id, role, assigned_at)
                    VALUES (
                        (SELECT id FROM Employees WHERE login = %s LIMIT 1),
                        %s,
                        'assignee',
                        %s
                    )
                    """,
                    (
                        row["Исполнитель"],  # Логин сотрудника
                        task_id,
                        datetime.now(),  # Текущая дата как дата назначения
                    ),
                )
            except Exception as e:
                print(f"Ошибка при импорте строки: {row}. Ошибка: {e}")


def import_github_issues(repo: str, token: str):
    """
    Импорт данных о задачах из GitHub в базу данных.
    :param repo: Репозиторий в формате "owner/repo".
    :param token: Токен для доступа к API GitHub.
    """
    url = f"https://api.github.com/repos/{repo}/issues"
    headers = {"Authorization": f"token {token}"}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        issues = response.json()
        for issue in issues:
            try:
                # Проверка существования проекта
                project_name = "GitHub Integration Project"
                project_id = db.execute_query(
                    "SELECT id FROM Projects WHERE name = %s", (project_name,), fetch=True
                )
                if not project_id:
                    project_id = db.execute_query(
                        """
                        INSERT INTO Projects (name, description, status)
                        VALUES (%s, %s, %s) RETURNING id
                        """,
                        (project_name, "Проект для интеграции с GitHub", "active"),
                        fetch=True,
                    )[0]["id"]
                else:
                    project_id = project_id[0]["id"]

                # Вставка задачи в таблицу Tasks
                task_id = db.execute_query(
                    """
                    INSERT INTO Tasks (project_id, title, description, created_at, status, priority, task_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
                    """,
                    (
                        project_id,
                        issue["title"],
                        issue["body"],
                        issue["created_at"],
                        "done" if issue["state"] == "closed" else "todo",
                        "medium",  # Приоритет по умолчанию
                        "feature",  # Тип задачи
                    ),
                    fetch=True,
                )[0]["id"]

                # Вставка данных в таблицу EmployeeTasks
                if "assignee" in issue and issue["assignee"]:
                    db.execute_query(
                        """
                        INSERT INTO EmployeeTasks (employee_id, task_id, role, assigned_at)
                        VALUES (
                            (SELECT id FROM Employees WHERE login = %s LIMIT 1),
                            %s,
                            'assignee',
                            %s
                        )
                        """,
                        (
                            issue["assignee"]["login"],
                            task_id,
                            datetime.now(),
                        ),
                    )
            except Exception as e:
                print(f"Ошибка при импорте задачи: {issue['title']}. Ошибка: {e}")
    else:
<<<<<<< Updated upstream
        print(f"Ошибка при запросе к GitHub API: {response.status_code}")
>>>>>>> Stashed changes
=======
        print(f"Ошибка при запросе к GitHub API: {response.status_code}")
>>>>>>> Stashed changes

from core.database import db
from modules.analytics import sprint_metrics, developer_performance, bug_analysis
from fastapi import FastAPI
from modules.visualization.dashboard_builder import router as dashboard_router

app = FastAPI(
    title="Planer Dashboard API",
    description="API для получения данных дашборда",
    version="1.0.0"
)

app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "Добро пожаловать в API дашборда!"}

def main():
    # Инициализация подключения к базе данных
    db.connect()

    # Обзор дашборда
    result = db.execute_query("SELECT COUNT(*) FROM tasks", fetch=True)
    if result:
        total_tasks = result[0][0]
    else:
        total_tasks = 0
    result = db.execute_query("SELECT COUNT(*) FROM tasks WHERE status = 'done'", fetch=True)
    if result:
        completed_tasks = result[0][0]
    else:
        completed_tasks = 0
    result = db.execute_query("SELECT COUNT(*) FROM sprints WHERE status = 'active'", fetch=True)
    if result:
        active_sprints = result[0][0]
    else:
        active_sprints = 0

    print("Обзор дашборда:")
    print(f"Всего задач: {total_tasks}")
    print(f"Завершенных задач: {completed_tasks}")
    print(f"Активных спринтов: {active_sprints}")

    # Метрики спринта
    sprint_id = 1  # Пример ID спринта
    burndown_data = sprint_metrics.get_sprint_burndown(sprint_id)
    planning_accuracy = sprint_metrics.get_planning_accuracy(sprint_id)

    print("\nМетрики спринта:")
    print("Данные Burndown:", burndown_data)
    print("Точность планирования:", planning_accuracy)

    # Производительность разработчика
    developer_id = 1  # Пример ID разработчика
    developer_load = developer_performance.get_developer_load(developer_id)
    developer_performance_data = developer_performance.get_developer_performance(developer_id)

    print("\nПроизводительность разработчика:")
    print("Загрузка:", developer_load)
    print("Данные производительности:", developer_performance_data)

    # Анализ багов
    project_id = 1  # Пример ID проекта
    bug_stats = bug_analysis.get_post_release_bugs(project_id)
    
    print("\nАнализ багов:")
    print("Статистика багов:", bug_stats)

if __name__ == "__main__":
    main()
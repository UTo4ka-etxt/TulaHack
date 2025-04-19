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
    # Initialize the database connection
    db.connect()

    # Dashboard Overview
    total_tasks = db.execute_query("SELECT COUNT(*) FROM tasks")[0][0]
    completed_tasks = db.execute_query("SELECT COUNT(*) FROM tasks WHERE status = 'done'")[0][0]
    active_sprints = db.execute_query("SELECT COUNT(*) FROM sprints WHERE status = 'active'")[0][0]

    print("Dashboard Overview:")
    print(f"Total Tasks: {total_tasks}")
    print(f"Completed Tasks: {completed_tasks}")
    print(f"Active Sprints: {active_sprints}")

    # Sprint Metrics
    sprint_id = 1  # Example sprint ID
    burndown_data = sprint_metrics.get_sprint_burndown(sprint_id)
    planning_accuracy = sprint_metrics.get_planning_accuracy(sprint_id)

    print("\nSprint Metrics:")
    print("Burndown Data:", burndown_data)
    print("Planning Accuracy:", planning_accuracy)

    # Developer Performance
    developer_id = 1  # Example developer ID
    developer_load = developer_performance.get_developer_load(developer_id)
    developer_performance_data = developer_performance.get_developer_performance(developer_id)

    print("\nDeveloper Performance:")
    print("Load:", developer_load)
    print("Performance Data:", developer_performance_data)

    # Bug Analysis
    project_id = 1  # Example project ID
    bug_stats = bug_analysis.get_post_release_bugs(project_id)
    
    print("\nBug Analysis:")
    print("Bug Stats:", bug_stats)

if __name__ == "__main__":
    main()
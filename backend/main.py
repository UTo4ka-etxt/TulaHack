from core.database import db
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
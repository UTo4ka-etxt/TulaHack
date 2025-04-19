<<<<<<< Updated upstream
# filepath: d:\GitHub\planer\backend\modules\prediction\timeline_prediction.py

# This file is intentionally left blank.
=======
from sklearn.linear_model import LinearRegression
import numpy as np

def predict_task_completion_time(features: np.array, target: np.array, new_task: np.array) -> float:
    """Предсказывает время завершения задачи на основе исторических данных."""
    model = LinearRegression()
    model.fit(features, target)
    return model.predict([new_task])[0]
>>>>>>> Stashed changes

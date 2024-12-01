from locust import HttpUser, task, between

class DiabetesPredictionUser(HttpUser):
    wait_time = between(1, 3)  # Seconds between requests

    @task
    def predict(self):
        payload = {
            "gender": "Male",
            "age": 45,
            "hypertension": 1,
            "heart_disease": 0,
            "bmi": 27.5,
            "HbA1c_level": 7.2,
            "blood_glucose_level": 180,
            "smoking_history": "never"
        }
        self.client.post("/predict/", data=payload)

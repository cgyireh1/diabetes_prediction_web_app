import os
import joblib
import pandas as pd
import json
import shutil
from pydantic import BaseModel, Field
from fastapi import FastAPI, Form, UploadFile, Request, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from src.model import ModelPipeline
from src.prediction import DataPrediction
from src.preprocessing import DataPreprocessing
from datetime import datetime

app = FastAPI()


class FileUploadRequest(BaseModel):
    file: UploadFile = File(..., description="CSV file with data for retraining")
    retrain: bool = Form(False, description="Whether to retrain the model after file upload")

# Mount static files and pages
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/pages", StaticFiles(directory="pages"), name="pages")

templates = Jinja2Templates(directory="pages")

# Paths to the saved model and scaler (Update paths accordingly)
model_path = "models/randomforest_model.pkl"
scaler_path = "models/scaler.pkl"
encoder_path = "models/encoder.pkl"

# Initialize prediction object
predictor = DataPrediction(model_path=model_path, scaler_path=scaler_path, encoder_path=encoder_path)

# Path for the retraining logs
LOG_FILE_PATH = "logs/retraining_log.json"

#  the uploaded file
def save_uploaded_file(upload_file: UploadFile, destination: str):
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

class PredictionRequest(BaseModel):
    gender: str = Field(..., example="e.g. Male/Female")
    age: int = Field(..., example="Enter age")
    hypertension: int = Field(..., example="e.g. 1 for Yes, 0 for No")
    heart_disease: int = Field(..., example="e.g. 1 for Yes, 0 for No")
    bmi: float = Field(..., example="e.g. 25")
    HbA1c_level: float = Field(..., example="e.g. 7.0")
    blood_glucose_level: float = Field(..., example="e.g. 100")
    smoking_history: str = Field(..., example="e.g. Never or Former or Current")

# Home Route (index.html)
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Home"})

# Model Prediction Endpoint
@app.post("/predict/")
async def predict(request: PredictionRequest):
    # Prepare input for the model
    new_data = pd.DataFrame([{
        "gender": request.gender,
        "age": request.age,
        "hypertension": request.hypertension,
        "heart_disease": request.heart_disease,
        "bmi": request.bmi,
        "HbA1c_level": request.HbA1c_level,
        "blood_glucose_level": request.blood_glucose_level,
        "smoking_history": request.smoking_history,
    }])

    try:
        print(f"Received data: {new_data}")  # Log the data received
        
        prediction_result = predictor.predict_single(new_data)
        
        # Log the prediction result for debugging
        print(f"Prediction result: {prediction_result}")

        if prediction_result == 1:
            prediction_message = "Diabetic. You should consult a doctor for a proper treatment plan 🫶."
        else:
            prediction_message = "Non-Diabetes, You do not have diabetes. Keep up the healthy lifestyle! 🎉"
        
        return {"Prediction": prediction_message}
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {"error": f"An error occurred: {str(e)}"}
    
# Data Upload Page
@app.get("/upload_data/", response_class=HTMLResponse)
async def upload_page(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request, "title": "Upload Data"})

# Data Upload Endpoint
@app.post("/upload_data/")
async def upload_data(file: UploadFile = File(...), retrain: str = Form("false")):
    retrain = retrain.lower() == "true"  # Convert string to boolean
    message = ""
    error = ""

    try:
        # Ensure directories exist
        os.makedirs(os.path.dirname("static/uploads/"), exist_ok=True)

        # Save the uploaded file with a timestamp to avoid overwriting
        file_location = f"static/uploads/{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(file.file.read())

        # Validate file structure
        data_preprocessor = DataPreprocessing(file_location)
        if not data_preprocessor.validate_columns():
            error = "Invalid file structure. Please check the columns in the uploaded file."
            return JSONResponse(content={"error": error}, status_code=400)

        if retrain:
            # Log retraining information
            retraining_log = {
                "timestamp": pd.Timestamp.now().isoformat(),
                "dataset_used": file.filename,
                "model_path": model_path,
                "scaler_path": scaler_path,
            }

            # Ensure the logs directory exists
            os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

            # Append retraining logs
            if os.path.exists(LOG_FILE_PATH):
                with open(LOG_FILE_PATH, "r") as f:
                    retraining_logs = json.load(f)
            else:
                retraining_logs = []

            retraining_logs.append(retraining_log)
            with open(LOG_FILE_PATH, "w") as f:
                json.dump(retraining_logs, f, indent=4)

            # Retrain the model
            message = "File uploaded successfully, and retraining triggered."

            # Perform retraining and save model
            model_pipeline = ModelPipeline()
            X, y = data_preprocessor.preprocess_data()

            # Retrain the model
            trained_model = model_pipeline.retrain_model(X, y)

            # Save the retrained model
            model_pipeline.save_model(trained_model)
            model_pipeline.save_scaler()

        else:
            message = "File uploaded successfully, but retraining not triggered."

        return JSONResponse(content={"message": message})

    except Exception as e:
        error = f"Error during file upload or retraining: {str(e)}"
        return JSONResponse(content={"error": error}, status_code=500)

# Retrain Model Page
@app.get("/retrain/", response_class=HTMLResponse)
async def retrain_page(request: Request):
    return templates.TemplateResponse("retrain.html", {"request": request, "title": "Retrain Model"})

@app.post("/retrain/")
async def retrain_model(file: UploadFile = File(...)):
    file_location = f"static/uploads/{file.filename}"

    os.makedirs(os.path.dirname(file_location), exist_ok=True)

    with open(file_location, "wb") as f:
        f.write(file.file.read())

    try:
        data_preprocessor = DataPreprocessing(file_location)
        X, y = data_preprocessor.preprocess_data()
        X_train, X_test, y_train, y_test = data_preprocessor.split_data(X, y)

        model_pipeline = ModelPipeline()

        # Retrain the model
        trained_model, model_filename = model_pipeline.retrain_model(X_train, y_train)

        # Return response with model path
        return JSONResponse(content={
            "message": "Model retrained successfully",
            "model_path": model_filename
        })

    except Exception as e:
        # Return a more detailed error message
        return JSONResponse(status_code=400, content={"error": f"Failed to retrain model: {str(e)}"})


# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:5000",
    "http://localhost:5501",
    "https://diabetes-prediction-web-app-l0ks.onrender.com" # for production
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

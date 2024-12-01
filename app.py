import os
import joblib
import pandas as pd
from pydantic import BaseModel
from src.model import ModelPipeline
from src.prediction import DataPrediction
from src.preprocessing import DataPreprocessing
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form, UploadFile, Request


app = FastAPI()

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/pages", StaticFiles(directory="pages"), name="pages")

templates = Jinja2Templates(directory="pages")

# Paths to the saved model and scaler (Update paths accordingly)
model_path = "models/randomforest_model.pkl"
scaler_path = "models/scaler.pkl"

# Initialize prediction object
predictor = DataPrediction(model_path=model_path, scaler_path=scaler_path)

# Home Route
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Home"})

# Model Prediction Endpoint
@app.post("/predict/")
async def predict(
    gender: str = Form(...),
    age: float = Form(...),
    bmi: float = Form(...),
    blood_glucose_level: float = Form(...),
):
    # Prepare input for the model
    new_data = pd.DataFrame([[gender, age, bmi, blood_glucose_level]],
                            columns=["gender", "age", "bmi", "blood_glucose_level"])
    
    # Make prediction
    result = predictor.predict_single(new_data)
    
    return {"Prediction": result}

# Data Upload Page
@app.get("/upload_data/", response_class=HTMLResponse)
async def upload_page(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request, "title": "Upload Data"})

# Data Upload Endpoint
@app.post("/upload_data/")
async def upload_data(file: UploadFile):
    file_location = f"static/uploads/{file.filename}"
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    return {"message": "File uploaded successfully", "file_path": file_location}

# Retrain Model Page
@app.get("/retrain/", response_class=HTMLResponse)
async def retrain_page(request: Request):
    return templates.TemplateResponse("retrain.html", {"request": request, "title": "Retrain"})

# Retrain Model Endpoint
@app.post("/retrain/")
async def retrain_model(file: UploadFile):
    # Save the uploaded CSV file
    file_location = f"static/uploads/{file.filename}"
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, "wb") as f:
        f.write(file.file.read())

    try:
        # Initialize preprocessing
        data_preprocessor = DataPreprocessing(file_location)
        
        # Preprocess the data
        X, y = data_preprocessor.preprocess_data()
        
        # Split data into train/test sets
        X_train, X_test, y_train, y_test = data_preprocessor.split_data(X, y)
        
        # Initialize the model pipeline
        model_pipeline = ModelPipeline()

        # Train and save the model
        trained_model = model_pipeline.retrain_model(X_train, y_train)

        # Save the scaler (for prediction later)
        scaler_path = os.path.join(model_pipeline.model_dir, "scaler.pkl")
        joblib.dump(model_pipeline.scaler, scaler_path)

        return {
            "message": "Model retrained successfully",
            "model_path": f"{model_pipeline.model_dir}/retrained_model.pkl",
            "scaler_path": scaler_path,
        }

    except Exception as e:
        return {"error": str(e)}


origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8080",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

